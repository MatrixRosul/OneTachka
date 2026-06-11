import React, { useCallback, useState } from 'react';
import { Text, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { T, FONT } from '../../theme';
import { Screen } from '../../components/Screen';
import { ScreenHeader, PrimaryBtn } from '../../components/ui';
import { OrderCard } from '../../components/OrderCard';
import { ReviewForm } from '../../components/ReviewForm';
import { api, errText } from '../../api';
import type { Order } from '../../types';

export function ClientOrdersScreen() {
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

  async function cancel(id: string) {
    try {
      await api.cancel(id);
      load();
    } catch (ex) {
      Alert.alert('Не вдалося скасувати', errText(ex));
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
      <ScreenHeader title="Мої замовлення" />
      {orders.length === 0 && (
        <Text style={{ fontFamily: FONT.m, fontSize: 13.5, color: T.txt3 }}>Поки немає замовлень.</Text>
      )}
      {orders.map((o) => (
        <OrderCard key={o.id} order={o}>
          {(o.status === 'SEARCHING' || o.status === 'ACCEPTED') && (
            <PrimaryBtn color={T.surface} txt={T.ink} onPress={() => cancel(o.id)} style={{ borderWidth: 1.5, borderColor: T.border, height: 46 }}>
              Скасувати
            </PrimaryBtn>
          )}
          {o.status === 'COMPLETED' && o.driverId && <ReviewForm orderId={o.id} />}
        </OrderCard>
      ))}
    </Screen>
  );
}
