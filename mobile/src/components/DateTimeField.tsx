import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { T, FONT } from '../theme';

// Native fallback: quick presets (повноцінний date picker додамо в нативній збірці).
function pad(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}
function fmt(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function human(v: string): string {
  const [date, time] = v.split('T');
  const [, m, day] = date.split('-');
  return `${day}.${m} о ${time}`;
}

export function DateTimeField({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (v: string | null) => void;
}) {
  const presets: [string, () => Date][] = [
    ['Через 1 год', () => new Date(Date.now() + 3600_000)],
    ['Через 3 год', () => new Date(Date.now() + 3 * 3600_000)],
    [
      'Завтра 09:00',
      () => {
        const d = new Date(Date.now() + 86_400_000);
        d.setHours(9, 0, 0, 0);
        return d;
      },
    ],
    [
      'Завтра 14:00',
      () => {
        const d = new Date(Date.now() + 86_400_000);
        d.setHours(14, 0, 0, 0);
        return d;
      },
    ],
  ];

  return (
    <View style={{ marginBottom: 8 }}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {presets.map(([label, make]) => {
          const iso = fmt(make());
          const on = value === iso;
          return (
            <Pressable
              key={label}
              onPress={() => onChange(iso)}
              style={{
                paddingHorizontal: 14,
                height: 40,
                borderRadius: 12,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: on ? T.ink : '#fff',
                borderWidth: 1.5,
                borderColor: on ? T.ink : T.border,
              }}
            >
              <Text style={{ fontFamily: FONT.b, fontSize: 13, color: on ? '#fff' : T.txt }}>{label}</Text>
            </Pressable>
          );
        })}
      </View>
      {value ? (
        <Text style={{ fontFamily: FONT.m, fontSize: 12.5, color: T.txt2, marginTop: 8 }}>
          Подати: {human(value)}
        </Text>
      ) : null}
    </View>
  );
}
