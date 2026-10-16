import { useState } from "react";
import Icon from "@ui/Icon";

export const SCENARIOS = {
  1: { label: "Motor overheating", machine: "electric_motor", temperature_c: 95, vibration: "low", noise: "none", leakage: "none", speed_rpm: 1450, performance: "none", notes: "Unusually hot during operation" },
  2: { label: "Pump vibration", machine: "water_pump", temperature_c: 55, vibration: "high", noise: "unusual", leakage: "none", speed_rpm: 1450, performance: "none", notes: "Excessive vibration and unusual noise" },
};

export default function InputForm({ machine, values, onChange, onSubmit, onLoadScenario, onReset, fields = [], loading = false, disabled = false }) {
  const [errors, setErrors] = useState({});
  const definitions = fields.filter((field) => field && typeof field === "object");
  const value = (key) => values[key] ?? "";

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!machine) nextErrors.machine = "Select a machine first.";
    const payload = { machine };
    for (const field of definitions) {
      const raw = value(field.name);
      if (field.type === "number" && raw !== "") {
        const number = Number(raw);
        if (!Number.isFinite(number) || number < field.min || number > field.max) {
          nextErrors[field.name] = `Enter a value between ${field.min} and ${field.max}.`;
        } else payload[field.name] = number;
      } else if (field.type === "select" && raw !== "") {
        if (!field.options.some((option) => option.value === raw)) nextErrors[field.name] = "Choose an available option.";
        else payload[field.name] = raw;
      } else if (field.type === "text") {
        payload[field.name] = String(raw).trim().slice(0, field.max_length || 500);
      }
    }
    setErrors(nextErrors);
    if (!Object.keys(nextErrors).length) onSubmit(payload);
  };

  const renderField = (field) => {
    const id = field.name;
    const describedBy = errors[id] ? `${id}-error` : `${id}-hint`;
    return (
      <div className={id === "notes" ? "form-field notes-field" : "form-field"} key={id}>
        <label htmlFor={id}>{field.label}{field.unit && <span className="field-unit">{field.unit}</span>}</label>
        {field.type === "number" ? (
          <input id={id} type="number" step="any" min={field.min} max={field.max} value={value(id)} placeholder={id === "temperature_c" ? "e.g. 95" : "e.g. 1450"} onChange={(event) => onChange(id, event.target.value)} aria-invalid={Boolean(errors[id])} aria-describedby={describedBy} />
        ) : field.type === "select" ? (
          <select id={id} value={value(id)} onChange={(event) => onChange(id, event.target.value)} aria-invalid={Boolean(errors[id])} aria-describedby={describedBy}>
            <option value="">Not observed / unknown</option>
            {field.options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        ) : (
          <textarea id={id} rows="4" value={value(id)} maxLength={field.max_length || 500} placeholder="Describe when it happens, the load, and anything else you noticed…" onChange={(event) => onChange(id, event.target.value)} aria-describedby={describedBy} />
        )}
        {errors[id] ? <p id={`${id}-error`} className="field-error" role="alert">{errors[id]}</p> : (
          <p id={`${id}-hint`} className="field-hint">{field.type === "number" ? `Optional · allowed range ${field.min}–${field.max} ${field.unit || ""}` : id === "notes" ? `${String(value(id)).length} / ${field.max_length || 500} characters` : "Leave unknown if you haven't checked."}</p>
        )}
      </div>
    );
  };
  const telemetry = definitions.filter((field) => ["temperature_c", "speed_rpm", "vibration"].includes(field.name));
  const observations = definitions.filter((field) => !["temperature_c", "speed_rpm", "vibration"].includes(field.name));

  return (
    <form onSubmit={handleSubmit} noValidate>
      <fieldset disabled={loading || disabled} className="form-fieldset">
        <div className="preset-bar">
          <span className="overline">TRY A SCENARIO</span>
          {Object.entries(SCENARIOS).map(([id, scenario]) => <button className="button preset-button" type="button" key={id} onClick={() => { setErrors({}); onLoadScenario(scenario); }}><Icon name={id === "1" ? "temperature" : "pulse"} size={16} />{scenario.label}</button>)}
        </div>
        {errors.machine && <p className="error-message" role="alert">{errors.machine}</p>}
        <div className="input-columns">
          <section className="card form-section" aria-labelledby="telemetry-heading">
            <div className="card-heading"><span className="icon-tile small"><Icon name="speed" /></span><div><span className="overline">01 / MEASURED READINGS</span><h3 id="telemetry-heading">Operating conditions</h3></div></div>
            <div className="form-fields">{telemetry.map(renderField)}</div>
          </section>
          <section className="card form-section" aria-labelledby="observation-heading">
            <div className="card-heading"><span className="icon-tile small"><Icon name="pulse" /></span><div><span className="overline">02 / FIELD OBSERVATIONS</span><h3 id="observation-heading">What have you noticed?</h3></div></div>
            <div className="form-fields">{observations.map(renderField)}</div>
          </section>
        </div>
        <div className="submission-bar card">
          <p><Icon name="info" size={18} /><span>Unknown readings stay unknown.<br /><strong>Enter observations you can confirm.</strong></span></p>
          <div className="button-group">
            <button type="button" className="button secondary" onClick={() => { setErrors({}); onReset(); }}><Icon name="refresh" size={16} />Reset inputs</button>
            <button type="submit" className="button primary">{loading ? "Analysing…" : "Analyse machine"}<Icon name="arrow" size={18} /></button>
          </div>
        </div>
      </fieldset>
    </form>
  );
}
