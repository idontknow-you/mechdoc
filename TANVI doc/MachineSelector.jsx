import Icon, { machineIcons } from "@ui/Icon";

export const DEFAULT_MACHINES = [
  { id: "electric_motor", label: "Electric Motor", hint: "Heat, bearings, load" },
  { id: "water_pump", label: "Water Pump", hint: "Flow, seals, vibration" },
  { id: "gearbox", label: "Gearbox", hint: "Gears, oil, shafts" },
  { id: "conveyor_belt", label: "Conveyor Belt", hint: "Belt, rollers, tracking" },
];
export const prettify = (id = "") => String(id).replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

export default function MachineSelector({ machines = [], selected, onSelect, disabled = false }) {
  return (
    <fieldset className="machine-selector" disabled={disabled}>
      <legend>Target equipment <span className="field-optional">Choose one machine class</span></legend>
      <div className="machine-options">
        {machines.map((machine) => (
          <label key={machine.id} className={selected === machine.id ? "machine-option selected" : "machine-option"}>
            <input type="radio" name="machine" value={machine.id} checked={selected === machine.id} onChange={() => onSelect(machine.id)} />
            <span className="machine-option-icon"><Icon name={machineIcons[machine.id]} size={23} /></span>
            <span><strong>{machine.label}</strong><small>{DEFAULT_MACHINES.find((m) => m.id === machine.id)?.hint || machine.description}</small></span>
            {selected === machine.id && <span className="selection-check"><Icon name="check" size={14} /></span>}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
