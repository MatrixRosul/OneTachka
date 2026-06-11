import React, { useCallback, useState } from 'react';
import { View, Text } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { T, FONT } from '../../theme';
import { Screen } from '../../components/Screen';
import { Card } from '../../components/ui';
import { Truck } from '../../components/Icon';
import { api } from '../../api';
import type { Order } from '../../types';

function money(n: number): string {
  return n.toLocaleString('uk-UA');
}

export function EarningsScreen() {
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
    }, [load]),
  );

  const completed = orders.filter((o) => o.status === 'COMPLETED');
  const total = completed.reduce((s, o) => s + (o.price ? Number(o.price) : 0), 0);
  const inProgress = orders.filter((o) => o.status === 'ACCEPTED' || o.status === 'IN_PROGRESS');
  const pending = inProgress.reduce((s, o) => s + (o.price ? Number(o.price) : 0), 0);

  return (
    <Screen
      refreshing={refreshing}
      onRefresh={async () => {
        setRefreshing(true);
        await load();
        setRefreshing(false);
      }}
    >
      {/* balance card */}
      <Card style={{ backgroundColor: T.ink, borderColor: T.ink, padding: 20 }}>
        <Text style={{ fontFamily: FONT.m, fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>Зароблено (виконані)</Text>
        <Text style={{ fontFamily: FONT.xb, fontSize: 38, color: '#fff', letterSpacing: -1.5, marginTop: 2 }}>
          {money(total)} ₴
        </Text>
        <View style={{ flexDirection: 'row', gap: 24, marginTop: 14 }}>
          <View>
            <Text style={{ fontFamily: FONT.xb, fontSize: 16, color: T.accent }}>{completed.length}</Text>
            <Text style={{ fontFamily: FONT.m, fontSize: 11.5, color: 'rgba(255,255,255,0.6)' }}>поїздок</Text>
          </View>
          <View>
            <Text style={{ fontFamily: FONT.xb, fontSize: 16, color: '#fff' }}>{money(pending)} ₴</Text>
            <Text style={{ fontFamily: FONT.m, fontSize: 11.5, color: 'rgba(255,255,255,0.6)' }}>в роботі ({inProgress.length})</Text>
          </View>
        </View>
      </Card>

      <Text style={{ fontFamily: FONT.b, fontSize: 13, color: T.txt2, marginTop: 8, marginBottom: 8 }}>
        Останні поїздки
      </Text>
      {completed.length === 0 ? (
        <Text style={{ fontFamily: FONT.m, fontSize: 13.5, color: T.txt3 }}>
          Поки немає виконаних замовлень.
        </Text>
      ) : (
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          {completed.map((o, i) => (
            <View
              key={o.id}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                padding: 14,
                borderBottomWidth: i < completed.length - 1 ? 1 : 0,
                borderBottomColor: T.line,
              }}
            >
              <View style={{ width: 38, height: 38, borderRadius: 10, backgroundColor: T.bg, alignItems: 'center', justifyContent: 'center' }}>
                <Truck size="m" color={T.ink} w={26} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: FONT.b, fontSize: 13.5, color: T.ink }} numberOfLines={1}>
                  {o.cargoType}
                </Text>
                <Text style={{ fontFamily: FONT.m, fontSize: 11.5, color: T.txt3 }} numberOfLines={1}>
                  {o.pickupAddress} → {o.dropoffAddress}
                </Text>
              </View>
              <Text style={{ fontFamily: FONT.xb, fontSize: 14.5, color: T.green }}>
                +{o.price ? money(Number(o.price)) : 0} ₴
              </Text>
            </View>
          ))}
        </Card>
      )}
    </Screen>
  );
}
