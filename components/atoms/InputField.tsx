import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';

export type InputFieldProps = {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address';
  accessibilityLabel: string;
  rightIcon?: React.ReactNode;
};

export default function InputField({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  accessibilityLabel,
  rightIcon,
}: InputFieldProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.container, focused && styles.containerFocused]}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.text.caption}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        accessible
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="text"
        accessibilityState={{ selected: focused }}
      />
      {rightIcon != null && <View style={styles.iconSlot}>{rightIcon}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: Math.round(56),
    backgroundColor: Colors.surface.default,
    borderRadius: Math.round(12),
    paddingHorizontal: Math.round(16),
    paddingVertical: Math.round(8),
    flexDirection: 'row',
    alignItems: 'center',
    gap: Math.round(8),
    borderWidth: 1,
    borderColor: 'transparent',
  },
  containerFocused: {
    borderColor: Colors.secondary.border,
  },
  input: {
    flex: 1,
    ...Typography.english.body.l,
    color: Colors.text.title,
    padding: 0,
  },
  iconSlot: {
    width: Math.round(24),
    height: Math.round(24),
    alignItems: 'center',
    justifyContent: 'center',
  },
});
