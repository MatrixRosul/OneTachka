import React, { useState } from 'react';
import type { ReactNode } from 'react';
import { View, Text, Pressable } from 'react-native';
import { T, FONT, VEHICLE_LABEL } from '../theme';
import { Icon, Truck } from './Icon';
import { StatusPill } from './ui';
import type { Order } from '../types';

function dateOnly(s: string | null): string {
  if (!s) return '';
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString('uk');
}

// Компактний рядок історії; тап розкриває повну інформацію про замовлення.
export function HistoryItem({ order, children }: { order: Order; children?: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <View style={{ backgroundColor: '#fff', borderWidth: 1, borderColor: T.border, borderRadius: T.radCard, marginBottom: 10, overflow: 'hidden' }}>
      <Pressable onPress={() => setOpen((o) => !o)} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 }}>
        <View style={{ width: 38, height: 38, borderRadius: 10, backgroundColor: T.bg, alignItems: 'center', justifyContent: 'center' }}>
          <Truck size="m" color={T.ink} w={26} />
        </View>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={{ fontFamily: FONT.b, fontSize: 13.5, color: T.ink }} numberOfLines={1}>
            {order.pickupAddress} → {order.dropoffAddress}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 }}>
            <StatusPill status={order.status} />
            <Text style={{ fontFamily: FONT.m, fontSize: 11.5, color: T.txt3 }}>{dateOnly(order.completedAt ?? order.createdAt)}</Text>
          </View>
        </View>
        <View style={{ alignItems: 'flex-end', gap: 4 }}>
          <Text style={{ fontFamily: FONT.xb, fontSize: 14.5, color: T.ink }}>{order.price ? `${order.price} ₴` : '—'}</Text>
          <View style={{ transform: [{ rotate: open ? '90deg' : '0deg' }] }}>
            <Icon name="chevR" size={16} color={T.txt3} />
          </View>
        </View>
      </Pressable>

      {open && (
        <View style={{ paddingHorizontal: 14, paddingBottom: 14, gap: 6 }}>
          <View style={{ height: 1, backgroundColor: T.line, marginBottom: 8 }} />
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Icon name="dot" size={12} color={T.green} />
            <Text style={{ fontFamily: FONT.m, fontSize: 13, color: T.txt2, flex: 1 }}>{order.pickupAddress}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Icon name="pin" size={13} color={T.accentDark} />
            <Text style={{ fontFamily: FONT.m, fontSize: 13, color: T.txt2, flex: 1 }}>{order.dropoffAddress}</Text>
          </View>
          <Text style={{ fontFamily: FONT.sb, fontSize: 12.5, color: T.txt2, marginTop: 2 }}>
            {order.cargoType} · {VEHICLE_LABEL[order.vehicleType]} · {order.weightKg} кг
          </Text>
          {order.description ? (
            <Text style={{ fontFamily: FONT.m, fontSize: 12, color: T.txt3 }}>{order.description}</Text>
          ) : null}
          {children ? <View style={{ marginTop: 8 }}>{children}</View> : null}
        </View>
      )}
    </View>
  );
}
