import { useCallback, useEffect, useRef, useState } from "react";
import MachineSelector, { DEFAULT_MACHINES } from "@components/MachineSelector";
import InputForm, { SCENARIOS } from "@components/InputForm";
import DiagnosisReport from "@components/DiagnosisReport";
import SafetyBanner from "@components/SafetyBanner";
import Icon, { machineIcons } from "./components/Icon";
import { diagnoseMachine, getHealth, getMachines } from "./api";

const NAV = [
  ["dashboard", "Dashboard", "grid"],
  ["diagnose", "Diagnose machine", "tool"],
  ["report", "Diagnosis report", "report"],
  ["how-it-works", "How it works", "flow"],
  ["safety", "Safety guidelines", "shield"],
  ["about", "About MechDoctor", "info"],
];
const readPage = () => NAV.some(([id]) => id === window.location.hash.slice(1)) ? window.location.hash.slice(1) : "dashboard";
const emptyValues = () => ({ temperature_c: "", speed_rpm: "", vibration: "", noise: "", leakage: "", performance: "", notes: "" });

function Dashboard({ machines, health, report, onStart, onScenario, onNavigate }) {
  return (
    <>
      <section className="dashboard-hero">
        <div className="hero-copy"><span className="eyebrow"><span />YOUR MAINTENANCE WORKSPACE</span><h1>Mechanical diagnostics,<br /><span>made clear.</span></h1><p>Turn equipment readings and field observations into a clear, ranked guide for your next inspection.</p><div className="button-group"><button className="button primary large" onClick={() => onStart()}><Icon name="tool" size={18} />Start a diagnosis<Icon name="arrow" size={18} /></button><button className="button text-button" onClick={() => onNavigate("how-it-works")}>How it works<Icon name="arrow" size={16} /></button></div><div className="hero-footnote"><Icon name="shield" size={15} />Built to support a technician's judgment.</div></div>
        <div className="hero-process card">
          <span className="overline">FROM OBSERVATION TO ACTION</span>
          <div className="process-row"><span className="icon-tile"><Icon name="pulse" size={24} /></span><div><span>01 / OBSERVE</span><strong>Record what you know</strong><p>Temperature, noise, vibration & more</p></div></div>
          <div className="process-connector" />
          <div className="process-row"><span className="icon-tile"><Icon name="flow" size={24} /></span><div><span>02 / EVALUATE</span><strong>Rank possible causes</strong><p>Weighted rules + a clear explanation</p></div></div>
          <div className="process-connector" />
          <div className="process-row"><span className="icon-tile"><Icon name="tool" size={24} /></span><div><span>03 / INSPECT</span><strong>Know what to check next</strong><p>Inspection, maintenance & safety steps</p></div></div>
        </div>
      </section>
      <div className="status-grid">
        <div><span className="overline">BACKEND CONNECTION</span><strong><span className={`status-dot ${health ? "online" : ""}`} />{health ? "Connected" : "Checking connection"}</strong></div>
        <div><span className="overline">SUPPORTED EQUIPMENT</span><strong>{machines.length || "—"} machine classes</strong></div>
        <div><span className="overline">DIAGNOSIS METHOD</span><strong>Rules + explanation</strong></div>
        <div><span className="overline">LATEST ASSESSMENT</span><strong>{report ? report.machine_label : "Ready for your first report"}</strong></div>
      </div>
      <section className="machine-section"><div className="section-heading"><div><span className="overline">CHOOSE YOUR EQUIPMENT</span><h2>One workspace. Four machine classes.</h2></div><span className="soft-badge">{machines.length} available</span></div><div className="machine-card-grid">{machines.map((machine) => <article className="machine-card card" key={machine.id}><div className="machine-card-top"><span className="icon-tile"><Icon name={machineIcons[machine.id]} size={28} /></span><span className="overline">0{machines.indexOf(machine) + 1}</span></div><h3>{machine.label}</h3><p>{machine.description}</p><div className="machine-card-meta"><span>REFERENCE TEMPERATURE</span><strong>{machine.typical_temp_range_c ? machine.typical_temp_range_c.join("–") + " °C" : "See equipment specification"}</strong></div><button className="button machine-card-button" onClick={() => onStart(machine.id)}>Diagnose equipment<Icon name="arrow" size={17} /></button></article>)}</div></section>
      <section className="demo-card card"><div><span className="icon-tile"><Icon name="spark" size={23} /></span><div><span className="overline">TAKE A QUICK LOOK</span><h3>Try it with sample observations</h3><p>Load a scenario, review its readings, then run the real diagnosis engine.</p></div></div><div className="button-group"><button className="button secondary" onClick={() => onScenario(SCENARIOS[1])}>Motor overheating<Icon name="arrow" size={16} /></button><button className="button secondary" onClick={() => onScenario(SCENARIOS[2])}>Pump vibration<Icon name="arrow" size={16} /></button></div></section>
      <div className="notice-strip"><Icon name="info" size={19} /><span>Preliminary guidance only, not a certified engineering diagnosis. Confirm all findings with a qualified technician.</span></div>
    </>
  );
}

