import React, { useCallback, useState } from 'react';
import { View, Text } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { T, FONT } from '../theme';
import { Screen } from '../components/Screen';
import { Avatar, StatCards, ListCard, Row, GroupLabel } from '../components/ui';
import { useAuth } from '../AuthContext';
import { api } from '../api';

export function ProfileScreen({ navigation }: { navigation: any }) {
  const { me, logout } = useAuth();
  const [count, setCount] = useState(0);

  useFocusEffect(
    useCallback(() => {
      api.myOrders().then((o) => setCount(o.length)).catch(() => {});
    }, []),
  );

  if (!me) return null;
  const stub = (title: string) => navigation.navigate('Розділ', { title });

  return (
    <Screen>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 18, marginTop: 4 }}>
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
        <Row icon="box" title="Способи оплати" onPress={() => stub('Способи оплати')} />
        <Row icon="pin" title="Збережені адреси" onPress={() => stub('Збережені адреси')} />
        <Row icon="spark" title="Промокоди" onPress={() => stub('Промокоди')} last />
      </ListCard>

      <GroupLabel>Безпека</GroupLabel>
      <ListCard>
        <Row icon="shield" title="Верифікація" onPress={() => stub('Верифікація')} />
        <Row icon="user" title="Особисті дані" onPress={() => stub('Особисті дані')} last />
      </ListCard>

      <GroupLabel>Бізнес</GroupLabel>
      <ListCard>
        <Row icon="box" title="Onetachka для бізнесу" detail="B2B" accent={T.accentDark} onPress={() => stub('Onetachka для бізнесу')} last />
      </ListCard>

      <ListCard>
        <Row icon="chat" title="Підтримка" onPress={() => stub('Підтримка')} />
        <Row icon="menu" title="Налаштування" onPress={() => stub('Налаштування')} />
        <Row icon="arrowUR" title="Вийти" accent={T.danger} chevron={false} last onPress={logout} />
      </ListCard>
    </Screen>
  );
}
