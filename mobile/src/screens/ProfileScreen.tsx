import React from 'react';
import { View, Text } from 'react-native';
import { T, FONT, VEHICLE_LABEL } from '../theme';
import { Screen } from '../components/Screen';
import { Avatar, Card, PrimaryBtn, Stars, ScreenHeader } from '../components/ui';
import { Icon } from '../components/Icon';
import { useAuth } from '../AuthContext';

function Row({ icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 }}>
      <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: T.bg, alignItems: 'center', justifyContent: 'center' }}>
        <Icon name={icon} size={18} color={T.ink} />
      </View>
      <Text style={{ fontFamily: FONT.m, fontSize: 13.5, color: T.txt2, flex: 1 }}>{label}</Text>
      <Text style={{ fontFamily: FONT.b, fontSize: 14, color: T.ink }}>{value}</Text>
    </View>
  );
}

export function ProfileScreen() {
  const { me, logout } = useAuth();
  if (!me) return null;
  const prof = me.driverProfile;

  return (
    <Screen>
      <ScreenHeader title="Профіль" />
      <Card style={{ alignItems: 'center', paddingVertical: 22 }}>
        <Avatar initials={(me.fullName ?? 'U')[0]} size={64} ring />
        <Text style={{ fontFamily: FONT.xb, fontSize: 19, color: T.ink, marginTop: 12 }}>{me.fullName}</Text>
        <Text style={{ fontFamily: FONT.m, fontSize: 13, color: T.txt2, marginTop: 2 }}>
          {me.role === 'CLIENT' ? 'Клієнт' : 'Водій'} · {me.phone}
        </Text>
        <View style={{ marginTop: 10 }}>
          <Stars value={me.ratingAvg} size={15} />
        </View>
        <Text style={{ fontFamily: FONT.m, fontSize: 12, color: T.txt3, marginTop: 2 }}>
          {me.ratingCount} відгуків
        </Text>
      </Card>

      <Card style={{ paddingVertical: 4 }}>
        <Row icon="user" label="Роль" value={me.role === 'CLIENT' ? 'Клієнт' : 'Водій'} />
        <Row icon="bell" label="Телефон" value={me.phone} />
        {prof && (
          <>
            <Row icon="box" label="Авто" value={VEHICLE_LABEL[prof.vehicleType]} />
            <Row icon="box" label="Вантажопідйомність" value={`${prof.capacityKg} кг`} />
            <Row icon="shield" label="Номер" value={prof.licensePlate} />
          </>
        )}
      </Card>

      <PrimaryBtn color={T.surface} txt={T.red} onPress={logout} style={{ borderWidth: 1.5, borderColor: T.border }}>
        Вийти
      </PrimaryBtn>
    </Screen>
  );
}
