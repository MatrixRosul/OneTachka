import { useState } from 'react';
import type { FormEvent } from 'react';
import type { Role, User } from '../types';
import { api, errText, setToken } from '../api';

export default function AuthView({ onAuth }: { onAuth: (u: User) => void }) {
  const [mode, setMode] = useState<'login' | 'register'>('register');
  const [role, setRole] = useState<Role>('CLIENT');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  async function submit(e: FormEvent) {
    e.preventDefault();
    setErr('');
    try {
      const res =
        mode === 'register'
          ? await api.register({ role, fullName, phone, password })
          : await api.login({ phone, password });
      setToken(res.token);
      onAuth(res.user);
    } catch (ex) {
      setErr(errText(ex));
    }
  }

  return (
    <div className="container narrow">
      <h1>OneTachka</h1>
      <div className="tabs">
        <button className={mode === 'register' ? 'active' : ''} onClick={() => setMode('register')}>
          Реєстрація
        </button>
        <button className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>
          Вхід
        </button>
      </div>
      <form onSubmit={submit} className="card">
        {mode === 'register' && (
          <>
            <label>
              Роль
              <select value={role} onChange={(e) => setRole(e.target.value as Role)}>
                <option value="CLIENT">Клієнт</option>
                <option value="DRIVER">Водій</option>
              </select>
            </label>
            <label>
              Ім'я
              <input value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            </label>
          </>
        )}
        <label>
          Телефон
          <input value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="+380..." />
        </label>
        <label>
          Пароль
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="мінімум 8 символів"
          />
        </label>
        {err && <div className="error">{err}</div>}
        <button type="submit">{mode === 'register' ? 'Зареєструватися' : 'Увійти'}</button>
      </form>
    </div>
  );
}
