import { useCallback, useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import type { Order, OrderStatus, User, VehicleType } from '../types';
import { ApiError, api, errText } from '../api';
import OrderCard from '../components/OrderCard';
import ReviewForm from '../components/ReviewForm';

const VEHICLES: VehicleType[] = ['CAR', 'VAN', 'TRUCK_SMALL', 'TRUCK_LARGE'];

export default function DriverView({ me, onMe }: { me: User; onMe: (u: User) => void }) {
  const prof = me.driverProfile;
  const [vehicleType, setVehicleType] = useState<VehicleType>(prof?.vehicleType ?? 'VAN');
  const [capacityKg, setCapacityKg] = useState<number>(prof?.capacityKg ?? 1000);
  const [licensePlate, setLicensePlate] = useState<string>(prof?.licensePlate ?? '');

  const [available, setAvailable] = useState<Order[]>([]);
  const [mine, setMine] = useState<Order[]>([]);
  const [notice, setNotice] = useState('');
  const [err, setErr] = useState('');

  async function reloadMe() {
    try {
      onMe(await api.me());
    } catch {
      /* ignore */
    }
  }

  const refresh = useCallback(async () => {
    try {
      setMine(await api.myOrders());
    } catch {
      /* ignore */
    }
    try {
      setAvailable(await api.availableOrders());
      setNotice('');
    } catch (ex) {
      if (ex instanceof ApiError && ex.code === 'profile_required') {
        setNotice('Створіть профіль авто, щоб бачити доступні заявки.');
        setAvailable([]);
      }
    }
  }, []);

  useEffect(() => {
    refresh();
    const t = setInterval(refresh, 5000);
    return () => clearInterval(t);
  }, [refresh]);

  async function saveProfile(e: FormEvent) {
    e.preventDefault();
    setErr('');
    try {
      await api.putProfile({ vehicleType, capacityKg, licensePlate });
      await reloadMe();
      refresh();
    } catch (ex) {
      setErr(errText(ex));
    }
  }

  async function toggleAvailability() {
    try {
      await api.setAvailability({ isAvailable: !prof?.isAvailable });
      await reloadMe();
    } catch (ex) {
      alert(errText(ex));
    }
  }

  async function act(fn: () => Promise<unknown>) {
    try {
      await fn();
      refresh();
    } catch (ex) {
      alert(errText(ex));
    }
  }

  return (
    <div className="cols">
      <div>
        <h2>Профіль авто</h2>
        <form onSubmit={saveProfile} className="card">
          <label>
            Тип авто
            <select value={vehicleType} onChange={(e) => setVehicleType(e.target.value as VehicleType)}>
              {VEHICLES.map((v) => <option key={v} value={v}>{v}</option>)}
            </select>
          </label>
          <label>Вантажопідйомність, кг<input type="number" min={1} value={capacityKg} onChange={(e) => setCapacityKg(Number(e.target.value))} /></label>
          <label>Номер<input value={licensePlate} onChange={(e) => setLicensePlate(e.target.value)} placeholder="AA1234BB" required /></label>
          {err && <div className="error">{err}</div>}
          <button type="submit">Зберегти профіль</button>
        </form>
        {prof && (
          <div className="card">
            <div className="row">
              <span>Доступність: <b>{prof.isAvailable ? 'УВІМКНЕНО' : 'вимкнено'}</b></span>
              <button className="ghost" onClick={toggleAvailability}>
                {prof.isAvailable ? 'Вимкнути' : 'Увімкнути'}
              </button>
            </div>
          </div>
        )}
      </div>

      <div>
        <h2>Доступні заявки ({available.length})</h2>
        {notice && <div className="notice">{notice}</div>}
        {available.length === 0 && !notice && <div className="muted">Немає відповідних заявок.</div>}
        {available.map((o) => (
          <OrderCard key={o.id} order={o}>
            <button onClick={() => act(() => api.accept(o.id))}>Прийняти</button>
          </OrderCard>
        ))}

        <h2>Мої замовлення ({mine.length})</h2>
        {mine.length === 0 && <div className="muted">Поки немає прийнятих.</div>}
        {mine.map((o) => (
          <OrderCard key={o.id} order={o}>
            {o.status === 'ACCEPTED' && (
              <>
                <button onClick={() => act(() => api.setStatus(o.id, 'IN_PROGRESS' as OrderStatus))}>Забрав вантаж</button>
                <button className="ghost" onClick={() => act(() => api.cancel(o.id))}>Скасувати</button>
              </>
            )}
            {o.status === 'IN_PROGRESS' && (
              <button onClick={() => act(() => api.setStatus(o.id, 'COMPLETED' as OrderStatus))}>Доставлено</button>
            )}
            {o.status === 'COMPLETED' && <ReviewForm orderId={o.id} />}
          </OrderCard>
        ))}
      </div>
    </div>
  );
}
