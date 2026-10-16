import FaultCard from "./FaultCard";
import SafetyBanner from "./SafetyBanner";
import Loader from "./Loader";
import { prettify } from "./MachineSelector";
import Icon from "@ui/Icon";

const SOURCE_LABELS = { gemini: "Gemini AI explanation", groq: "Groq AI explanation" };
const FIELD_LABELS = { temperature_c: "Temperature", speed_rpm: "Operating speed", vibration: "Vibration", noise: "Noise", leakage: "Leakage", performance: "Performance drop" };

export default function DiagnosisReport({ report, loading = false, error = null, generatedAt, dirty = false, onEdit, onRetry }) {
  if (loading) return <Loader />;
  if (error) return <div className="error-message" role="alert"><Icon name="alert" /><div><h3>The analysis could not be completed</h3><p>{error}</p><button className="button secondary" onClick={onRetry}>Try again</button></div></div>;
  if (!report) return <div className="empty-state card"><span className="icon-tile"><Icon name="report" size={30} /></span><span className="overline">YOUR FINDINGS WILL APPEAR HERE</span><h2>No diagnosis report yet</h2><p>Select a machine and enter the observations you have.<br />You can also try one of the sample scenarios.</p><button className="button primary" onClick={onEdit}>Start a diagnosis<Icon name="arrow" size={17} /></button></div>;

  const faults = [...report.faults].sort((a, b) => Number(b.score || 0) - Number(a.score || 0));
  const inputs = report.inputs || {};
  return (
    <div className="report-content">
      <div className="report-titlebar">
        <div><span className="overline">PRELIMINARY ASSESSMENT</span><h1>Diagnosis report</h1><p>{report.machine_label || prettify(report.machine)}<span className="text-divider">/</span>{generatedAt ? new Date(generatedAt).toLocaleString() : "Latest submitted readings"}</p></div>
        <div className="button-group no-print"><button className="button secondary" onClick={onEdit}><Icon name="tool" size={16} />Edit inputs</button><button className="button primary" onClick={() => window.print()}><Icon name="print" size={16} />Print / PDF</button></div>
      </div>
      {dirty && <div className="notice-strip"><Icon name="info" size={18} />Inputs have changed. This report reflects the submitted readings below.</div>}
      <section className="card readings-card" aria-labelledby="submitted-heading">
        <div className="section-heading compact"><h3 id="submitted-heading">Submitted observations</h3><span className="overline">{report.machine_label || prettify(report.machine)}</span></div>
        <div className="readings-grid">{Object.entries(FIELD_LABELS).map(([key, label]) => <div className="reading-cell" key={key}><span>{label}</span><strong>{inputs[key] === undefined || inputs[key] === null ? "Not provided" : key === "temperature_c" ? `${inputs[key]} °C` : key === "speed_rpm" ? `${inputs[key]} RPM` : prettify(String(inputs[key]))}</strong></div>)}</div>
        {inputs.notes && <p className="submitted-notes"><strong>Technician notes:</strong> {inputs.notes}</p>}
      </section>
      <div className="summary-grid">
        <section className="card summary-card" aria-labelledby="summary-heading"><div className="section-heading"><h2 id="summary-heading"><Icon name="spark" />AI summary</h2>{report.ai_source !== "template" && <span className="source-badge">{SOURCE_LABELS[report.ai_source] || "Backend explanation"}</span>}</div><p>{report.ai_summary}</p></section>
        <section className="card uncertainty-card" aria-labelledby="uncertainty-heading"><h2 id="uncertainty-heading"><Icon name="info" />Uncertainty</h2><p>{report.uncertainty || "The cause remains unconfirmed. Machine specifications, baseline readings, maintenance history, and inspection findings would improve the assessment."}</p></section>
      </div>
      <section aria-labelledby="faults-heading"><div className="section-heading faults-heading"><div><h2 id="faults-heading">Ranked faults <span className="count-badge">{faults.length}</span></h2><p>Ordered by weighted matching score. Scores are not probabilities.</p></div><span className="confidence-note">Confidence: Low / Medium / High<br /><strong>Qualitative guidance, not a guarantee.</strong></span></div><div className="fault-list">{faults.map((fault, index) => <FaultCard key={fault.id || index} fault={fault} rank={index + 1} />)}</div></section>
      <SafetyBanner precautions={report.safety_precautions} />
      <div className="disclaimer"><Icon name="info" size={18} /><p><strong>Disclaimer</strong><br />{report.disclaimer || "Preliminary guidance only, not a certified engineering diagnosis."}</p></div>
    </div>
  );
}
