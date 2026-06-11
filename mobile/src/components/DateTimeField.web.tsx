import React from 'react';
import { View } from 'react-native';
import { T } from '../theme';

const Input: any = 'input';

export function DateTimeField({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (v: string | null) => void;
}) {
  const local = value ? value.slice(0, 16) : '';
  return (
    <View
      style={{
        backgroundColor: '#fff',
        borderWidth: 1.5,
        borderColor: T.border,
        borderRadius: 14,
        paddingHorizontal: 14,
        height: 50,
        justifyContent: 'center',
        marginBottom: 8,
      }}
    >
      <Input
        type="datetime-local"
        value={local}
        onChange={(e: any) => onChange(e.target.value || null)}
        style={{
          border: 0,
          outline: 'none',
          background: 'transparent',
          fontSize: 15,
          fontFamily: 'Manrope, system-ui, sans-serif',
          color: T.ink,
          width: '100%',
        }}
      />
    </View>
  );
}
