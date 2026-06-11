import React, { useCallback, useState } from 'react';
import { View, Text, Pressable, Modal, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { T, FONT } from '../../theme';
import { Screen } from '../../components/Screen';
import { Avatar, Card, PrimaryBtn } from '../../components/ui';
import { Icon } from '../../components/Icon';
import { OrderCard } from '../../components/OrderCard';
import { useAuth } from '../../AuthContext';
import { useCity } from '../../CityContext';
import { CITIES } from '../../cities';
import { api } from '../../api';
import type { Order } from '../../types';

const ACTIVE = new Set(['SEARCHING', 'ACCEPTED', 'IN_PROGRESS']);

export function HomeScreen({ navigation }: { navigation: any }) {
  const { me } = useAuth();
  const { city, setCity } = useCity();
  const [orders, setOrders] = useState<Order[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);

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
  const recent = orders.slice(0, 4);

  return (
    <Screen
      refreshing={refreshing}
      onRefresh={async () => {
        setRefreshing(true);
        await load();
        setRefreshing(false);
      }}
    >
      {/* top: location pill + avatar (per design) */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, marginTop: 2 }}>
        <Pressable
          onPress={() => setCityOpen(true)}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 7, backgroundColor: '#fff', borderWidth: 1, borderColor: T.border, borderRadius: 999, paddingVertical: 8, paddingLeft: 11, paddingRight: 13 }}
        >
          <Icon name="pin" size={16} color={T.accentDark} />
          <Text style={{ fontFamily: FONT.b, fontSize: 13.5, color: T.ink }}>{city.name}</Text>
          <Icon name="chevR" size={14} color={T.txt3} />
        </Pressable>
        <Avatar initials={(me?.fullName ?? 'К')[0]} size={42} />
      </View>

      <Text style={{ fontFamily: FONT.xb, fontSize: 25, color: T.ink, letterSpacing: -0.7, lineHeight: 28, marginBottom: 16 }}>
        Куди доставити{'\n'}вантаж сьогодні?
      </Text>

      <Pressable onPress={() => navigation.navigate('Створити')}>
        <Card style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Icon name="search" size={20} color={T.txt3} />
          <Text style={{ fontFamily: FONT.sb, fontSize: 15, color: T.txt3, flex: 1 }}>Створити нову заявку</Text>
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
        <Text style={{ fontFamily: FONT.m, fontSize: 13.5, color: T.txt3 }}>Поки немає активних замовлень.</Text>
      ) : (
        active.map((o) => <OrderCard key={o.id} order={o} />)
      )}

      {recent.length > 0 && (
        <>
          <Text style={{ fontFamily: FONT.b, fontSize: 14, color: T.txt2, marginTop: 18, marginBottom: 4 }}>
            Нещодавні маршрути
          </Text>
          <Card style={{ padding: 0 }}>
            {recent.map((o, i) => (
              <Pressable
                key={o.id}
                onPress={() => navigation.navigate('Створити')}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderBottomWidth: i < recent.length - 1 ? 1 : 0, borderBottomColor: T.line }}
              >
                <View style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: T.bg, alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="clock" size={17} color={T.txt2} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: FONT.b, fontSize: 13.5, color: T.ink }} numberOfLines={1}>
                    {o.pickupAddress} → {o.dropoffAddress}
                  </Text>
                  <Text style={{ fontFamily: FONT.m, fontSize: 11.5, color: T.txt3 }} numberOfLines={1}>
                    {new Date(o.createdAt).toLocaleDateString('uk')}{o.price ? ` · ${o.price} ₴` : ''}
                  </Text>
                </View>
                <Icon name="arrowUR" size={16} color={T.txt3} />
              </Pressable>
            ))}
          </Card>
        </>
      )}

      {/* city picker */}
      <Modal visible={cityOpen} transparent animationType="slide" onRequestClose={() => setCityOpen(false)}>
        <Pressable onPress={() => setCityOpen(false)} style={{ flex: 1, backgroundColor: 'rgba(20,30,70,0.45)', justifyContent: 'flex-end' }}>
          <Pressable onPress={() => {}} style={{ backgroundColor: '#fff', borderTopLeftRadius: T.radSheet, borderTopRightRadius: T.radSheet, paddingTop: 16, paddingBottom: 28, maxHeight: '70%' }}>
            <View style={{ width: 38, height: 4.5, borderRadius: 9, backgroundColor: '#E2E1DB', alignSelf: 'center', marginBottom: 14 }} />
            <Text style={{ fontFamily: FONT.xb, fontSize: 18, color: T.ink, paddingHorizontal: 18, marginBottom: 8 }}>
              Ваше місто
            </Text>
            <ScrollView>
              {CITIES.map((c) => {
                const on = c.name === city.name;
                return (
                  <Pressable
                    key={c.name}
                    onPress={() => {
                      setCity(c);
                      setCityOpen(false);
                    }}
                    style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 18, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: T.line }}
                  >
                    <Icon name="pin" size={18} color={on ? T.accentDark : T.txt3} />
                    <Text style={{ flex: 1, fontFamily: on ? FONT.xb : FONT.b, fontSize: 15, color: on ? T.ink : T.txt }}>{c.name}</Text>
                    {on && <Icon name="check" size={18} color={T.green} />}
                  </Pressable>
                );
              })}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </Screen>
  );
}
