// Production uses the Flask origin. Development can use VITE_API_URL or the Vite proxy.
const BASE = (import.meta.env.DEV ? import.meta.env.VITE_API_URL || "" : import.meta.env.VITE_PRODUCTION_API_URL || "").replace(/\/$/, "");

async function request(path, options = {}, timeout = 12000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(BASE + path, { ...options, cache: "no-store", signal: controller.signal });
    const type = response.headers.get("content-type") || "";
    if (!type.includes("application/json")) {
      throw new Error("The diagnosis server returned an unexpected response. Check that the backend is running.");
    }
    const body = await response.json();
    if (!response.ok) throw new Error(body.error || "The server could not complete this request.");
    return body;
  } catch (error) {
    if (error.name === "AbortError") throw new Error("The diagnosis server took too long to respond. Please try again.");
    if (error instanceof TypeError) throw new Error("Cannot reach the diagnosis server. Check that MechDoctor is running, then retry.");
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

export const getHealth = () => request("/api/health");
export async function getMachines() {
  const data = await request("/api/machines");
  if (!Array.isArray(data.machines) || !data.machines.length) throw new Error("No machine catalogue was returned by the server.");
  return data.machines;
}
export async function diagnoseMachine(payload) {
  const data = await request("/api/diagnose", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }, 60000);
  if (!data || !Array.isArray(data.faults) || typeof data.ai_summary !== "string") {
    throw new Error("The diagnosis response is incomplete. Please try again.");
  }
  return data;
}
