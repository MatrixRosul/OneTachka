import React, { useCallback, useRef, useState } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { T, FONT, VEHICLE_LABEL } from '../../theme';
import { Screen } from '../../components/Screen';
import { Avatar, Card, PrimaryBtn, Stars, ScreenHeader } from '../../components/ui';
import { Icon } from '../../components/Icon';
import { IncomingOrderModal } from '../../components/IncomingOrderModal';
import { useAuth } from '../../AuthContext';
import { api, errText } from '../../api';
import type { Order } from '../../types';

export function DashboardScreen({ navigation }: { navigation: any }) {
  const { me, refresh } = useAuth();
  const [busy, setBusy] = useState(false);
  const [incoming, setIncoming] = useState<Order | null>(null);
  const [acceptBusy, setAcceptBusy] = useState(false);
  const skipped = useRef<Set<string>>(new Set());
  const prof = me?.driverProfile ?? null;
  const online = prof?.isAvailable ?? false;

  // Поки водій на зміні — стежимо за новими заявками й пропонуємо прийняти (як у таксі).
  useFocusEffect(
    useCallback(() => {
      if (!online) return;
      let alive = true;
      const poll = async () => {
        try {
          const list = await api.availableOrders();
          if (!alive) return;
          setIncoming((prev) => prev ?? list.find((o) => !skipped.current.has(o.id)) ?? null);
        } catch {
          /* ignore (e.g. profile_required) */
        }
      };
      poll();
      const t = setInterval(poll, 4000);
      return () => {
        alive = false;
        clearInterval(t);
      };
    }, [online]),
  );

  if (!me) return null;

  async function acceptIncoming() {
    if (!incoming) return;
    setAcceptBusy(true);
    try {
      await api.accept(incoming.id);
      setIncoming(null);
      navigation.navigate('Замовлення');
    } catch {
      skipped.current.add(incoming.id);
      setIncoming(null);
    } finally {
      setAcceptBusy(false);
    }
  }
  function skipIncoming() {
    if (incoming) skipped.current.add(incoming.id);
    setIncoming(null);
  }

  async function toggle() {
    if (!prof) return;
    setBusy(true);
    try {
      await api.setAvailability({ isAvailable: !online });
      await refresh();
    } catch (ex) {
      Alert.alert('Помилка', errText(ex));
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
    <Screen onRefresh={refresh}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 11, marginBottom: 18 }}>
        <Avatar initials={(me.fullName ?? 'В')[0]} size={46} ring />
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: FONT.xb, fontSize: 17, color: T.ink }}>{me.fullName}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Stars value={me.ratingAvg} size={12} />
            <Text style={{ fontFamily: FONT.m, fontSize: 12.5, color: T.txt2 }}>· {me.ratingCount} відгуків</Text>
          </View>
        </View>
      </View>

      {!prof ? (
        <Card style={{ backgroundColor: '#FFF7E0', borderColor: '#F0D890' }}>
          <Text style={{ fontFamily: FONT.b, fontSize: 14.5, color: T.ink, marginBottom: 4 }}>
            Заповніть профіль авто
          </Text>
          <Text style={{ fontFamily: FONT.m, fontSize: 13, color: T.txt2, marginBottom: 12 }}>
            Без профілю ви не побачите доступних заявок. Перейдіть у вкладку «Профіль».
          </Text>
          <PrimaryBtn onPress={() => navigation.navigate('Профіль')}>До профілю</PrimaryBtn>
        </Card>
      ) : (
        <>
          <Card style={{ backgroundColor: online ? T.ink : T.surface, borderColor: online ? T.ink : T.border, padding: 20 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: FONT.b, fontSize: 13, color: online ? T.accent : T.txt2 }}>
                  {online ? '● Ви на лінії' : '○ Ви офлайн'}
                </Text>
                <Text style={{ fontFamily: FONT.xb, fontSize: 19, color: online ? '#fff' : T.ink, marginTop: 4 }}>
                  {online ? 'Приймаєте замовлення' : 'Вийти на зміну?'}
                </Text>
              </View>
              <Pressable
                onPress={toggle}
                disabled={busy}
                style={{
                  width: 64,
                  height: 36,
                  borderRadius: 999,
                  backgroundColor: online ? T.accent : '#E2E1DB',
                  justifyContent: 'center',
                  padding: 4,
                  opacity: busy ? 0.6 : 1,
                }}
              >
                <View
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 14,
                    backgroundColor: '#fff',
                    alignSelf: online ? 'flex-end' : 'flex-start',
                  }}
                />
              </Pressable>
            </View>
          </Card>

          <View style={{ flexDirection: 'row', gap: 10, marginBottom: 12 }}>
            <Card style={{ flex: 1, marginBottom: 0 }}>
              <Icon name="box" size={20} color={T.ink} />
              <Text style={{ fontFamily: FONT.xb, fontSize: 18, color: T.ink, marginTop: 6 }}>
                {VEHICLE_LABEL[prof.vehicleType]}
              </Text>
              <Text style={{ fontFamily: FONT.m, fontSize: 12, color: T.txt3 }}>{prof.capacityKg} кг · {prof.licensePlate}</Text>
            </Card>
            <Card style={{ flex: 1, marginBottom: 0 }}>
              <Icon name="star" size={20} color={T.accentDark} />
              <Text style={{ fontFamily: FONT.xb, fontSize: 18, color: T.ink, marginTop: 6 }}>{me.ratingAvg}</Text>
              <Text style={{ fontFamily: FONT.m, fontSize: 12, color: T.txt3 }}>рейтинг · {me.ratingCount}</Text>
            </Card>
          </View>

          <View style={{ marginTop: 6, gap: 10 }}>
            <PrimaryBtn icon="search" onPress={() => navigation.navigate('Доступні')}>
              Доступні заявки
            </PrimaryBtn>
            <PrimaryBtn color={T.surface} txt={T.ink} onPress={() => navigation.navigate('Заробіток')} style={{ borderWidth: 1.5, borderColor: T.border }}>
              Заробіток і виплати
            </PrimaryBtn>
          </View>
        </>
      )}
    </Screen>
    <IncomingOrderModal order={incoming} onAccept={acceptIncoming} onSkip={skipIncoming} busy={acceptBusy} />
    </>
  );
}
