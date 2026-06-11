import React from 'react';
import { View, Text } from 'react-native';
import { T, FONT } from '../theme';
import { Icon } from './Icon';
import type { Place } from './AddressField';

// Нативна заглушка. Інтерактивна карта (react-native-maps) — у нативній збірці
// (EAS/dev build); на web підставляється MapPicker.web.tsx із реальною Leaflet-картою.
export function MapPicker({ value }: { value: Place; onPick: (p: Place) => void }) {
  return (
    <View
      style={{
        marginBottom: 12,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: T.border,
        backgroundColor: '#fff',
        padding: 16,
        alignItems: 'center',
        gap: 6,
      }}
    >
      <Icon name="pin" size={26} color={T.accentDark} />
      <Text style={{ fontFamily: FONT.b, fontSize: 13.5, color: T.ink }}>Вибір на карті — у застосунку</Text>
      <Text style={{ fontFamily: FONT.m, fontSize: 12, color: T.txt3, textAlign: 'center' }} numberOfLines={2}>
        {value.address || 'Скористайтесь пошуком адреси вище'}
      </Text>
    </View>
  );
}
