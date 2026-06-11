import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, Modal } from 'react-native';
import { T, FONT, VEHICLE_LABEL } from '../theme';
import { Icon } from './Icon';
import type { Order } from '../types';

const COUNTDOWN = 20;

export function IncomingOrderModal({
  order,
  onAccept,
  onSkip,
  busy,
}: {
  order: Order | null;
  onAccept: () => void;
  onSkip: () => void;
  busy: boolean;
}) {
  const [sec, setSec] = useState(COUNTDOWN);

  useEffect(() => {
    if (!order) return;
    setSec(COUNTDOWN);
  }, [order?.id]);

  useEffect(() => {
    if (!order) return;
    if (sec <= 0) {
      onSkip();
      return;
    }
    const t = setTimeout(() => setSec((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [sec, order?.id]);

  if (!order) return null;

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onSkip}>
      <View style={{ flex: 1, backgroundColor: 'rgba(20,30,70,0.55)', justifyContent: 'flex-end' }}>
        <View style={{ backgroundColor: '#fff', borderTopLeftRadius: T.radSheet, borderTopRightRadius: T.radSheet, padding: 20, paddingBottom: 34 }}>
          {/* header: countdown + label */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: FONT.sb, fontSize: 13, color: T.txt2 }}>Нове замовлення поруч</Text>
              <Text style={{ fontFamily: FONT.xb, fontSize: 30, color: T.ink, letterSpacing: -1 }}>
                {order.price ?? '—'} ₴
              </Text>
            </View>
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                borderWidth: 4,
                borderColor: T.accent,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontFamily: FONT.xb, fontSize: 20, color: T.ink }}>{sec}</Text>
            </View>
          </View>

          {/* route */}
          <View style={{ backgroundColor: T.bg, borderRadius: 16, paddingHorizontal: 14, marginBottom: 14 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: T.line }}>
              <Icon name="dot" size={13} color={T.green} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: FONT.sb, fontSize: 11, color: T.txt3 }}>Забрати</Text>
                <Text style={{ fontFamily: FONT.b, fontSize: 14, color: T.ink }} numberOfLines={1}>{order.pickupAddress}</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 11 }}>
              <Icon name="pin" size={15} color={T.accentDark} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: FONT.sb, fontSize: 11, color: T.txt3 }}>Доставити</Text>
                <Text style={{ fontFamily: FONT.b, fontSize: 14, color: T.ink }} numberOfLines={1}>{order.dropoffAddress}</Text>
              </View>
            </View>
          </View>

          <Text style={{ fontFamily: FONT.m, fontSize: 12.5, color: T.txt2, marginBottom: 16 }}>
            {VEHICLE_LABEL[order.vehicleType]} · {order.weightKg} кг · {order.cargoType}
          </Text>

          {/* actions */}
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <Pressable
              onPress={onSkip}
              style={{ width: 96, height: 56, borderRadius: T.radBtn, borderWidth: 1.5, borderColor: T.border, alignItems: 'center', justifyContent: 'center' }}
            >
              <Text style={{ fontFamily: FONT.b, fontSize: 14, color: T.txt2 }}>Пропустити</Text>
            </Pressable>
            <Pressable
              onPress={onAccept}
              disabled={busy}
              style={{ flex: 1, height: 56, borderRadius: T.radBtn, backgroundColor: T.accent, alignItems: 'center', justifyContent: 'center', opacity: busy ? 0.6 : 1 }}
            >
              <Text style={{ fontFamily: FONT.xb, fontSize: 16.5, color: T.ink }}>Прийняти замовлення</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
