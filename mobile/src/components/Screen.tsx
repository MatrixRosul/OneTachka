import React from 'react';
import { ScrollView, RefreshControl, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { T } from '../theme';

export function Screen({
  children,
  onRefresh,
  refreshing,
  scroll = true,
}: {
  children: React.ReactNode;
  onRefresh?: () => void;
  refreshing?: boolean;
  scroll?: boolean;
}) {
  const inner = scroll ? (
    <ScrollView
      contentContainerStyle={{ padding: 18, paddingBottom: 32 }}
      keyboardShouldPersistTaps="handled"
      refreshControl={
        onRefresh ? (
          <RefreshControl refreshing={!!refreshing} onRefresh={onRefresh} tintColor={T.ink} />
        ) : undefined
      }
    >
      {children}
    </ScrollView>
  ) : (
    <View style={{ flex: 1, padding: 18 }}>{children}</View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.bg }} edges={['top']}>
      {inner}
    </SafeAreaView>
  );
}
