import React, { useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { T, FONT } from '../../theme';
import { Screen } from '../../components/Screen';
import { Avatar, Card, PrimaryBtn, Field, Stars, SectionTitle, ScreenHeader, ErrorText } from '../../components/ui';
import { VehiclePicker } from '../../components/VehiclePicker';
import { useAuth } from '../../AuthContext';
import { api, errText } from '../../api';
import type { VehicleType } from '../../types';

export function DriverProfileScreen() {
  const { me, refresh, logout } = useAuth();
  const prof = me?.driverProfile ?? null;
  const [vehicleType, setVehicleType] = useState<VehicleType>(prof?.vehicleType ?? 'VAN');
  const [capacity, setCapacity] = useState(String(prof?.capacityKg ?? 1000));
  const [plate, setPlate] = useState(prof?.licensePlate ?? '');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!me) return null;

  async function save() {
    setErr('');
    setBusy(true);
    setSaved(false);
    try {
      await api.putProfile({
        vehicleType,
        capacityKg: Number(capacity) || 0,
        licensePlate: plate,
      });
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
      <Card style={{ alignItems: 'center', paddingVertical: 20 }}>
        <Avatar initials={(me.fullName ?? 'В')[0]} size={60} ring />
        <Text style={{ fontFamily: FONT.xb, fontSize: 18, color: T.ink, marginTop: 10 }}>{me.fullName}</Text>
        <Text style={{ fontFamily: FONT.m, fontSize: 13, color: T.txt2, marginTop: 2 }}>Водій · {me.phone}</Text>
        <View style={{ marginTop: 8 }}>
          <Stars value={me.ratingAvg} size={14} />
        </View>
      </Card>

      <SectionTitle>Профіль авто</SectionTitle>
      <View style={{ marginBottom: 12 }}>
        <VehiclePicker value={vehicleType} onChange={setVehicleType} />
      </View>
      <Card>
        <Field label="Вантажопідйомність" value={capacity} onChangeText={setCapacity} keyboardType="numeric" suffix="кг" />
        <Field label="Номер авто" value={plate} onChangeText={setPlate} placeholder="AA1234BB" />
      </Card>

      <ErrorText>{err}</ErrorText>
      {saved && (
        <Text style={{ fontFamily: FONT.sb, fontSize: 13, color: T.green, marginBottom: 8 }}>
          Профіль збережено
        </Text>
      )}

      <PrimaryBtn onPress={save} disabled={busy}>Зберегти профіль</PrimaryBtn>

      <View style={{ marginTop: 12 }}>
        <PrimaryBtn color={T.surface} txt={T.red} onPress={logout} style={{ borderWidth: 1.5, borderColor: T.border }}>
          Вийти
        </PrimaryBtn>
      </View>
    </Screen>
  );
}
