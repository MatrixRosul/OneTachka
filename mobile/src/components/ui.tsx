import React from 'react';
import {
  View,
  Text,
  Pressable,
  TextInput,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { T, FONT, STATUS_COLOR, STATUS_LABEL } from '../theme';
import { Icon, IconName, Truck } from './Icon';

export function Logo({ size = 20, color = T.ink }: { size?: number; color?: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
      <View
        style={{
          width: size + 8,
          height: size + 8,
          borderRadius: 8,
          backgroundColor: T.accent,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Truck size="m" color={T.ink} w={size} />
      </View>
      <Text style={{ fontFamily: FONT.xb, fontSize: size, color, letterSpacing: -0.5 }}>
        onetachka
      </Text>
    </View>
  );
}

export function PrimaryBtn({
  children,
  onPress,
  color = T.accent,
  txt = T.ink,
  icon,
  disabled,
  style,
}: {
  children: React.ReactNode;
  onPress?: () => void;
  color?: string;
  txt?: string;
  icon?: IconName;
  disabled?: boolean;
  style?: ViewStyle;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        {
          height: 54,
          borderRadius: T.radBtn,
          backgroundColor: color,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          gap: 8,
          opacity: disabled ? 0.5 : pressed ? 0.9 : 1,
        },
        style,
      ]}
    >
      <Text style={{ fontFamily: FONT.xb, fontSize: 16.5, color: txt, letterSpacing: -0.2 }}>
        {children}
      </Text>
      {icon && <Icon name={icon} size={20} color={txt} />}
    </Pressable>
  );
}

export function Card({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <Text style={{ fontFamily: FONT.b, fontSize: 14, color: T.txt, marginBottom: 9, marginTop: 4 }}>
      {children}
    </Text>
  );
}

export function Field({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  secureTextEntry,
  suffix,
}: {
  label?: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'numeric' | 'phone-pad' | 'decimal-pad';
  secureTextEntry?: boolean;
  suffix?: string;
}) {
  return (
    <View style={{ marginBottom: 12 }}>
      {label && (
        <Text style={{ fontFamily: FONT.sb, fontSize: 11.5, color: T.txt3, marginBottom: 5 }}>
          {label}
        </Text>
      )}
      <View style={styles.fieldBox}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={T.txt3}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          autoCapitalize="none"
          style={{ flex: 1, fontFamily: FONT.b, fontSize: 15.5, color: T.ink, padding: 0 }}
        />
        {suffix && (
          <Text style={{ fontFamily: FONT.b, fontSize: 13, color: T.txt3 }}>{suffix}</Text>
        )}
      </View>
    </View>
  );
}

export function Avatar({ initials = 'А', size = 40, ring }: { initials?: string; size?: number; ring?: boolean }) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: T.ink2,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: ring ? 2 : 0,
        borderColor: T.accent,
      }}
    >
      <Text style={{ fontFamily: FONT.b, fontSize: size * 0.4, color: '#fff' }}>{initials}</Text>
    </View>
  );
}

export function StatusPill({ status }: { status: string }) {
  const bg = STATUS_COLOR[status] ?? T.txt3;
  return (
    <View style={{ backgroundColor: bg, borderRadius: 999, paddingHorizontal: 9, paddingVertical: 3 }}>
      <Text style={{ fontFamily: FONT.b, fontSize: 11.5, color: '#fff' }}>
        {STATUS_LABEL[status] ?? status}
      </Text>
    </View>
  );
}

export function Stars({ value, size = 14 }: { value: number; size?: number }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
      <Icon name="star" size={size} color={T.accentDark} />
      <Text style={{ fontFamily: FONT.b, fontSize: size, color: T.txt }}>{value.toFixed(1)}</Text>
    </View>
  );
}

export function StarPicker({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <View style={{ flexDirection: 'row', gap: 6 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Pressable key={n} onPress={() => onChange(n)} hitSlop={4}>
          <Icon name="star" size={30} color={n <= value ? T.accent : '#E2E1DB'} />
        </Pressable>
      ))}
    </View>
  );
}

export function Segmented({
  tabs,
  value,
  onChange,
}: {
  tabs: [string, string][];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <View style={{ flexDirection: 'row', gap: 4, backgroundColor: '#EDECE6', borderRadius: 14, padding: 4, marginBottom: 16 }}>
      {tabs.map(([k, l]) => {
        const on = value === k;
        return (
          <Pressable
            key={k}
            onPress={() => onChange(k)}
            style={{
              flex: 1,
              height: 38,
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: on ? '#fff' : 'transparent',
            }}
          >
            <Text style={{ fontFamily: FONT.b, fontSize: 13.5, color: on ? T.ink : T.txt2 }}>{l}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function Toggle({ on, onPress }: { on: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        width: 46,
        height: 27,
        borderRadius: 999,
        backgroundColor: on ? T.green : '#E2E1DB',
        padding: 3,
        justifyContent: 'center',
      }}
    >
      <View
        style={{
          width: 21,
          height: 21,
          borderRadius: 11,
          backgroundColor: '#fff',
          alignSelf: on ? 'flex-end' : 'flex-start',
        }}
      />
    </Pressable>
  );
}

export function Stepper({
  value,
  onChange,
  min = 1,
  max = 99,
  step = 1,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
}) {
  const btn = (label: string, fn: () => void, dis: boolean) => (
    <Pressable
      onPress={dis ? undefined : fn}
      style={{
        width: 34,
        height: 34,
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: T.border,
        backgroundColor: dis ? T.bg : '#fff',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ fontFamily: FONT.b, fontSize: 20, color: dis ? T.txt3 : T.ink, lineHeight: 22 }}>
        {label}
      </Text>
    </Pressable>
  );
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
      {btn('−', () => onChange(Math.max(min, value - step)), value <= min)}
      <Text style={{ minWidth: 36, textAlign: 'center', fontFamily: FONT.xb, fontSize: 16, color: T.ink }}>
        {value}
      </Text>
      {btn('+', () => onChange(Math.min(max, value + step)), value >= max)}
    </View>
  );
}

export function ErrorText({ children }: { children?: string }) {
  if (!children) return null;
  return (
    <Text style={{ fontFamily: FONT.m, fontSize: 13, color: T.red, marginVertical: 6 }}>
      {children}
    </Text>
  );
}

export function ScreenHeader({ title, right }: { title: string; right?: React.ReactNode }) {
  return (
    <View style={styles.header}>
      <Text style={{ fontFamily: FONT.xb, fontSize: 24, color: T.ink, letterSpacing: -0.6, flex: 1 }}>
        {title}
      </Text>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: T.surface,
    borderRadius: T.radCard,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: T.border,
  } as ViewStyle,
  fieldBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: T.surface,
    borderWidth: 1.5,
    borderColor: T.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 50,
    gap: 8,
  } as ViewStyle,
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 12,
  } as ViewStyle,
});

export const text: Record<string, TextStyle> = {};
