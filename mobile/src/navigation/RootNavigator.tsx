import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { T, FONT } from '../theme';
import { Icon, IconName } from '../components/Icon';
import { useAuth } from '../AuthContext';
import { AuthScreen } from '../screens/AuthScreen';
import { HomeScreen } from '../screens/client/HomeScreen';
import { CreateOrderScreen } from '../screens/client/CreateOrderScreen';
import { ClientOrdersScreen } from '../screens/client/OrdersScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { DashboardScreen } from '../screens/driver/DashboardScreen';
import { AvailableScreen } from '../screens/driver/AvailableScreen';
import { DriverOrdersScreen } from '../screens/driver/DriverOrdersScreen';
import { DriverProfileScreen } from '../screens/driver/DriverProfileScreen';

const Tab = createBottomTabNavigator();

const ICONS: Record<string, IconName> = {
  Головна: 'home',
  Створити: 'plus',
  Доступні: 'search',
  Замовлення: 'box',
  Профіль: 'user',
};

function tabScreenOptions({ route }: { route: { name: string } }) {
  return {
    headerShown: false,
    tabBarActiveTintColor: T.ink,
    tabBarInactiveTintColor: T.txt3,
    tabBarStyle: { backgroundColor: '#fff', borderTopColor: T.line, height: 64, paddingTop: 6, paddingBottom: 10 },
    tabBarLabelStyle: { fontFamily: FONT.sb, fontSize: 10.5 },
    tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
      <Icon name={ICONS[route.name] ?? 'home'} size={23} color={color} stroke={focused ? 2.4 : 2} />
    ),
  };
}

function ClientTabs() {
  return (
    <Tab.Navigator screenOptions={tabScreenOptions}>
      <Tab.Screen name="Головна" component={HomeScreen} />
      <Tab.Screen name="Створити" component={CreateOrderScreen} />
      <Tab.Screen name="Замовлення" component={ClientOrdersScreen} />
      <Tab.Screen name="Профіль" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function DriverTabs() {
  return (
    <Tab.Navigator screenOptions={tabScreenOptions}>
      <Tab.Screen name="Головна" component={DashboardScreen} />
      <Tab.Screen name="Доступні" component={AvailableScreen} />
      <Tab.Screen name="Замовлення" component={DriverOrdersScreen} />
      <Tab.Screen name="Профіль" component={DriverProfileScreen} />
    </Tab.Navigator>
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
      {!me ? <AuthScreen /> : me.role === 'CLIENT' ? <ClientTabs /> : <DriverTabs />}
    </NavigationContainer>
  );
}
