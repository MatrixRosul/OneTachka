import React from 'react';
import { View, Text } from 'react-native';
import { T, FONT } from '../theme';
import { Screen } from '../components/Screen';
import { ScreenHeader } from '../components/ui';
import { Icon } from '../components/Icon';

// Заглушка: екран чату з дизайну. Функціонал (повідомлення) — фаза 2+.
export function ChatScreen() {
  return (
    <Screen scroll={false}>
      <ScreenHeader title="Чат" />
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 60 }}>
        <View
          style={{
            width: 96,
            height: 96,
            borderRadius: 28,
            backgroundColor: 'rgba(242,200,75,0.18)',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 22,
          }}
        >
          <Icon name="chat" size={44} color={T.accentDark} />
        </View>
        <Text style={{ fontFamily: FONT.xb, fontSize: 20, color: T.ink, letterSpacing: -0.4 }}>
          Чат скоро зʼявиться
        </Text>
        <Text
          style={{
            fontFamily: FONT.m,
            fontSize: 14,
            color: T.txt2,
            textAlign: 'center',
            marginTop: 8,
            maxWidth: 280,
            lineHeight: 20,
          }}
        >
          Тут буде безпечне спілкування між клієнтом і водієм — без сторонніх месенджерів.
        </Text>
      </View>
    </Screen>
  );
}
