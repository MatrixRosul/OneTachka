import { useCallback, useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import type { Order, User, VehicleType } from '../types';
import { api, errText, type OrderCreateBody } from '../api';
import OrderCard from '../components/OrderCard';
import ReviewForm from '../components/ReviewForm';

const VEHICLES: VehicleType[] = ['CAR', 'VAN', 'TRUCK_SMALL', 'TRUCK_LARGE'];

const DEFAULTS: OrderCreateBody = {
  pickupAddress: 'Ужгород, пл. Корятовича 1',
  pickupLat: 48.6208,
  pickupLng: 22.2879,
  dropoffAddress: 'Львів, пл. Ринок 1',
  dropoffLat: 49.8419,
  dropoffLng: 24.0315,
  cargoType: 'меблі',
  weightKg: 500,
  vehicleType: 'VAN',
  description: '',
  price: undefined,
};

export default function ClientView(_props: { me: User; onMe: (u: User) => void }) {
  const [form, setForm] = useState<OrderCreateBody>(DEFAULTS);
  const [orders, setOrders] = useState<Order[]>([]);
  const [err, setErr] = useState('');

  const refresh = useCallback(async () => {
    try {
      setOrders(await api.myOrders());
    } catch {
      /* polling — ігноруємо тимчасові помилки */
    }
  }, []);

  useEffect(() => {
    refresh();
    const t = setInterval(refresh, 5000);
    return () => clearInterval(t);
  }, [refresh]);

  function upd<K extends keyof OrderCreateBody>(k: K, v: OrderCreateBody[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function create(e: FormEvent) {
    e.preventDefault();
    setErr('');
    try {
      await api.createOrder({
        ...form,
        description: form.description || undefined,
        price: form.price || undefined,
      });
      setForm(DEFAULTS);
      refresh();
    } catch (ex) {
      setErr(errText(ex));
    }
  }

  async function cancel(id: string) {
    try {
      await api.cancel(id);
      refresh();
    } catch (ex) {
      alert(errText(ex));
    }
  }

  return (
    <div className="cols">
      <div>
        <h2>Нова заявка</h2>
        <form onSubmit={create} className="card">
          <label>
            Звідки (адреса)
            <input value={form.pickupAddress} onChange={(e) => upd('pickupAddress', e.target.value)} required />
          </label>
          <div className="grid">
            <label>pickup lat<input type="number" step="any" value={form.pickupLat} onChange={(e) => upd('pickupLat', Number(e.target.value))} /></label>
            <label>pickup lng<input type="number" step="any" value={form.pickupLng} onChange={(e) => upd('pickupLng', Number(e.target.value))} /></label>
          </div>
          <label>
            Куди (адреса)
            <input value={form.dropoffAddress} onChange={(e) => upd('dropoffAddress', e.target.value)} required />
          </label>
          <div className="grid">
            <label>dropoff lat<input type="number" step="any" value={form.dropoffLat} onChange={(e) => upd('dropoffLat', Number(e.target.value))} /></label>
            <label>dropoff lng<input type="number" step="any" value={form.dropoffLng} onChange={(e) => upd('dropoffLng', Number(e.target.value))} /></label>
          </div>
          <label>
            Що везти
            <input value={form.cargoType} onChange={(e) => upd('cargoType', e.target.value)} required />
          </label>
          <div className="grid">
            <label>Вага, кг<input type="number" min={1} value={form.weightKg} onChange={(e) => upd('weightKg', Number(e.target.value))} /></label>
            <label>
              Тип авто
              <select value={form.vehicleType} onChange={(e) => upd('vehicleType', e.target.value as VehicleType)}>
                {VEHICLES.map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
            </label>
          </div>
          <div className="grid">
            <label>Ціна, грн<input type="number" step="0.01" min={0} value={form.price ?? ''} onChange={(e) => upd('price', e.target.value === '' ? undefined : Number(e.target.value))} /></label>
            <label>Опис<input value={form.description ?? ''} onChange={(e) => upd('description', e.target.value)} /></label>
          </div>
          {err && <div className="error">{err}</div>}
          <button type="submit">Створити заявку</button>
        </form>
      </div>

      <div>
        <h2>Мої заявки ({orders.length})</h2>
        {orders.length === 0 && <div className="muted">Поки немає заявок.</div>}
        {orders.map((o) => (
          <OrderCard key={o.id} order={o}>
            {(o.status === 'SEARCHING' || o.status === 'ACCEPTED') && (
              <button className="ghost" onClick={() => cancel(o.id)}>Скасувати</button>
            )}
            {o.status === 'COMPLETED' && o.driverId && <ReviewForm orderId={o.id} />}
          </OrderCard>
        ))}
      </div>
    </div>
  );
}
