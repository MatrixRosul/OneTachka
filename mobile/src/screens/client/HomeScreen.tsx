import React, { useCallback, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { T, FONT } from '../../theme';
import { Screen } from '../../components/Screen';
import { Avatar, Card, PrimaryBtn } from '../../components/ui';
import { Icon } from '../../components/Icon';
import { OrderCard } from '../../components/OrderCard';
import { useAuth } from '../../AuthContext';
import { api } from '../../api';
import type { Order } from '../../types';

const ACTIVE = new Set(['SEARCHING', 'ACCEPTED', 'IN_PROGRESS']);

export function HomeScreen({ navigation }: { navigation: any }) {
  const { me } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      setOrders(await api.myOrders());
    } catch {
      /* ignore */
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
      const t = setInterval(load, 5000);
      return () => clearInterval(t);
    }, [load]),
  );

  const active = orders.filter((o) => ACTIVE.has(o.status));

  return (
    <Screen
      refreshing={refreshing}
      onRefresh={async () => {
        setRefreshing(true);
        await load();
        setRefreshing(false);
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
        <View>
          <Text style={{ fontFamily: FONT.m, fontSize: 13, color: T.txt2 }}>Вітаємо,</Text>
          <Text style={{ fontFamily: FONT.xb, fontSize: 20, color: T.ink, letterSpacing: -0.4 }}>
            {me?.fullName ?? 'Клієнт'}
          </Text>
        </View>
        <Avatar initials={(me?.fullName ?? 'К')[0]} size={44} />
      </View>

      <Text style={{ fontFamily: FONT.xb, fontSize: 25, color: T.ink, letterSpacing: -0.7, lineHeight: 28, marginBottom: 16 }}>
        Куди доставити{'\n'}вантаж сьогодні?
      </Text>

      <Pressable onPress={() => navigation.navigate('Створити')}>
        <Card style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Icon name="search" size={20} color={T.txt3} />
          <Text style={{ fontFamily: FONT.sb, fontSize: 15, color: T.txt3, flex: 1 }}>
            Створити нову заявку
          </Text>
          <Icon name="chevR" size={18} color={T.txt3} />
        </Card>
      </Pressable>

      <View style={{ marginVertical: 6 }}>
        <PrimaryBtn icon="plus" onPress={() => navigation.navigate('Створити')}>
          Нова заявка
        </PrimaryBtn>
      </View>

      <Text style={{ fontFamily: FONT.b, fontSize: 14, color: T.txt2, marginTop: 18, marginBottom: 8 }}>
        Активні замовлення ({active.length})
      </Text>
      {active.length === 0 ? (
        <Text style={{ fontFamily: FONT.m, fontSize: 13.5, color: T.txt3 }}>
          Поки немає активних замовлень.
        </Text>
      ) : (
        active.map((o) => <OrderCard key={o.id} order={o} />)
      )}
    </Screen>
  );
}
