import React from 'react';
import { View, Text } from 'react-native';
import { T, FONT, VEHICLE_LABEL } from '../theme';
import { Card, StatusPill } from './ui';
import { Icon } from './Icon';
import type { Order } from '../types';

function fmt(s: string | null): string {
  if (!s) return '—';
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleString('uk');
}

export function OrderCard({ order, children }: { order: Order; children?: React.ReactNode }) {
  return (
    <Card>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <StatusPill status={order.status} />
        <Text style={{ fontFamily: FONT.sb, fontSize: 12.5, color: T.txt2 }}>
          {VEHICLE_LABEL[order.vehicleType]} · {order.weightKg} кг
          {order.price ? ` · ${order.price} ₴` : ''}
        </Text>
      </View>

      <Text style={{ fontFamily: FONT.b, fontSize: 16, color: T.ink, marginBottom: 6 }}>
        {order.cargoType}
      </Text>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 }}>
        <Icon name="dot" size={12} color={T.green} />
        <Text style={{ fontFamily: FONT.m, fontSize: 13, color: T.txt2, flex: 1 }} numberOfLines={1}>
          {order.pickupAddress}
        </Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Icon name="pin" size={13} color={T.accentDark} />
        <Text style={{ fontFamily: FONT.m, fontSize: 13, color: T.txt2, flex: 1 }} numberOfLines={1}>
          {order.dropoffAddress}
        </Text>
      </View>

      {order.description ? (
        <Text style={{ fontFamily: FONT.m, fontSize: 12.5, color: T.txt3, marginTop: 6 }}>
          {order.description}
        </Text>
      ) : null}

      <Text style={{ fontFamily: FONT.m, fontSize: 11.5, color: T.txt3, marginTop: 8 }}>
        Створено: {fmt(order.createdAt)}
        {order.completedAt ? ` · Завершено: ${fmt(order.completedAt)}` : ''}
      </Text>

      {children ? <View style={{ marginTop: 12, gap: 8 }}>{children}</View> : null}
    </Card>
  );
}
