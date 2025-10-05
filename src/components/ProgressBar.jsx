export default function ProgressBar({ passed }) {
  return (
    <div className="progress">
      {[0,1,2].map(i => (
        <div key={i} className={`dot ${i < passed ? 'done' : ''}`}></div>
      ))}
    </div>
  );
}
