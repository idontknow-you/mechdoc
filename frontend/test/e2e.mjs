import assert from "node:assert/strict";
import { existsSync, mkdirSync } from "node:fs";
import { chromium } from "playwright";

const base = process.env.MECHDOCTOR_TEST_URL || "http://localhost:5000";
const browserPath = process.env.MECHDOCTOR_BROWSER || [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
].find(existsSync);
const browser = await chromium.launch({ headless: true, ...(browserPath ? { executablePath: browserPath } : {}) });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
page.setDefaultTimeout(15000);
mkdirSync("test-artifacts", { recursive: true });

async function assertNoOverflow() {
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), "Page has horizontal overflow");
}

async function submitScenario(label, expectedTop) {
  await page.locator(".preset-button").filter({ hasText: label }).click();
  const pending = page.waitForResponse((response) => response.url().endsWith("/api/diagnose") && response.request().method() === "POST", { timeout: 65000 });
  await page.getByRole("button", { name: "Analyse machine", exact: true }).click();
  const response = await pending;
  const report = await response.json();
  assert.equal(response.status(), 200, "Diagnosis API did not return success");
  await page.locator(".fault-card").first().waitFor();
  assert.equal(await page.locator(".fault-card").count(), report.faults.length);
  assert(expectedTop.includes(report.faults[0].id), "Unexpected highest-ranked fault");
  const scores = report.faults.map((fault) => fault.score);
  assert.deepEqual(scores, [...scores].sort((a, b) => b - a));
  const renderedScores = await page.locator(".rule-score strong").allTextContents();
  assert.deepEqual(renderedScores.map(Number), scores);
  const text = await page.locator(".report-content").innerText();
  for (const section of ["AI summary", "Ranked faults", "confidence", "Supporting symptoms", "Reasoning", "Inspection steps", "Maintenance actions", "Safety precautions", "Uncertainty", "not a certified engineering diagnosis"]) assert(text.includes(section), "Missing report section: " + section);
  assert.equal(await page.locator(".summary-card > p").first().innerText(), report.ai_summary);
  if (report.ai_source === "template") assert.equal(await page.locator(".source-badge").count(), 0);
  else assert(await page.locator(".source-badge").innerText());
  console.log(`${label}: ${report.faults.length} ranked faults; explanation source=${report.ai_source}`);
  return report;
}

try {
  await page.goto(base);
  await page.locator(".connection-badge.connected").waitFor();
  assert.equal(await page.locator(".machine-card").count(), 4);
  await assertNoOverflow();
  await page.screenshot({ path: "test-artifacts/desktop-dashboard.png", fullPage: true });
  await page.getByRole("button", { name: "Start a diagnosis", exact: true }).click();
  await page.locator("#temperature_c").waitFor();
  assert.equal(await page.locator('input[name="machine"]').count(), 4);
  assert.equal(await page.locator('#leakage option[value="major"]').count(), 1);
  assert.equal(await page.locator('#performance option[value="major"]').count(), 1);
  assert.equal(await page.locator('#noise option[value="whining"]').count(), 1);
  assert.equal(await page.locator('#noise option[value="crackling"]').count(), 1);
  await page.screenshot({ path: "test-artifacts/desktop-inputs.png", fullPage: true });
  const originalMotorReport = await submitScenario("Motor overheating", ["overload", "poor_ventilation"]);
  if (process.env.MECHDOCTOR_REQUIRE_GEMINI === "1") assert.equal(originalMotorReport.ai_source, "gemini");
  await page.getByRole("button", { name: "Edit inputs", exact: true }).click();
  await page.locator("#temperature_c").fill("96");
  const changedResponse = page.waitForResponse((response) => response.url().endsWith("/api/diagnose") && response.request().method() === "POST", { timeout: 65000 });
  await page.getByRole("button", { name: "Analyse machine", exact: true }).click();
  const updatedResponse = await changedResponse;
  assert.equal(updatedResponse.status(), 200);
  const updatedMotorReport = await updatedResponse.json();
  await page.locator(".fault-card").first().waitFor();
  assert.equal(updatedMotorReport.inputs.temperature_c, 96);
  assert.notEqual(updatedMotorReport.ai_summary, originalMotorReport.ai_summary, "Changed readings must produce a fresh summary");
  if (process.env.MECHDOCTOR_REQUIRE_GEMINI === "1") assert.equal(updatedMotorReport.ai_source, "gemini");
  assert.equal(await page.locator(".summary-card > p").first().innerText(), updatedMotorReport.ai_summary);
  assert(updatedMotorReport.ai_summary.includes("96"), "Summary must reflect the current temperature");
  console.log(`Changed temperature 95 -> 96: new summary verified; source=${updatedMotorReport.ai_source}`);
  await page.getByRole("button", { name: "Edit inputs", exact: true }).click();
  await submitScenario("Pump vibration", ["misalignment", "imbalance"]);
  await page.screenshot({ path: "test-artifacts/desktop-report.png", fullPage: true });
  await page.evaluate(() => { window.print = () => { window.__printCalled = true; }; });
  await page.getByRole("button", { name: "Print / PDF", exact: true }).click();
  assert(await page.evaluate(() => window.__printCalled));
  await page.setViewportSize({ width: 390, height: 844 });
  await assertNoOverflow();
  await page.screenshot({ path: "test-artifacts/mobile-report.png", fullPage: true });
  await page.getByRole("button", { name: "Open navigation", exact: true }).click();
  await page.getByRole("link", { name: "Dashboard", exact: true }).click();
  await page.getByRole("heading", { name: "Mechanical diagnostics, made clear.", exact: true }).waitFor();
  await assertNoOverflow();
  await page.screenshot({ path: "test-artifacts/mobile-dashboard.png", fullPage: true });
  await page.getByRole("button", { name: "Start a diagnosis", exact: true }).click();
  await assertNoOverflow();
  await page.screenshot({ path: "test-artifacts/mobile-inputs.png", fullPage: true });
  for (const id of ["electric_motor", "water_pump", "gearbox", "conveyor_belt"]) {
    await page.locator(`input[value="${id}"]`).check();
    assert.equal(await page.locator(".form-field").count(), 7);
  }
  await page.getByRole("button", { name: "Reset inputs", exact: true }).click();
  assert.equal(await page.locator("#temperature_c").inputValue(), "");
  assert.equal(await page.locator("#noise").inputValue(), "");
  await page.route("**/api/diagnose", (route) => route.fulfill({ status: 400, contentType: "application/json", body: JSON.stringify({ error: "Please check the submitted readings." }) }));
  await page.getByRole("button", { name: "Analyse machine", exact: true }).click();
  await page.getByRole("heading", { name: "The analysis could not be completed", exact: true }).waitFor();
  assert((await page.getByRole("alert").innerText()).includes("Please check the submitted readings."));
  await page.unroute("**/api/diagnose");
  for (const [path, heading] of [["how-it-works", "From symptoms to next steps."], ["safety", "Safety guidelines"], ["about", "Clearer information. Better prepared inspections."]]) {
    await page.getByRole("button", { name: "Open navigation", exact: true }).click();
    await page.locator(`nav a[href="#${path}"]`).click();
    await page.getByRole("heading", { name: heading, exact: true }).waitFor();
    await assertNoOverflow();
  }
  assert.deepEqual(errors, [], "Browser runtime errors");
  console.log("PASS: live API scenarios, scores, all report sections, machine forms, reset, error handling, print, navigation, and mobile overflow checks.");
} finally {
  await browser.close();
}
