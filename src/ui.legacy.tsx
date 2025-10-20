// src/ui.tsx
import React, { forwardRef } from 'react'
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Pressable,
  ViewStyle,
  TextStyle,
  TextInput,
} from 'react-native'
import { useRouter } from 'expo-router'
import { StyleSheet, type TextInputProps } from 'react-native';

// Use the actual element type of Pressable for refs:
type PressableRef = React.ElementRef<typeof Pressable>

type BtnProps = {
  title: string
  onPress: () => void
  variant?: 'primary' | 'secondary' | 'danger'
  style?: ViewStyle | ViewStyle[]
  textStyle?: TextStyle
  disabled?: boolean
}

export type CardProps = {
  title?: string
  subtitle?: string
  children?: React.ReactNode
  style?: ViewStyle | ViewStyle[]
  onPress?: () => void
}

export const Card = forwardRef<PressableRef, CardProps>(function Card(
  { title, subtitle, children, style, onPress },
  ref
) {
  return (
    <Pressable
      ref={ref}
      onPress={onPress}
      disabled={!onPress}
      style={[
        {
          backgroundColor: '#fff',
          borderRadius: 12,
          padding: 12,
          borderWidth: 1,
          borderColor: '#e5e5e5',
          marginBottom: 12,
        },
        style,
      ]}
    >
      {title ? <Text style={{ fontWeight: '700', marginBottom: 4 }}>{title}</Text> : null}
      {subtitle ? <Text style={{ color: '#555', marginBottom: 8 }}>{subtitle}</Text> : null}
      {children}
    </Pressable>
  )
})
Card.displayName = 'Card'


/** ---------- Button (Btn) ---------- */
export const Btn = forwardRef<PressableRef, BtnProps>(function Btn(
  { title, onPress, variant = 'primary', style, textStyle, disabled = false },
  ref
) {
  const bg = variant === 'primary' ? '#4A90E2' : '#eee'
  const fg = variant === 'primary' ? '#fff' : '#111'
  const base: ViewStyle = {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: bg,
    opacity: disabled ? 0.5 : 1,
  }
  return (
    <Pressable ref={ref} onPress={disabled ? undefined : onPress} style={[base, style]}>
      <Text style={[{ color: fg, fontWeight: '600', textAlign: 'center' }, textStyle]}>
        {title}
      </Text>
    </Pressable>
  )
})

/** ---------- Field ---------- */

export type FieldProps = TextInputProps & {
  label?: string;
  trailing?: React.ReactNode;
  // keep value/onChangeText required (TextInputProps makes them optional)
  value: string;
  onChangeText: (text: string) => void;
};

export function Field({
  label,
  trailing,
  style,
  ...inputProps          // <-- collect all TextInputProps (autoCapitalize, keyboardType, etc.)
}: FieldProps) {
  return (
    <View style={styles.wrap}>
      {!!label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.box}>
        <TextInput
          {...inputProps}             // <-- forward everything to TextInput
          style={[styles.input, style as any]}
        />
        {trailing ? <View style={styles.trailing}>{trailing}</View> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 12 },
  label: { marginBottom: 6, fontWeight: '600' },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1, borderColor: '#ddd', borderRadius: 8,
    paddingHorizontal: 10, backgroundColor: '#fff'
  },
  input: { flex: 1, paddingVertical: 8 },
  trailing: { marginLeft: 8 }
});

// convenience: Field.Button used across onboarding
Field.Button = function FieldButton({
  title,
  onPress,
  disabled,
}: {
  title: string
  onPress: () => void
  disabled?: boolean
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={{
        opacity: disabled ? 0.5 : 1,
        backgroundColor: '#111',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 14,
        alignSelf: 'flex-start',
      }}
    >
      <Text style={{ color: '#fff', fontWeight: '700' }}>{title}</Text>
    </Pressable>
  )
}

/** ---------- Pill ---------- */
export function Pill({
  label,
  state,
  onPress,
  children,
}: {
  label?: string
  state?: 'open' | 'booked' | 'closed'
  onPress?: () => void
  children?: React.ReactNode
}) {
  const bg =
    state === 'booked' ? '#ffe9a6' : state === 'closed' ? '#ffd3d3' : '#eee'
  const content = label ?? children
  const Wrapper: any = onPress ? Pressable : View
  return (
    <Wrapper
      onPress={onPress}
      style={{
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
        backgroundColor: bg,
        marginRight: 8,
        marginBottom: 8,
      }}
    >
      <Text style={{ fontWeight: '600' }}>{content}</Text>
    </Wrapper>
  )
}

/** ---------- Tile ---------- */
export type TileProps = {
  title?: string
  label?: string
  subtitle?: string
  caption?: string
  selected?: boolean
  icon?: string
  onPress?: () => void
}

export const Tile = forwardRef<PressableRef, TileProps>(function Tile(
  { title, label, subtitle, caption, selected, onPress },
  ref
) {
  const main = title ?? label
  return (
    <Pressable
      ref={ref}
      onPress={onPress}
      disabled={!onPress}
      style={{
        borderWidth: selected ? 2 : 1,
        borderColor: selected ? '#4A90E2' : '#ddd',
        borderRadius: 12,
        padding: 12,
        backgroundColor: '#fff',
        marginBottom: 10,
      }}
    >
      {!!main && <Text style={{ fontWeight: '700' }}>{main}</Text>}
      {!!subtitle && <Text>{subtitle}</Text>}
      {!!caption && <Text style={{ color: '#666', fontSize: 12 }}>{caption}</Text>}
    </Pressable>
  )
})
Tile.displayName = 'Tile'


/** ---------- Page (kept for compatibility) ---------- */
export function Page({
  title,
  children,
}: {
  title?: string
  children: React.ReactNode
}) {
  return <Screen title={title}>{children}</Screen>
}

type ScreenProps = {
  title?: string
  subtitle?: string
  onBack?: () => void
  right?: React.ReactNode      // e.g., “Switch Role”
  footer?: React.ReactNode     // sticky footer actions (e.g., Save)
  children: React.ReactNode
}

export function Screen({
  title,
  subtitle,
  onBack,
  right,
  footer,
  children,
}: ScreenProps) {
  const router = useRouter()

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Header */}
      <View
        style={{
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: '#eee',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          {onBack && (
            <Pressable
              onPress={onBack ?? (() => router.back())}
              style={{ padding: 6 }}
            >
              <Text style={{ fontSize: 18 }}>←</Text>
            </Pressable>
          )}
          <View>
            {!!title && (
              <Text style={{ fontSize: 18, fontWeight: '700' }}>{title}</Text>
            )}
            {!!subtitle && (
              <Text style={{ color: '#666', marginTop: 2 }}>{subtitle}</Text>
            )}
          </View>
        </View>
        <View>{right}</View>
      </View>

      {/* Content + keyboard handling + scrolling */}
      <KeyboardAvoidingView
        style={{ flex: 1, minHeight: 0 }} // minHeight:0 fixes web flex scroll
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            padding: 16,
            paddingBottom: footer ? 96 : 24, // leave room for sticky footer
            gap: 12,
          }}
          style={{ flex: 1 }}
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Sticky footer */}
      {footer && (
        <SafeAreaView
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            borderTopWidth: 1,
            borderTopColor: '#eee',
            backgroundColor: '#fff',
            paddingHorizontal: 16,
            paddingTop: 8,
            paddingBottom: 12,
          }}
        >
          {footer}
        </SafeAreaView>
      )}
    </SafeAreaView>
  )
}