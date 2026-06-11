import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert } from 'react-native';
import { T, FONT } from '../theme';
import { Icon } from './Icon';
import { api, errText } from '../api';
import type { Order } from '../types';

// Водій коригує ціну активного замовлення (ACCEPTED/IN_PROGRESS).
export function PriceEditor({ order, onChanged }: { order: Order; onChanged: () => void }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(order.price ?? '');
  const [busy, setBusy] = useState(false);

  async function save() {
    const n = Number(val);
    if (!n || n <= 0) {
      Alert.alert('Невірна ціна', 'Вкажіть суму більше 0');
      return;
    }
    setBusy(true);
    try {
      await api.setPrice(order.id, n);
      setEditing(false);
      onChanged();
    } catch (ex) {
      Alert.alert('Помилка', errText(ex));
    } finally {
      setBusy(false);
    }
  }

  if (!editing) {
    return (
      <Pressable
        onPress={() => {
          setVal(order.price ?? '');
          setEditing(true);
        }}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: T.bg,
          borderRadius: 12,
          paddingHorizontal: 14,
          paddingVertical: 12,
        }}
      >
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: FONT.sb, fontSize: 11.5, color: T.txt3 }}>Ваша ціна</Text>
          <Text style={{ fontFamily: FONT.xb, fontSize: 18, color: T.ink }}>{order.price ?? '—'} ₴</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Icon name="spark" size={15} color={T.accentDark} />
          <Text style={{ fontFamily: FONT.b, fontSize: 13.5, color: T.accentDark }}>Змінити</Text>
        </View>
      </Pressable>
    );
  }

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#fff',
          borderWidth: 1.5,
          borderColor: T.accentDark,
          borderRadius: 12,
          paddingHorizontal: 14,
          height: 48,
        }}
      >
        <TextInput
          value={String(val)}
          onChangeText={(t) => setVal(t.replace(/[^0-9.]/g, ''))}
          keyboardType="decimal-pad"
          autoFocus
          style={{ flex: 1, fontFamily: FONT.xb, fontSize: 16, color: T.ink, padding: 0 }}
        />
        <Text style={{ fontFamily: FONT.b, fontSize: 13, color: T.txt3 }}>₴</Text>
      </View>
      <Pressable
        onPress={save}
        disabled={busy}
        style={{ height: 48, paddingHorizontal: 16, borderRadius: 12, backgroundColor: T.accent, alignItems: 'center', justifyContent: 'center', opacity: busy ? 0.6 : 1 }}
      >
        <Text style={{ fontFamily: FONT.xb, fontSize: 14, color: T.ink }}>OK</Text>
      </Pressable>
      <Pressable onPress={() => setEditing(false)} style={{ height: 48, paddingHorizontal: 8, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontFamily: FONT.b, fontSize: 13.5, color: T.txt2 }}>Скасувати</Text>
      </Pressable>
    </View>
  );
}
