import React, { useCallback, useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { T, FONT } from '../../theme';
import { Screen } from '../../components/Screen';
import { Avatar, Card, PrimaryBtn, Field, SectionTitle, ScreenHeader, ErrorText, StatCards, ListCard, Row } from '../../components/ui';
import { VehiclePicker } from '../../components/VehiclePicker';
import { useAuth } from '../../AuthContext';
import { api, errText } from '../../api';
import type { Order, VehicleType } from '../../types';

export function DriverProfileScreen({ navigation }: { navigation: any }) {
  const { me, refresh, logout } = useAuth();
  const prof = me?.driverProfile ?? null;
  const [vehicleType, setVehicleType] = useState<VehicleType>(prof?.vehicleType ?? 'VAN');
  const [capacity, setCapacity] = useState(String(prof?.capacityKg ?? 1000));
  const [plate, setPlate] = useState(prof?.licensePlate ?? '');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);

  useFocusEffect(
    useCallback(() => {
      api.myOrders().then(setOrders).catch(() => {});
    }, []),
  );

  if (!me) return null;

  const completed = orders.filter((o) => o.status === 'COMPLETED');
  const earned = completed.reduce((s, o) => s + (o.price ? Number(o.price) : 0), 0);

  async function save() {
    setErr('');
    setBusy(true);
    setSaved(false);
    try {
      await api.putProfile({ vehicleType, capacityKg: Number(capacity) || 0, licensePlate: plate });
      await refresh();
      setSaved(true);
    } catch (ex) {
      setErr(errText(ex));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen>
      <ScreenHeader title="Профіль" />

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 18 }}>
        <Avatar initials={(me.fullName ?? 'В')[0]} size={64} ring />
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: FONT.xb, fontSize: 20, color: T.ink, letterSpacing: -0.5 }}>{me.fullName}</Text>
          <Text style={{ fontFamily: FONT.m, fontSize: 13, color: T.txt2 }}>Водій · {me.phone}</Text>
        </View>
      </View>

      <StatCards
        items={[
          [String(completed.length), 'поїздок'],
          [me.ratingAvg.toFixed(1), 'рейтинг'],
          [`${earned.toLocaleString('uk-UA')} ₴`, 'зароблено'],
        ]}
      />

      <SectionTitle>Профіль авто</SectionTitle>
      <View style={{ marginBottom: 12 }}>
        <VehiclePicker value={vehicleType} onChange={setVehicleType} />
      </View>
      <Card>
        <Field label="Вантажопідйомність" value={capacity} onChangeText={setCapacity} keyboardType="numeric" suffix="кг" />
        <Field label="Номер авто" value={plate} onChangeText={setPlate} placeholder="AA1234BB" />
      </Card>
      <ErrorText>{err}</ErrorText>
      {saved && <Text style={{ fontFamily: FONT.sb, fontSize: 13, color: T.green, marginBottom: 8 }}>Профіль збережено</Text>}
      <View style={{ marginBottom: 18 }}>
        <PrimaryBtn onPress={save} disabled={busy}>Зберегти профіль</PrimaryBtn>
      </View>

      <ListCard>
        <Row icon="box" title="Заробіток і виплати" detail={`${earned.toLocaleString('uk-UA')} ₴`} onPress={() => navigation.navigate('Заробіток')} />
        <Row icon="shield" title="Документи" detail="верифікація" onPress={() => navigation.navigate('Розділ', { title: 'Документи' })} />
        <Row icon="star" title="Premium" accent={T.accentDark} onPress={() => navigation.navigate('Розділ', { title: 'Onetachka Premium' })} />
        <Row icon="chat" title="Підтримка" onPress={() => navigation.navigate('Розділ', { title: 'Підтримка' })} />
        <Row icon="menu" title="Налаштування" onPress={() => navigation.navigate('Розділ', { title: 'Налаштування' })} />
        <Row icon="arrow" title="Вийти" accent={T.red} chevron={false} last onPress={logout} />
      </ListCard>
    </Screen>
  );
}