function InformationPage({ page, report, onStart }) {
  if (page === "safety") return <><div className="page-heading"><span className="overline">SAFE WORK COMES FIRST</span><h1>Safety guidelines</h1><p>Follow your site's procedures and the equipment manufacturer's instructions for every task.</p></div><SafetyBanner precautions={report?.safety_precautions} /><div className="card information-card"><h2>Before starting an inspection</h2><p>Identify all energy sources and use the approved isolation procedure. Hands-on work, electrical measurements, and pressurized equipment each require the right training and controls.</p><p>The diagnosis report includes precautions from the selected equipment and possible faults. Review those alongside the work permit and local procedures before taking action.</p></div></>;
  if (page === "about") return <><div className="page-heading"><span className="overline">ABOUT THE WORKSPACE</span><h1>Clearer information.<br />Better prepared inspections.</h1><p>MechDoctor helps technicians organize observations and identify possible mechanical problems.</p></div><div className="information-grid"><section className="card information-card"><span className="icon-tile"><Icon name="flow" /></span><h2>Evidence behind each possibility</h2><p>A machine-specific rule engine evaluates observations and ranks possible faults by weighted matching score. Each result includes the observations that matched and an explanation of why the fault could fit.</p></section><section className="card information-card"><span className="icon-tile"><Icon name="shield" /></span><h2>A guide for the next check</h2><p>The report includes inspection steps, maintenance suggestions, safety precautions, and uncertainty. A qualified technician must confirm the cause before work begins.</p></section></div><div className="notice-strip"><Icon name="info" /><span>Preliminary guidance only, not a certified engineering diagnosis.</span></div></>;
  const steps = [
    ["pulse", "Record observations", "Choose the machine class and enter measured readings and symptoms. Leave anything unknown blank; missing information is not treated as a normal reading."],
    ["flow", "Match and rank faults", "The backend checks the observations against weighted rules in the selected machine's knowledge base. Stronger matching scores appear first."],
    ["spark", "Explain the findings", "Gemini prepares a short summary. If it is unavailable, the backend tries Groq, then uses a template. The report identifies the source used."],
    ["tool", "Plan a qualified inspection", "Review the supporting symptoms, reasoning, inspection steps, and suggested maintenance actions for each possible fault."],
    ["shield", "Check safety and uncertainty", "Confidence is Low, Medium, or High: a qualitative guide, not a guaranteed probability. Confirm the cause and safety controls before acting."],
  ];
  return <><div className="page-heading"><span className="overline">A TRANSPARENT DIAGNOSIS FLOW</span><h1>From symptoms to next steps.</h1><p>Understand how your observations become a preliminary inspection guide.</p></div><div className="how-steps">{steps.map(([icon, title, text], index) => <section className="card how-step" key={title}><span className="step-index">0{index + 1}</span><span className="icon-tile"><Icon name={icon} size={23} /></span><div><h2>{title}</h2><p>{text}</p></div></section>)}</div><button className="button primary" onClick={onStart}>Start a diagnosis<Icon name="arrow" size={17} /></button></>;
}

