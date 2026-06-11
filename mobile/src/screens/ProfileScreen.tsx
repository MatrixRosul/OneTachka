import React, { useCallback, useState } from 'react';
import { View, Text } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { T, FONT } from '../theme';
import { Screen } from '../components/Screen';
import { Avatar, StatCards, ListCard, Row, ScreenHeader } from '../components/ui';
import { useAuth } from '../AuthContext';
import { api } from '../api';

export function ProfileScreen() {
  const { me, logout } = useAuth();
  const [count, setCount] = useState(0);

  useFocusEffect(
    useCallback(() => {
      api.myOrders().then((o) => setCount(o.length)).catch(() => {});
    }, []),
  );

  if (!me) return null;

  return (
    <Screen>
      <ScreenHeader title="Профіль" />

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 18 }}>
        <Avatar initials={(me.fullName ?? 'К')[0]} size={64} ring />
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: FONT.xb, fontSize: 20, color: T.ink, letterSpacing: -0.5 }}>{me.fullName}</Text>
          <Text style={{ fontFamily: FONT.m, fontSize: 13, color: T.txt2 }}>Клієнт · {me.phone}</Text>
        </View>
      </View>

      <StatCards
        items={[
          [String(count), 'замовлень'],
          [me.ratingAvg.toFixed(1), 'рейтинг'],
          [String(me.ratingCount), 'відгуків'],
        ]}
      />

      <ListCard>
        <Row icon="arrow" title="Вийти" accent={T.red} chevron={false} last onPress={logout} />
      </ListCard>
    </Screen>
  );
}
