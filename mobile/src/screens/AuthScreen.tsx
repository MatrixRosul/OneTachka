import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { T, FONT } from '../theme';
import { PrimaryBtn, Field, ErrorText } from '../components/ui';
import { Icon, Truck } from '../components/Icon';
import { useAuth } from '../AuthContext';
import { errText } from '../api';
import type { Role } from '../types';

export function AuthScreen() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'register' | 'login'>('register');
  const [role, setRole] = useState<Role>('CLIENT');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit() {
    setErr('');
    setBusy(true);
    try {
      if (mode === 'register') await register({ role, fullName, phone, password });
      else await login(phone, password);
    } catch (ex) {
      setErr(errText(ex));
    } finally {
      setBusy(false);
    }
  }

  const roleSeg = (r: Role, label: string, icon: 'user' | 'box') => {
    const on = role === r;
    return (
      <Pressable
        onPress={() => setRole(r)}
        style={{
          flex: 1,
          height: 56,
          borderRadius: 14,
          alignItems: 'center',
          justifyContent: 'center',
          gap: 3,
          backgroundColor: on ? T.ink : T.surface,
          borderWidth: 1.5,
          borderColor: on ? T.ink : T.border,
        }}
      >
        <Icon name={icon} size={20} color={on ? '#fff' : T.ink} />
        <Text style={{ fontFamily: FONT.b, fontSize: 13.5, color: on ? '#fff' : T.txt }}>{label}</Text>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.bg }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={{ padding: 22, paddingTop: 40, flexGrow: 1 }}>
          {/* brand hero */}
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              backgroundColor: T.accent,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 20,
            }}
          >
            <Truck size="m" color={T.ink} w={38} />
          </View>

          <Text style={{ fontFamily: FONT.xb, fontSize: 28, color: T.ink, letterSpacing: -0.8 }}>
            {mode === 'register' ? 'Створити акаунт' : 'Вхід у Onetachka'}
          </Text>
          <Text style={{ fontFamily: FONT.m, fontSize: 14.5, color: T.txt2, marginTop: 6, marginBottom: 22 }}>
            {mode === 'register'
              ? 'Приєднуйтесь до Onetachka за хвилину.'
              : 'Введіть телефон і пароль для входу.'}
          </Text>

          {mode === 'register' && (
            <>
              <Text style={{ fontFamily: FONT.b, fontSize: 12, color: T.txt3, marginBottom: 6 }}>
                Я хочу
              </Text>
              <View style={{ flexDirection: 'row', gap: 10, marginBottom: 18 }}>
                {roleSeg('CLIENT', 'Замовляти', 'user')}
                {roleSeg('DRIVER', 'Возити вантаж', 'box')}
              </View>
              <Field label="Ім'я та прізвище" value={fullName} onChangeText={setFullName} placeholder="Андрій Коваль" />
            </>
          )}

          <Field
            label="Номер телефону"
            value={phone}
            onChangeText={setPhone}
            placeholder="+380 67 123 45 67"
            keyboardType="phone-pad"
          />
          <Field
            label="Пароль"
            value={password}
            onChangeText={setPassword}
            placeholder={mode === 'register' ? 'мінімум 8 символів' : '••••••••'}
            secureTextEntry
          />

          <ErrorText>{err}</ErrorText>

          <View style={{ marginTop: 8 }}>
            <PrimaryBtn onPress={submit} disabled={busy} icon="arrow">
              {mode === 'register' ? 'Зареєструватися' : 'Увійти'}
            </PrimaryBtn>
          </View>

          <View style={{ flex: 1 }} />

          <Pressable
            onPress={() => {
              setErr('');
              setMode(mode === 'register' ? 'login' : 'register');
            }}
            style={{ alignItems: 'center', marginTop: 24 }}
          >
            <Text style={{ fontFamily: FONT.m, fontSize: 14, color: T.txt2 }}>
              {mode === 'register' ? 'Вже маєте акаунт? ' : 'Немає акаунту? '}
              <Text style={{ fontFamily: FONT.xb, color: T.ink }}>
                {mode === 'register' ? 'Увійти' : 'Зареєструватися'}
              </Text>
            </Text>
          </Pressable>

          <Text style={{ fontFamily: FONT.r, fontSize: 11.5, color: T.txt3, textAlign: 'center', marginTop: 16, lineHeight: 16 }}>
            Продовжуючи, ви приймаєте Умови користування{'\n'}та Політику конфіденційності
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
