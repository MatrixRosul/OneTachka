import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, Pressable, Platform, ActivityIndicator } from 'react-native';
import { T, FONT } from '../theme';
import { Icon, IconName } from './Icon';

export interface Place {
  address: string;
  lat: number;
  lng: number;
}

interface Suggestion {
  label: string;
  lat: number;
  lng: number;
}

// Автодоповнення адрес через OpenStreetMap Nominatim (без ключа, по Україні).
async function search(q: string): Promise<Suggestion[]> {
  const url =
    'https://nominatim.openstreetmap.org/search?format=json&addressdetails=0&limit=5' +
    '&accept-language=uk&countrycodes=ua&q=' +
    encodeURIComponent(q);
  const headers: Record<string, string> = {};
  // Браузер не дає виставляти User-Agent; на нативі — додаємо (вимога Nominatim).
  if (Platform.OS !== 'web') headers['User-Agent'] = 'OnetachkaApp/1.0 (mvp)';
  const res = await fetch(url, { headers });
  if (!res.ok) return [];
  const data = (await res.json()) as Array<{ display_name: string; lat: string; lon: string }>;
  return data.map((d) => ({ label: d.display_name, lat: Number(d.lat), lng: Number(d.lon) }));
}

export function AddressField({
  icon,
  iconColor,
  label,
  value,
  onSelect,
  divider,
}: {
  icon: IconName;
  iconColor: string;
  label: string;
  value: string;
  onSelect: (p: Place) => void;
  divider?: boolean;
}) {
  const [text, setText] = useState(value);
  const [items, setItems] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const picked = useRef(false);

  useEffect(() => {
    setText(value);
  }, [value]);

  useEffect(() => {
    if (picked.current) {
      picked.current = false;
      return;
    }
    if (!focused || text.trim().length < 3) {
      setItems([]);
      return;
    }
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        setItems(await search(text.trim()));
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    }, 500);
    return () => clearTimeout(t);
  }, [text, focused]);

  function choose(s: Suggestion) {
    picked.current = true;
    setText(s.label);
    setItems([]);
    onSelect({ address: s.label, lat: s.lat, lng: s.lng });
  }

  return (
    <View style={{ borderBottomWidth: divider ? 1 : 0, borderBottomColor: T.line }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 }}>
        <Icon name={icon} size={icon === 'dot' ? 14 : 16} color={iconColor} />
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: FONT.sb, fontSize: 11, color: T.txt3 }}>{label}</Text>
          <TextInput
            value={text}
            onChangeText={setText}
            onFocus={() => setFocused(true)}
            placeholder="Почніть вводити адресу…"
            placeholderTextColor={T.txt3}
            style={{ fontFamily: FONT.b, fontSize: 14.5, color: T.ink, padding: 0, marginTop: 1 }}
          />
        </View>
        {loading && <ActivityIndicator size="small" color={T.txt3} />}
      </View>

      {items.length > 0 && (
        <View style={{ paddingBottom: 8 }}>
          {items.map((s, i) => (
            <Pressable
              key={i}
              onPress={() => choose(s)}
              style={{ flexDirection: 'row', gap: 10, alignItems: 'center', paddingVertical: 9, paddingHorizontal: 6 }}
            >
              <Icon name="pin" size={15} color={T.txt3} />
              <Text style={{ flex: 1, fontFamily: FONT.m, fontSize: 13, color: T.txt2 }} numberOfLines={2}>
                {s.label}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}
