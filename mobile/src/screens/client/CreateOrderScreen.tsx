import React, { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { T, FONT, VEHICLE_LABEL } from '../../theme';
import { Screen } from '../../components/Screen';
import { Card, PrimaryBtn, SectionTitle, ErrorText, Toggle, Stepper } from '../../components/ui';
import { Icon, Truck } from '../../components/Icon';
import { api, errText } from '../../api';
import type { VehicleType } from '../../types';

// Геокодування поза MVP — адреси вводимо текстом, координати шлемо дефолтні (валідні).
const PICKUP = { lat: 48.6208, lng: 22.2879 };
const DROPOFF = { lat: 48.4414, lng: 22.7178 };

type Mode = 'euro' | 'usa' | 'exact';

// Автопідбір машини за об'ємом+вагою (логіка з дизайну: s/m/l → VAN/TRUCK_SMALL/TRUCK_LARGE).
function pickVehicle(weight: number, volume: number, oversized: boolean): {
  v: VehicleType;
  name: string;
  sub: string;
  size: 's' | 'm' | 'l';
} {
  if (oversized) return { v: 'TRUCK_LARGE', name: 'Вантажівка 10 тонн', sub: 'до 10 т · 45 м³', size: 'l' };
  if (weight <= 1200 && volume <= 9) return { v: 'VAN', name: 'Бус (Sprinter)', sub: 'до 1.5 т · 8 м³', size: 's' };
  if (weight <= 3000 && volume <= 20) return { v: 'TRUCK_SMALL', name: 'Вантажівка 3 тонни', sub: 'до 3 т · 18 м³', size: 'm' };
  return { v: 'TRUCK_LARGE', name: 'Вантажівка 10 тонн', sub: 'до 10 т · 45 м³', size: 'l' };
}

function NumBox({ value, onChange, suffix, label, width }: {
  value: number;
  onChange: (n: number) => void;
  suffix?: string;
  label?: string;
  width?: number;
}) {
  return (
    <View style={{ width: width ?? '100%' }}>
      {label && <Text style={{ fontFamily: FONT.sb, fontSize: 11.5, color: T.txt3, marginBottom: 5 }}>{label}</Text>}
      <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderWidth: 1.5, borderColor: T.border, borderRadius: 12, paddingHorizontal: 12, height: 48, gap: 6 }}>
        <TextInput
          value={String(value)}
          onChangeText={(t) => onChange(t === '' ? 0 : Number(t.replace(/[^0-9]/g, '')))}
          keyboardType="numeric"
          style={{ flex: 1, fontFamily: FONT.xb, fontSize: 16, color: T.ink, padding: 0 }}
        />
        {suffix && <Text style={{ fontFamily: FONT.b, fontSize: 13, color: T.txt3 }}>{suffix}</Text>}
      </View>
    </View>
  );
}

