import type { ReactNode } from 'react';
import type { Order } from '../types';

function fmt(s: string | null): string {
  return s ? new Date(s).toLocaleString() : '—';
}

export default function OrderCard({
  order,
  children,
}: {
  order: Order;
  children?: ReactNode;
}) {
  return (
    <div className="card">
      <div className="row">
        <span className={`status ${order.status}`}>{order.status}</span>
        <span className="muted">
          {order.vehicleType} · {order.weightKg} кг
          {order.price ? ` · ${order.price} грн` : ''}
        </span>
      </div>
      <div><b>{order.cargoType}</b></div>
      <div className="muted">{order.pickupAddress} → {order.dropoffAddress}</div>
      {order.description && <div className="muted small">{order.description}</div>}
      <div className="muted small">
        Створено: {fmt(order.createdAt)}
        {order.completedAt ? ` · Завершено: ${fmt(order.completedAt)}` : ''}
      </div>
      {children && <div className="actions">{children}</div>}
    </div>
  );
}
