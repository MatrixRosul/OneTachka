import React, { useCallback, useState } from 'react';
import { Text, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { T, FONT } from '../../theme';
import { Screen } from '../../components/Screen';
import { PrimaryBtn, Card } from '../../components/ui';
import { OrderCard } from '../../components/OrderCard';
import { ApiError, api, errText } from '../../api';
import type { Order } from '../../types';

export function AvailableScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [notice, setNotice] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      setOrders(await api.availableOrders());
      setNotice('');
    } catch (ex) {
      if (ex instanceof ApiError && ex.code === 'profile_required') {
        setNotice('Заповніть профіль авто (вкладка «Профіль»), щоб бачити заявки.');
        setOrders([]);
      }
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
      const t = setInterval(load, 5000);
      return () => clearInterval(t);
    }, [load]),
  );

  async function accept(id: string) {
    try {
      await api.accept(id);
      load();
    } catch (ex) {
      Alert.alert('Не вдалося прийняти', errText(ex));
      load();
    }
  }

  return (
    <Screen
      refreshing={refreshing}
      onRefresh={async () => {
        setRefreshing(true);
        await load();
        setRefreshing(false);
      }}
    >
      {notice ? (
        <Card style={{ backgroundColor: '#FFF7E0', borderColor: '#F0D890' }}>
          <Text style={{ fontFamily: FONT.m, fontSize: 13.5, color: T.txt2 }}>{notice}</Text>
        </Card>
      ) : null}
      {!notice && orders.length === 0 && (
        <Text style={{ fontFamily: FONT.m, fontSize: 13.5, color: T.txt3 }}>
          Немає відповідних заявок під ваше авто.
        </Text>
      )}
      {orders.map((o) => (
        <OrderCard key={o.id} order={o}>
          <PrimaryBtn icon="check" onPress={() => accept(o.id)}>
            Прийняти
          </PrimaryBtn>
        </OrderCard>
      ))}
    </Screen>
  );
}
