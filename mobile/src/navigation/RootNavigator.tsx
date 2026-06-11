import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { T, FONT } from '../theme';
import { Icon, IconName } from '../components/Icon';
import { useAuth } from '../AuthContext';
import { AuthScreen } from '../screens/AuthScreen';
import { ChatScreen } from '../screens/ChatScreen';
import { StubScreen } from '../screens/StubScreen';
import { HomeScreen } from '../screens/client/HomeScreen';
import { CreateOrderScreen } from '../screens/client/CreateOrderScreen';
import { ClientOrdersScreen } from '../screens/client/OrdersScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { DashboardScreen } from '../screens/driver/DashboardScreen';
import { AvailableScreen } from '../screens/driver/AvailableScreen';
import { EarningsScreen } from '../screens/driver/EarningsScreen';
import { DriverOrdersScreen } from '../screens/driver/DriverOrdersScreen';
import { DriverProfileScreen } from '../screens/driver/DriverProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const ICONS: Record<string, IconName> = {
  Головна: 'home',
  Замовлення: 'box',
  Чат: 'chat',
  Профіль: 'user',
};

function useTabScreenOptions() {
  const insets = useSafeAreaInsets();
  const bottom = Math.max(insets.bottom, 8);
  return ({ route }: { route: { name: string } }) => ({
    headerShown: false,
    tabBarActiveTintColor: T.ink,
    tabBarInactiveTintColor: T.txt3,
    tabBarStyle: {
      backgroundColor: '#fff',
      borderTopColor: T.line,
      height: 58 + bottom,
      paddingTop: 8,
      paddingBottom: bottom,
    },
    tabBarLabelStyle: { fontFamily: FONT.sb, fontSize: 10.5, marginTop: 2 },
    tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
      <Icon name={ICONS[route.name] ?? 'home'} size={23} color={color} stroke={focused ? 2.4 : 2} />
    ),
  });
}

function ClientTabs() {
  const tabScreenOptions = useTabScreenOptions();
  return (
    <Tab.Navigator screenOptions={tabScreenOptions}>
      <Tab.Screen name="Головна" component={HomeScreen} />
      <Tab.Screen name="Замовлення" component={ClientOrdersScreen} />
      <Tab.Screen name="Чат" component={ChatScreen} />
      <Tab.Screen name="Профіль" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function DriverTabs() {
  const tabScreenOptions = useTabScreenOptions();
  return (
    <Tab.Navigator screenOptions={tabScreenOptions}>
      <Tab.Screen name="Головна" component={DashboardScreen} />
      <Tab.Screen name="Замовлення" component={DriverOrdersScreen} />
      <Tab.Screen name="Чат" component={ChatScreen} />
      <Tab.Screen name="Профіль" component={DriverProfileScreen} />
    </Tab.Navigator>
  );
}

const stackScreenOptions = {
  headerStyle: { backgroundColor: T.bg },
  headerShadowVisible: false,
  headerTintColor: T.ink,
  headerTitleStyle: { fontFamily: FONT.xb, color: T.ink },
  headerBackTitle: 'Назад',
};

function ClientRoot() {
  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      <Stack.Screen name="Tabs" component={ClientTabs} options={{ headerShown: false }} />
      <Stack.Screen name="Створити" component={CreateOrderScreen} options={{ title: 'Нова заявка' }} />
      <Stack.Screen name="Розділ" component={StubScreen} options={({ route }: any) => ({ title: route.params?.title ?? 'Розділ' })} />
    </Stack.Navigator>
  );
}

function DriverRoot() {
  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      <Stack.Screen name="Tabs" component={DriverTabs} options={{ headerShown: false }} />
      <Stack.Screen name="Доступні" component={AvailableScreen} options={{ title: 'Доступні заявки' }} />
      <Stack.Screen name="Заробіток" component={EarningsScreen} options={{ title: 'Заробіток' }} />
      <Stack.Screen name="Розділ" component={StubScreen} options={({ route }: any) => ({ title: route.params?.title ?? 'Розділ' })} />
    </Stack.Navigator>
  );
}

export function RootNavigator() {
  const { me, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: T.bg, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={T.ink} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {!me ? <AuthScreen /> : me.role === 'CLIENT' ? <ClientRoot /> : <DriverRoot />}
    </NavigationContainer>
  );
}
