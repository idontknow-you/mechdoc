import Icon from "@ui/Icon";
export default function Loader({ message = "Preparing your diagnosis report" }) {
  return (
    <div className="analysis-loader card" role="status" aria-live="polite">
      <span className="loader-ring" aria-hidden="true" />
      <span className="overline">ANALYSIS IN PROGRESS</span>
      <h2>{message}</h2>
      <p>The backend ranks matching faults, then prepares an explanation.<br />This can take a few moments while the AI service responds.</p>
      <div className="loader-steps"><span><Icon name="check" size={15} /> Readings submitted</span><span><Icon name="flow" size={15} /> Ranking & explanation</span></div>
    </div>
  );
}
