import React from 'react';
import { View, Text } from 'react-native';
import { T, FONT } from '../theme';
import { Screen } from '../components/Screen';
import { Icon } from '../components/Icon';

// Заглушка для розділів дизайну, що ще не реалізовані.
export function StubScreen({ route }: { route: any }) {
  const title: string = route?.params?.title ?? 'Розділ';
  return (
    <Screen scroll={false}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 60 }}>
        <View style={{ width: 88, height: 88, borderRadius: 26, backgroundColor: 'rgba(242,200,75,0.18)', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
          <Icon name="spark" size={40} color={T.accentDark} />
        </View>
        <Text style={{ fontFamily: FONT.xb, fontSize: 19, color: T.ink }}>{title}</Text>
        <Text style={{ fontFamily: FONT.m, fontSize: 14, color: T.txt2, marginTop: 8, textAlign: 'center', maxWidth: 260, lineHeight: 20 }}>
          Ця сторінка ще в розробці. Скоро зʼявиться 🚧
        </Text>
      </View>
    </Screen>
  );
}
