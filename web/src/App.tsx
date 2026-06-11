import { useEffect, useState } from 'react';
import type { User } from './types';
import { api, setToken } from './api';
import AuthView from './views/AuthView';
import ClientView from './views/ClientView';
import DriverView from './views/DriverView';

export default function App() {
  const [me, setMe] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setMe(await api.me());
      } catch {
        setToken(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  function logout() {
    setToken(null);
    setMe(null);
  }

  if (loading) return <div className="container">Завантаження…</div>;
  if (!me) return <AuthView onAuth={setMe} />;

  return (
    <div className="container">
      <header className="header">
        <div>
          <strong>OneTachka</strong> — {me.fullName}
          <span className="badge">{me.role}</span>
        </div>
        <div>
          <span className="muted">★ {me.ratingAvg} ({me.ratingCount})</span>{' '}
          <button className="ghost" onClick={logout}>Вийти</button>
        </div>
      </header>
      {me.role === 'CLIENT' ? (
        <ClientView me={me} onMe={setMe} />
      ) : (
        <DriverView me={me} onMe={setMe} />
      )}
    </div>
  );
}
