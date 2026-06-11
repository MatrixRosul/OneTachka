import { useState } from 'react';
import { ApiError, api, errText } from '../api';

export default function ReviewForm({
  orderId,
  onDone,
}: {
  orderId: string;
  onDone?: () => void;
}) {
  const [score, setScore] = useState(5);
  const [comment, setComment] = useState('');
  const [msg, setMsg] = useState('');
  const [done, setDone] = useState(false);

  async function submit() {
    setMsg('');
    try {
      await api.review(orderId, { score, comment: comment || undefined });
      setDone(true);
      setMsg('Дякуємо за відгук!');
      onDone?.();
    } catch (ex) {
      setMsg(errText(ex));
      if (ex instanceof ApiError && ex.code === 'already_reviewed') setDone(true);
    }
  }

  if (done) return <div className="muted small">{msg || 'Відгук залишено'}</div>;

  return (
    <div className="review">
      <select value={score} onChange={(e) => setScore(Number(e.target.value))}>
        {[5, 4, 3, 2, 1].map((n) => (
          <option key={n} value={n}>{'★'.repeat(n)} ({n})</option>
        ))}
      </select>
      <input
        placeholder="коментар (необов'язково)"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <button onClick={submit}>Оцінити</button>
      {msg && <span className="small error">{msg}</span>}
    </div>
  );
}
