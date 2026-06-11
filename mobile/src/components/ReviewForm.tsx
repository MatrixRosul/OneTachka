import React, { useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import { T, FONT } from '../theme';
import { PrimaryBtn, StarPicker } from './ui';
import { ApiError, api, errText } from '../api';

export function ReviewForm({ orderId }: { orderId: string }) {
  const [score, setScore] = useState(5);
  const [comment, setComment] = useState('');
  const [msg, setMsg] = useState('');
  const [done, setDone] = useState(false);

  async function submit() {
    setMsg('');
    try {
      await api.review(orderId, { score, comment: comment || undefined });
      setDone(true);
      setMsg('Дякуємо за відгук!');
    } catch (ex) {
      setMsg(errText(ex));
      if (ex instanceof ApiError && ex.code === 'already_reviewed') setDone(true);
    }
  }

  if (done) {
    return (
      <Text style={{ fontFamily: FONT.sb, fontSize: 13, color: T.green }}>
        {msg || 'Відгук залишено'}
      </Text>
    );
  }

  return (
    <View style={{ gap: 10 }}>
      <Text style={{ fontFamily: FONT.b, fontSize: 13.5, color: T.txt }}>Оцініть перевезення</Text>
      <StarPicker value={score} onChange={setScore} />
      <View
        style={{
          backgroundColor: '#fff',
          borderWidth: 1.5,
          borderColor: T.border,
          borderRadius: 14,
          paddingHorizontal: 14,
          height: 46,
          justifyContent: 'center',
        }}
      >
        <TextInput
          value={comment}
          onChangeText={setComment}
          placeholder="Коментар (необов'язково)"
          placeholderTextColor={T.txt3}
          style={{ fontFamily: FONT.m, fontSize: 14.5, color: T.ink, padding: 0 }}
        />
      </View>
      <PrimaryBtn onPress={submit}>Оцінити</PrimaryBtn>
      {msg ? (
        <Text style={{ fontFamily: FONT.m, fontSize: 12.5, color: T.red }}>{msg}</Text>
      ) : null}
    </View>
  );
}
