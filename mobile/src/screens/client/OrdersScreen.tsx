import React, { useCallback, useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { T, FONT } from '../../theme';
import { Screen } from '../../components/Screen';
import { ScreenHeader, PrimaryBtn, Segmented } from '../../components/ui';
import { Icon } from '../../components/Icon';
import { OrderCard } from '../../components/OrderCard';
import { ReviewForm } from '../../components/ReviewForm';
import { api, errText } from '../../api';
import type { Order, OrderStatus } from '../../types';

const ACTIVE: OrderStatus[] = ['SEARCHING', 'ACCEPTED', 'IN_PROGRESS'];

function Empty({ text }: { text: string }) {
  return (
    <View style={{ alignItems: 'center', paddingVertical: 48 }}>
      <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: '#fff', borderWidth: 1, borderColor: T.border, alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
        <Icon name="box" size={28} color={T.txt3} />
      </View>
      <Text style={{ fontFamily: FONT.b, fontSize: 15, color: T.txt2 }}>{text}</Text>
    </View>
  );
}

export function ClientOrdersScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [tab, setTab] = useState('active');
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

  const active = orders.filter((o) => ACTIVE.includes(o.status));
  const history = orders.filter((o) => !ACTIVE.includes(o.status));
  const shown = tab === 'active' ? active : history;

  return (
    <Screen
      refreshing={refreshing}
      onRefresh={async () => {
        setRefreshing(true);
        await load();
        setRefreshing(false);
      }}
    >
      <ScreenHeader title="Замовлення" />
      <Segmented
        tabs={[
          ['active', `Активні${active.length ? ` (${active.length})` : ''}`],
          ['history', 'Історія'],
        ]}
        value={tab}
        onChange={setTab}
      />

      {shown.length === 0 && <Empty text={tab === 'active' ? 'Немає активних замовлень' : 'Історія порожня'} />}

      {shown.map((o) => (
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