export function CreateOrderScreen({ navigation }: { navigation: any }) {
  const [pickup, setPickup] = useState('Ужгород, вул. Капушанська 12');
  const [dropoff, setDropoff] = useState('Мукачево, вул. Духновича 4');

  const [mode, setMode] = useState<Mode>('euro');
  const [pallets, setPallets] = useState(2);
  const [height, setHeight] = useState(200); // cm
  const [box, setBox] = useState({ l: 80, w: 60, h: 80, qty: 1 });
  const [weight, setWeight] = useState(500); // kg
  const [oversized, setOversized] = useState(false);

  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const palletArea = mode === 'usa' ? 1.0 * 1.2 : 1.2 * 0.8;
  const volume =
    mode === 'exact'
      ? (box.l / 100) * (box.w / 100) * (box.h / 100) * Math.max(1, box.qty)
      : palletArea * (height / 100) * Math.max(1, pallets);
  const veh = pickVehicle(weight, volume, oversized);

  const sizeLabel =
    mode === 'exact'
      ? `Коробки ${box.l}×${box.w}×${box.h} см ×${box.qty}`
      : `${pallets} ${mode === 'usa' ? 'ам.' : 'євро'}палет · ${height} см`;

  async function submit() {
    setErr('');
    if (pickup.trim().length < 3 || dropoff.trim().length < 3) {
      setErr('Вкажіть адреси «звідки» та «куди»');
      return;
    }
    setBusy(true);
    try {
      await api.createOrder({
        pickupAddress: pickup.trim(),
        pickupLat: PICKUP.lat,
        pickupLng: PICKUP.lng,
        dropoffAddress: dropoff.trim(),
        dropoffLat: DROPOFF.lat,
        dropoffLng: DROPOFF.lng,
        cargoType: sizeLabel.slice(0, 120),
        weightKg: Math.max(1, Math.round(weight)),
        vehicleType: veh.v,
        description: `≈${volume.toFixed(1)} м³${oversized ? ' · негабарит' : ''}`,
      });
      navigation.navigate('Замовлення');
    } catch (ex) {
      setErr(errText(ex));
    } finally {
      setBusy(false);
    }
  }

  const seg = (k: Mode, label: string) => {
    const on = mode === k;
    return (
      <Pressable
        key={k}
        onPress={() => setMode(k)}
        style={{
          flex: 1,
          height: 42,
          borderRadius: 12,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: on ? T.ink : '#fff',
          borderWidth: 1.5,
          borderColor: on ? T.ink : T.border,
        }}
      >
        <Text style={{ fontFamily: FONT.b, fontSize: 12.5, color: on ? '#fff' : T.txt }}>{label}</Text>
      </Pressable>
    );
  };

  const addrRow = (color: string, iconName: 'dot' | 'pin', label: string, value: string, onChange: (v: string) => void, divider: boolean) => (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 12,
        borderBottomWidth: divider ? 1 : 0,
        borderBottomColor: T.line,
      }}
    >
      <Icon name={iconName} size={iconName === 'dot' ? 14 : 16} color={color} />
      <View style={{ flex: 1 }}>
        <Text style={{ fontFamily: FONT.sb, fontSize: 11, color: T.txt3 }}>{label}</Text>
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder="Адреса"
          placeholderTextColor={T.txt3}
          style={{ fontFamily: FONT.b, fontSize: 14.5, color: T.ink, padding: 0, marginTop: 1 }}
        />
      </View>
    </View>
  );

  return (
    <Screen>
      {/* addresses — minimalist, no coordinates */}
      <Card style={{ paddingVertical: 4 }}>
        {addrRow(T.green, 'dot', 'Звідки', pickup, setPickup, true)}
        {addrRow(T.accentDark, 'pin', 'Куди', dropoff, setDropoff, false)}
      </Card>

      {/* cargo size */}
      <SectionTitle>Розмір вантажу</SectionTitle>
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
        {seg('euro', 'Європалети')}
        {seg('usa', 'Амер. палети')}
        {seg('exact', 'Точні розміри')}
      </View>

      {mode !== 'exact' ? (
        <Card style={{ paddingVertical: 4 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: T.line }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: FONT.b, fontSize: 14.5, color: T.ink }}>Кількість палет</Text>
              <Text style={{ fontFamily: FONT.m, fontSize: 12, color: T.txt3 }}>
                {mode === 'usa' ? 'Американська · 100 × 120 см' : 'Європалета · 120 × 80 см'}
              </Text>
            </View>
            <Stepper value={pallets} onChange={setPallets} min={1} max={20} />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: FONT.b, fontSize: 14.5, color: T.ink }}>Висота вантажу</Text>
              <Text style={{ fontFamily: FONT.m, fontSize: 12, color: T.txt3 }}>У сантиметрах</Text>
            </View>
            <NumBox value={height} onChange={setHeight} suffix="см" width={120} />
          </View>
        </Card>
      ) : (
        <Card>
          <Text style={{ fontFamily: FONT.sb, fontSize: 12, color: T.txt3, marginBottom: 10 }}>Розміри однієї коробки, см</Text>
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
            <View style={{ flex: 1 }}><NumBox label="Довжина" value={box.l} onChange={(v) => setBox((b) => ({ ...b, l: v }))} suffix="см" /></View>
            <View style={{ flex: 1 }}><NumBox label="Ширина" value={box.w} onChange={(v) => setBox((b) => ({ ...b, w: v }))} suffix="см" /></View>
            <View style={{ flex: 1 }}><NumBox label="Висота" value={box.h} onChange={(v) => setBox((b) => ({ ...b, h: v }))} suffix="см" /></View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ flex: 1, fontFamily: FONT.b, fontSize: 14.5, color: T.ink }}>Кількість коробок</Text>
            <Stepper value={box.qty} onChange={(v) => setBox((b) => ({ ...b, qty: v }))} min={1} max={99} />
          </View>
        </Card>
      )}

      {/* weight */}
      <SectionTitle>Вага вантажу</SectionTitle>
      <View style={{ marginBottom: 10 }}>
        <NumBox value={weight} onChange={setWeight} suffix="кг" />
      </View>
      <Pressable onPress={() => setOversized((o) => !o)}>
        <Card style={{ flexDirection: 'row', alignItems: 'center', gap: 12, borderColor: oversized ? T.accentDark : T.border }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: FONT.b, fontSize: 14.5, color: T.ink }}>Негабаритний вантаж</Text>
            <Text style={{ fontFamily: FONT.m, fontSize: 12, color: T.txt3 }}>Нестандартні розміри або форма</Text>
          </View>
          <Toggle on={oversized} onPress={() => setOversized((o) => !o)} />
        </Card>
      </Pressable>

      {/* auto-picked vehicle */}
      <Card style={{ backgroundColor: T.ink, borderColor: T.ink, flexDirection: 'row', alignItems: 'center', gap: 14 }}>
        <View style={{ width: 56, height: 56, borderRadius: 14, backgroundColor: 'rgba(242,200,75,0.15)', alignItems: 'center', justifyContent: 'center' }}>
          <Truck size={veh.size} color={T.accent} w={42} />
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 }}>
            <Icon name="spark" size={13} color={T.accent} />
            <Text style={{ fontFamily: FONT.xb, fontSize: 10.5, color: T.accent, letterSpacing: 0.5 }}>
              ПРОГРАМА ПІДІБРАЛА МАШИНУ
            </Text>
          </View>
          <Text style={{ fontFamily: FONT.xb, fontSize: 16, color: '#fff' }}>{veh.name}</Text>
          <Text style={{ fontFamily: FONT.m, fontSize: 12.5, color: 'rgba(255,255,255,0.6)' }}>
            {veh.sub} · ≈{volume.toFixed(1)} м³
          </Text>
        </View>
      </Card>

      <ErrorText>{err}</ErrorText>
      <PrimaryBtn icon="arrow" onPress={submit} disabled={busy}>
        Створити заявку
      </PrimaryBtn>
      <Text style={{ fontFamily: FONT.r, fontSize: 11.5, color: T.txt3, textAlign: 'center', marginTop: 10 }}>
        Тип авто визначається автоматично за об'ємом і вагою. Заявку прийме водій із таким авто.
      </Text>
    </Screen>
  );
}
