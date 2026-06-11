import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, Alert } from 'react-native';
import { T, FONT, VEHICLE_LABEL } from '../../theme';
import { Screen } from '../../components/Screen';
import { Card, PrimaryBtn, SectionTitle, ErrorText, Toggle, Stepper } from '../../components/ui';
import { Icon, Truck } from '../../components/Icon';
import { AddressField, type Place } from '../../components/AddressField';
import { MapPicker } from '../../components/MapPicker';
import { DateTimeField } from '../../components/DateTimeField';
import { useCity } from '../../CityContext';
import { api, errText } from '../../api';
import type { VehicleType } from '../../types';

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

// Дописуємо номер будинку до вулиці: "вулиця X, 12, Місто".
function withHouse(p: Place, house: string): string {
  const h = house.trim();
  if (!h) return p.address;
  const parts = p.address.split(',').map((s) => s.trim()).filter(Boolean);
  if (parts.length >= 2) return `${parts[0]}, ${h}, ${parts.slice(1).join(', ')}`;
  return `${p.address}, ${h}`;
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
  const { city } = useCity();
  const [pickup, setPickup] = useState<Place>({ address: city.name, lat: city.lat, lng: city.lng });
  const [dropoff, setDropoff] = useState<Place>({ address: '', lat: city.lat, lng: city.lng });
  const [pickupHouse, setPickupHouse] = useState('');
  const [dropoffHouse, setDropoffHouse] = useState('');

  // Місто (з Головної) задає старт точки «Звідки».
  useEffect(() => {
    setPickup({ address: city.name, lat: city.lat, lng: city.lng });
    setPickupHouse('');
  }, [city]);

  const [mode, setMode] = useState<Mode>('euro');
  const [pallets, setPallets] = useState(2);
  const [height, setHeight] = useState(200); // cm
  const [box, setBox] = useState({ l: 80, w: 60, h: 80, qty: 1 });
  const [weight, setWeight] = useState(500); // kg
  const [oversized, setOversized] = useState(false);
  const [price, setPrice] = useState(700); // грн — клієнт вводить сам
  const [when, setWhen] = useState<'now' | 'scheduled'>('now');
  const [scheduledAt, setScheduledAt] = useState<string | null>(null);

  const [showMap, setShowMap] = useState(false);
  const [mapTarget, setMapTarget] = useState<'pickup' | 'dropoff'>('pickup');

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
    const pickupAddr = withHouse(pickup, pickupHouse);
    const dropoffAddr = withHouse(dropoff, dropoffHouse);
    if (pickupAddr.trim().length < 3 || dropoffAddr.trim().length < 3) {
      setErr('Вкажіть адреси «звідки» та «куди»');
      return;
    }
    setBusy(true);
    try {
      await api.createOrder({
        pickupAddress: pickupAddr.trim(),
        pickupLat: pickup.lat,
        pickupLng: pickup.lng,
        dropoffAddress: dropoffAddr.trim(),
        dropoffLat: dropoff.lat,
        dropoffLng: dropoff.lng,
        cargoType: sizeLabel.slice(0, 120),
        weightKg: Math.max(1, Math.round(weight)),
        vehicleType: veh.v,
        description: `≈${volume.toFixed(1)} м³${oversized ? ' · негабарит' : ''}`,
        price: price > 0 ? price : undefined,
        scheduledAt: when === 'scheduled' && scheduledAt ? scheduledAt : undefined,
      });
      // Повертаємось зі стека на таби й одразу на вкладку «Замовлення».
      navigation.navigate('Tabs', { screen: 'Замовлення' });
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

  return (
    <Screen>
      {/* addresses — autocomplete (OSM), biased to the city chosen on Home */}
      <Card style={{ paddingVertical: 4 }}>
        <AddressField icon="dot" iconColor={T.green} label="Звідки" value={pickup.address} onSelect={setPickup} bias={{ lat: city.lat, lng: city.lng }} house={pickupHouse} onHouse={setPickupHouse} divider />
        <AddressField icon="pin" iconColor={T.accentDark} label="Куди" value={dropoff.address} onSelect={setDropoff} bias={{ lat: city.lat, lng: city.lng }} house={dropoffHouse} onHouse={setDropoffHouse} />
      </Card>

      {/* map picker */}
      <Pressable
        onPress={() => setShowMap((s) => !s)}
        style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 8, marginBottom: 6 }}
      >
        <Icon name="pin" size={17} color={T.accentDark} />
        <Text style={{ fontFamily: FONT.b, fontSize: 13.5, color: T.ink }}>
          {showMap ? 'Сховати карту' : 'Обрати точку на карті'}
        </Text>
      </Pressable>
      {showMap && (
        <>
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 10 }}>
            {(['pickup', 'dropoff'] as const).map((k) => {
              const on = mapTarget === k;
              return (
                <Pressable
                  key={k}
                  onPress={() => setMapTarget(k)}
                  style={{ flex: 1, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: on ? T.ink : '#fff', borderWidth: 1.5, borderColor: on ? T.ink : T.border }}
                >
                  <Text style={{ fontFamily: FONT.b, fontSize: 12.5, color: on ? '#fff' : T.txt }}>
                    {k === 'pickup' ? 'Звідки' : 'Куди'}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          <MapPicker
            value={mapTarget === 'pickup' ? pickup : dropoff}
            onPick={(p) => (mapTarget === 'pickup' ? setPickup(p) : setDropoff(p))}
          />
        </>
      )}

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

      {/* when */}
      <SectionTitle>Коли подати транспорт</SectionTitle>
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 10 }}>
        {(['now', 'scheduled'] as const).map((k) => {
          const on = when === k;
          return (
            <Pressable
              key={k}
              onPress={() => setWhen(k)}
              style={{ flex: 1, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: on ? T.ink : '#fff', borderWidth: 1.5, borderColor: on ? T.ink : T.border }}
            >
              <Text style={{ fontFamily: FONT.b, fontSize: 14, color: on ? '#fff' : T.txt }}>
                {k === 'now' ? 'Зараз' : 'Запланувати'}
              </Text>
            </Pressable>
          );
        })}
      </View>
      {when === 'scheduled' && <DateTimeField value={scheduledAt} onChange={setScheduledAt} />}

      {/* price — entered by client; AI suggestion is future */}
      <SectionTitle>Ціна</SectionTitle>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <View style={{ flex: 1 }}>
          <NumBox value={price} onChange={setPrice} suffix="₴" />
        </View>
        <Pressable
          onPress={() =>
            Alert.alert('AI-підбір ціни', 'Зʼявиться згодом — рахуватиме ціну за маршрутом, попитом і паливом.')
          }
          style={{
            height: 48,
            paddingHorizontal: 16,
            borderRadius: 12,
            borderWidth: 1.5,
            borderColor: T.border,
            backgroundColor: '#fff',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            opacity: 0.75,
          }}
        >
          <Icon name="spark" size={16} color={T.accentDark} />
          <Text style={{ fontFamily: FONT.b, fontSize: 13, color: T.txt2 }}>AI</Text>
        </Pressable>
      </View>
      <Text style={{ fontFamily: FONT.r, fontSize: 11.5, color: T.txt3, marginTop: 6, marginBottom: 8 }}>
        Вкажіть ціну в гривнях. AI-підбір зʼявиться згодом.
      </Text>

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