export default function App() {
  const [page, setPage] = useState(readPage);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [health, setHealth] = useState(null);
  const [machines, setMachines] = useState([]);
  const [connecting, setConnecting] = useState(true);
  const [connectionError, setConnectionError] = useState("");
  const [machine, setMachine] = useState("");
  const [values, setValues] = useState(emptyValues);
  const [report, setReport] = useState(null);
  const [generatedAt, setGeneratedAt] = useState(null);
  const [dirty, setDirty] = useState(false);
  const [loading, setLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState(null);
  const lastPayload = useRef(null);

  const connect = useCallback(async () => {
    setConnecting(true);
    setConnectionError("");
    try {
      const [status, catalogue] = await Promise.all([getHealth(), getMachines()]);
      if (status.status !== "ok") throw new Error("The backend is not ready.");
      const order = DEFAULT_MACHINES.map((item) => item.id);
      catalogue.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
      setHealth(status);
      setMachines(catalogue);
      setMachine((current) => catalogue.some((item) => item.id === current) ? current : catalogue[0].id);
    } catch (error) {
      setHealth(null);
      setConnectionError(error.message);
    } finally { setConnecting(false); }
  }, []);

  useEffect(() => { connect(); }, [connect]);
  useEffect(() => {
    const update = () => { setPage(readPage()); setMobileOpen(false); window.scrollTo({ top: 0 }); };
    window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
  }, []);

  const navigate = (id) => {
    if (window.location.hash === "#" + id) { setPage(id); window.scrollTo({ top: 0 }); }
    else window.location.hash = id;
    setMobileOpen(false);
  };
  const changeMachine = (id) => { setMachine(id); setValues(emptyValues()); setDirty(Boolean(report)); setAnalysisError(null); };
  const loadScenario = (scenario) => {
    setMachine(scenario.machine);
    const { machine: _machine, label: _label, ...readings } = scenario;
    setValues({ ...emptyValues(), ...readings });
    setDirty(Boolean(report));
    setAnalysisError(null);
    navigate("diagnose");
  };
  const start = (id) => { if (id) changeMachine(id); navigate("diagnose"); };
  const analyse = async (payload) => {
    lastPayload.current = payload;
    setLoading(true);
    setAnalysisError(null);
    navigate("report");
    try {
      const result = await diagnoseMachine(payload);
      setReport(result);
      setGeneratedAt(new Date().toISOString());
      setDirty(false);
    } catch (error) { setAnalysisError(error.message); }
    finally { setLoading(false); }
  };
  const selected = machines.find((item) => item.id === machine);
  const fields = selected?.fields || [];
  const completed = fields.filter((field) => values[field.name] !== "" && values[field.name] !== undefined).length;
  const providerLabel = health?.ai?.gemini_configured ? "Gemini configured" : health?.ai?.groq_configured ? "Groq configured" : health ? "Template available" : "Awaiting connection";

  return (
    <div className="app">
      <a className="skip-link" href="#main-content" onClick={(event) => { event.preventDefault(); document.getElementById("main-content").focus(); }}>Skip to content</a>
      <header className="app-header">
        <div className="header-brand"><button className="icon-button mobile-menu" aria-label={mobileOpen ? "Close navigation" : "Open navigation"} aria-expanded={mobileOpen} onClick={() => setMobileOpen(!mobileOpen)}><Icon name={mobileOpen ? "close" : "menu"} /></button><a className="brand" href="#dashboard"><span className="brand-logo"><Icon name="pulse" size={25} /></span><span><strong>MECH<span>DOCTOR</span></strong><small>MECHANICAL FAULT DIAGNOSIS</small></span></a></div>
        <div className="header-status"><span className={`connection-badge ${health ? "connected" : ""}`}><span className={`status-dot ${health ? "online" : ""}`} />{connecting ? "Connecting…" : health ? "Backend connected" : "Backend offline"}</span><span className="provider-status">{providerLabel}</span><button className="icon-button" onClick={connect} disabled={connecting} aria-label="Refresh backend connection"><Icon name="refresh" size={17} /></button></div>
      </header>
      {mobileOpen && <button className="sidebar-scrim" aria-label="Close navigation" onClick={() => setMobileOpen(false)} />}
      <aside className={`sidebar ${mobileOpen ? "open" : ""}`}>
        <div><span className="sidebar-label">WORKSPACE</span><nav aria-label="Main navigation">{NAV.map(([id, label, icon], index) => <a key={id} href={"#" + id} className={`nav-link ${page === id ? "active" : ""} ${index === 3 ? "nav-divider" : ""}`} aria-current={page === id ? "page" : undefined}><Icon name={icon} size={19} /><span>{label}</span>{page === id && <span className="nav-active-dot" />}</a>)}</nav></div>
        <div className="sidebar-bottom"><div className="sidebar-notice"><Icon name="shield" size={20} /><strong>Inspection comes first</strong><p>Preliminary guidance only. A qualified technician must confirm every diagnosis.</p><a href="#safety">Review safety guidelines<Icon name="arrow" size={14} /></a></div><div className="sidebar-version"><span>MECHDOCTOR</span><span>v1.0 / LOCAL</span></div></div>
      </aside>
      <main id="main-content" className="main-content" tabIndex="-1">
        <div className="breadcrumb"><span>WORKSPACE</span><span>/</span><strong>{NAV.find(([id]) => id === page)?.[1]}</strong><span className="preliminary-label">PRELIMINARY ASSESSMENT</span></div>
        {connectionError && <div className="error-message" role="alert"><Icon name="alert" /><div><strong>Backend connection unavailable</strong><p>{connectionError}</p></div><button className="button secondary" onClick={connect}>Retry connection</button></div>}
        {page === "dashboard" && <Dashboard machines={machines} health={health} report={report} onStart={start} onScenario={loadScenario} onNavigate={navigate} />}
        {page === "diagnose" && <>
          <div className="page-heading"><span className="overline">DIAGNOSTIC WORKSPACE</span><h1>Diagnose your machine.</h1><p>Start with what you know. Every observation helps narrow the next inspection.</p></div>
          <div className="diagnose-layout"><div>
            <section className="card equipment-card"><div className="section-heading compact"><h2><Icon name="motor" size={20} />Equipment selection</h2><span className="soft-badge">{machines.length} machine classes</span></div><MachineSelector machines={machines} selected={machine} onSelect={changeMachine} disabled={loading} />{selected && <p className="equipment-description">{selected.description}</p>}</section>
            <InputForm key={machine} machine={machine} values={values} onChange={(key, value) => { setValues((current) => ({ ...current, [key]: value })); setDirty(Boolean(report)); }} onSubmit={analyse} onLoadScenario={loadScenario} onReset={() => { setValues(emptyValues()); setDirty(Boolean(report)); }} fields={fields} loading={loading} disabled={!health || !fields.length} />
          </div><aside className="diagnose-aside"><section className="card readiness-card"><span className="overline">ASSESSMENT READINESS</span><h3>Your observations</h3><div className="completion-number">{completed}<span> / {fields.length || "—"}</span></div><p>fields provided</p><div className="completion-track"><span style={{ width: fields.length ? completed / fields.length * 100 + "%" : "0%" }} /></div><p className="field-hint">More context can help. You don't need to complete every field.</p><div className="readiness-item"><Icon name="flow" size={19} /><div><strong>Rule engine</strong><span>{health ? "Ready to evaluate" : "Waiting for backend"}</span></div></div><div className="readiness-item"><Icon name="spark" size={19} /><div><strong>Explanation service</strong><span>{providerLabel}</span></div></div></section><div className="aside-safety"><Icon name="shield" size={23} /><h3>Observe safely.</h3><p>Keep clear of moving parts. Follow the approved isolation procedure before physical inspection.</p><a href="#safety">View safety guidelines<Icon name="arrow" size={14} /></a></div></aside></div>
        </>}
        {page === "report" && <DiagnosisReport report={report} loading={loading} error={analysisError} generatedAt={generatedAt} dirty={dirty} onEdit={() => navigate("diagnose")} onRetry={() => lastPayload.current && analyse(lastPayload.current)} />}
        {["how-it-works", "safety", "about"].includes(page) && <InformationPage page={page} report={report} onStart={() => start()} />}
        <footer className="app-footer"><span>MECHDOCTOR <span className="footer-slash">/</span> MAINTENANCE INTELLIGENCE</span><span>Preliminary guidance. Qualified inspection required.</span></footer>
      </main>
    </div>
  );
}
