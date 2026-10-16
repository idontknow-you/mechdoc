import Icon from "@ui/Icon";
export const CORE_PRECAUTIONS = [
  "Follow the site's isolation and lockout/tagout procedure before hands-on inspection or maintenance.",
  "Wait for rotating parts to stop and hot surfaces to cool. Use appropriate PPE for the task.",
  "Have a qualified technician confirm the fault and follow the equipment manufacturer's procedures.",
];
export default function SafetyBanner({ precautions = [] }) {
  const items = [...new Map([...CORE_PRECAUTIONS, ...(Array.isArray(precautions) ? precautions : [])].filter(Boolean).map((item) => [String(item).trim().toLowerCase(), String(item).trim()])).values()];
  return (
    <section className="safety-banner" aria-labelledby="safety-heading">
      <span className="safety-icon"><Icon name="shield" size={23} /></span>
      <div><span className="overline">BEFORE ANY PHYSICAL INTERVENTION</span><h3 id="safety-heading">Safety precautions</h3><ul>{items.map((item, i) => <li key={i}>{item}</li>)}</ul></div>
    </section>
  );
}
