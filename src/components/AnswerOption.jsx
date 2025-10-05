export default function AnswerOption({ text, state, onClick, disabled }) {
  return (
    <button className={`answer ${state||''}`} disabled={disabled} onClick={onClick}>
      {text}
    </button>
  );
}
