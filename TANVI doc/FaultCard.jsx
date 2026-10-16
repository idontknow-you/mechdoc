import Icon from "@ui/Icon";
export default function FaultCard({ fault, rank }) {
  const confidence = ["Low", "Medium", "High"].find((level) => level.toLowerCase() === String(fault.confidence).toLowerCase()) || "Low";
  return (
    <article className="fault-card card" data-testid="fault-card">
      <header className="fault-header">
        <div className="fault-title"><span className="rank-number">{String(rank).padStart(2, "0")}</span><div><span className="overline">POSSIBLE FAULT</span><h3>{fault.name}</h3></div></div>
        <div className="fault-indicators"><span className={`confidence-badge ${confidence.toLowerCase()}`}>{confidence} confidence</span><span className="rule-score">Score <strong>{Number(fault.score ?? 0).toFixed(2)}</strong></span></div>
      </header>
      <div className="fault-evidence">
        <div><h4><Icon name="pulse" size={16} />Supporting symptoms</h4>
          {fault.supporting_symptoms?.length ? <ul className="symptom-tags">{fault.supporting_symptoms.map((symptom, i) => <li key={i}>{symptom}</li>)}</ul> : <p className="muted">No specific fault indicators matched the supplied observations.</p>}
        </div>
        <div><h4><Icon name="info" size={16} />Reasoning</h4><p>{fault.reasoning}</p></div>
      </div>
      <div className="fault-actions">
        <section><h4><Icon name="tool" size={16} />Inspection steps</h4><ol className="numbered-list">{(fault.inspection_steps || []).map((item, i) => <li key={i}>{item}</li>)}</ol></section>
        <section><h4><Icon name="check" size={16} />Maintenance actions</h4><ul className="action-list">{(fault.maintenance_actions || []).map((item, i) => <li key={i}>{item}</li>)}</ul></section>
      </div>
      {fault.safety_precautions?.length > 0 && <div className="fault-safety"><Icon name="shield" size={16} /><div><strong>Safety for this inspection</strong><ul>{fault.safety_precautions.map((item, i) => <li key={i}>{item}</li>)}</ul></div></div>}
    </article>
  );
}
