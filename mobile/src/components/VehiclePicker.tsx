import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { T, FONT } from '../theme';
import { Truck } from './Icon';
import type { VehicleType } from '../types';

const ITEMS: { v: VehicleType; label: string; size: 's' | 'm' | 'l' }[] = [
  { v: 'CAR', label: 'Легкове', size: 's' },
  { v: 'VAN', label: 'Бус', size: 's' },
  { v: 'TRUCK_SMALL', label: 'Малий', size: 'm' },
  { v: 'TRUCK_LARGE', label: 'Великий', size: 'l' },
];

export function VehiclePicker({
  value,
  onChange,
}: {
  value: VehicleType;
  onChange: (v: VehicleType) => void;
}) {
  return (
    <View style={{ flexDirection: 'row', gap: 8 }}>
      {ITEMS.map((it) => {
        const active = value === it.v;
        return (
          <Pressable
            key={it.v}
            onPress={() => onChange(it.v)}
            style={{
              flex: 1,
              backgroundColor: active ? T.ink : T.surface,
              borderWidth: 1.5,
              borderColor: active ? T.ink : T.border,
              borderRadius: 16,
              paddingVertical: 12,
              paddingHorizontal: 6,
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Truck size={it.size} color={active ? T.accent : T.ink} w={34} />
            <Text
              style={{
                fontFamily: FONT.b,
                fontSize: 12,
                color: active ? '#fff' : T.txt,
                textAlign: 'center',
              }}
            >
              {it.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
