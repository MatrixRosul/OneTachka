import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, Pressable, Platform, ActivityIndicator } from 'react-native';
import { T, FONT } from '../theme';
import { Icon, IconName } from './Icon';
import { shortAddress } from '../cities';

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

export interface Bias {
  lat: number;
  lng: number;
}

// Автодоповнення адрес через OpenStreetMap Nominatim.
// Місто передається як viewbox-bias (м'яка підказка): результати поблизу
// ранжуються вище, але адреси будь-де в Україні теж повертаються
// (без bounded=1, тобто це не фільтр). Місто НЕ дописується в текст запиту.
async function search(q: string, bias: Bias | undefined, signal: AbortSignal): Promise<Suggestion[]> {
  let url =
    'https://nominatim.openstreetmap.org/search?format=json&addressdetails=0&limit=8' +
    '&accept-language=uk&countrycodes=ua&q=' +
    encodeURIComponent(q);
  if (bias) {
    const d = 0.6; // ~60 км навколо міста — лише пріоритет ранжування
    url += `&viewbox=${bias.lng - d},${bias.lat - d},${bias.lng + d},${bias.lat + d}`;
  }
  const headers: Record<string, string> = {};
  // Браузер не дає виставляти User-Agent; на нативі — додаємо (вимога Nominatim).
  if (Platform.OS !== 'web') headers['User-Agent'] = 'OnetachkaApp/1.0 (mvp)';
  const res = await fetch(url, { headers, signal });
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
  bias,
  house,
  onHouse,
  divider,
}: {
  icon: IconName;
  iconColor: string;
  label: string;
  value: string;
  onSelect: (p: Place) => void;
  bias?: Bias;
  house?: string;
  onHouse?: (v: string) => void;
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
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      try {
        setItems(await search(text.trim(), bias, ctrl.signal));
      } catch {
        // aborted (новий ввід) або помилка — ігноруємо
      } finally {
        setLoading(false);
      }
    }, 400);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [text, focused, bias?.lat, bias?.lng]);

  function choose(s: Suggestion) {
    const addr = shortAddress(s.label, 2);
    picked.current = true;
    setText(addr);
    setItems([]);
    onSelect({ address: addr, lat: s.lat, lng: s.lng });
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
            placeholder="Вулиця, місто…"
            placeholderTextColor={T.txt3}
            style={{ fontFamily: FONT.b, fontSize: 14.5, color: T.ink, padding: 0, marginTop: 1 }}
          />
        </View>
        {loading && <ActivityIndicator size="small" color={T.txt3} />}
        {onHouse && (
          <View style={{ width: 62 }}>
            <Text style={{ fontFamily: FONT.sb, fontSize: 11, color: T.txt3 }}>Буд.</Text>
            <TextInput
              value={house ?? ''}
              onChangeText={onHouse}
              placeholder="№"
              placeholderTextColor={T.txt3}
              style={{ fontFamily: FONT.b, fontSize: 14.5, color: T.ink, padding: 0, marginTop: 1, borderBottomWidth: 1, borderBottomColor: T.border }}
            />
          </View>
        )}
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
                {shortAddress(s.label, 3)}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}
