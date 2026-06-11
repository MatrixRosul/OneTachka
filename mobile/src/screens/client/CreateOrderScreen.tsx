import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { T, FONT } from '../../theme';
import { Screen } from '../../components/Screen';
import { Card, Field, PrimaryBtn, SectionTitle, ScreenHeader, ErrorText } from '../../components/ui';
import { VehiclePicker } from '../../components/VehiclePicker';
import { api, errText, type OrderCreateBody } from '../../api';
import type { VehicleType } from '../../types';

const DEFAULTS: OrderCreateBody = {
  pickupAddress: 'Ужгород, вул. Капушанська 12',
  pickupLat: 48.6208,
  pickupLng: 22.2879,
  dropoffAddress: 'Мукачево, вул. Духновича 4',
  dropoffLat: 48.4414,
  dropoffLng: 22.7178,
  cargoType: 'Меблі',
  weightKg: 500,
  vehicleType: 'VAN',
  description: '',
  price: undefined,
};

export function CreateOrderScreen({ navigation }: { navigation: any }) {
  const [f, setF] = useState<OrderCreateBody>(DEFAULTS);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  function upd<K extends keyof OrderCreateBody>(k: K, v: OrderCreateBody[K]) {
    setF((s) => ({ ...s, [k]: v }));
  }
  const num = (v: string) => (v === '' ? 0 : Number(v));

  async function submit() {
    setErr('');
    setBusy(true);
    try {
      await api.createOrder({
        ...f,
        description: f.description || undefined,
        price: f.price || undefined,
      });
      setF(DEFAULTS);
      navigation.navigate('Замовлення');
    } catch (ex) {
      setErr(errText(ex));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen>
      <ScreenHeader title="Нова заявка" />

      <Card>
        <Field label="Звідки" value={f.pickupAddress} onChangeText={(v) => upd('pickupAddress', v)} />
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <View style={{ flex: 1 }}>
            <Field label="Шир." value={String(f.pickupLat)} onChangeText={(v) => upd('pickupLat', num(v))} keyboardType="decimal-pad" />
          </View>
          <View style={{ flex: 1 }}>
            <Field label="Довг." value={String(f.pickupLng)} onChangeText={(v) => upd('pickupLng', num(v))} keyboardType="decimal-pad" />
          </View>
        </View>
        <Field label="Куди" value={f.dropoffAddress} onChangeText={(v) => upd('dropoffAddress', v)} />
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <View style={{ flex: 1 }}>
            <Field label="Шир." value={String(f.dropoffLat)} onChangeText={(v) => upd('dropoffLat', num(v))} keyboardType="decimal-pad" />
          </View>
          <View style={{ flex: 1 }}>
            <Field label="Довг." value={String(f.dropoffLng)} onChangeText={(v) => upd('dropoffLng', num(v))} keyboardType="decimal-pad" />
          </View>
        </View>
      </Card>

      <SectionTitle>Тип транспорту</SectionTitle>
      <View style={{ marginBottom: 14 }}>
        <VehiclePicker value={f.vehicleType} onChange={(v: VehicleType) => upd('vehicleType', v)} />
      </View>

      <Card>
        <Field label="Що везти" value={f.cargoType} onChangeText={(v) => upd('cargoType', v)} placeholder="Меблі, техніка…" />
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <View style={{ flex: 1 }}>
            <Field label="Вага" value={String(f.weightKg)} onChangeText={(v) => upd('weightKg', num(v))} keyboardType="numeric" suffix="кг" />
          </View>
          <View style={{ flex: 1 }}>
            <Field
              label="Ціна (необов'язково)"
              value={f.price != null ? String(f.price) : ''}
              onChangeText={(v) => upd('price', v === '' ? undefined : Number(v))}
              keyboardType="decimal-pad"
              suffix="₴"
            />
          </View>
        </View>
        <Field label="Опис (необов'язково)" value={f.description ?? ''} onChangeText={(v) => upd('description', v)} placeholder="Деталі вантажу" />
      </Card>

      <ErrorText>{err}</ErrorText>

      <View style={{ marginTop: 6 }}>
        <PrimaryBtn icon="arrow" onPress={submit} disabled={busy}>
          Створити заявку
        </PrimaryBtn>
      </View>
      <Text style={{ fontFamily: FONT.r, fontSize: 11.5, color: T.txt3, textAlign: 'center', marginTop: 12 }}>
        Заявка потрапить у спільний пул — водій із відповідним авто прийме її.
      </Text>
    </Screen>
  );
}
