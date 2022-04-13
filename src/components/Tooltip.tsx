export default function Tooltip({ text }: { text: string }) {
  return (
    <>
      <div style={{ position: "relative", display: "inline-block" }}>
        <div className="question-mark">?</div>
        <div className="tooltip-div">{text}</div>
      </div>
    </>
  );
}
