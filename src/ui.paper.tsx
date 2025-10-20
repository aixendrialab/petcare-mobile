// src/ui.paper.tsx
import * as React from 'react';
import {
  View,
  Text,
  ViewStyle,
  TextStyle,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
  Pressable,
} from 'react-native';
import {
  Provider as PaperProvider,
  Appbar,
  Card as PaperCard,
  Button as PaperButton,
  TextInput as PaperInput,
  Chip,
  Switch as PaperSwitch,
  MD3LightTheme,
  MD3DarkTheme,
  configureFonts,
} from 'react-native-paper';
export { Link, Redirect } from 'expo-router'; // <-- Re-export for convenience

// ===== THEME =====
const fonts = configureFonts({ config: {} });
const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#2563eb',
    secondary: '#10b981',
    background: '#f7f7f8',
    surface: '#ffffff',
  },
  fonts,
};
const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#60a5fa',
    secondary: '#34d399',
  },
  fonts,
};

// ===== Provider (use once at app root) =====
export function UIProvider({ children }: { children: React.ReactNode }) {
  const theme = lightTheme;
  return <PaperProvider theme={theme}>{children}</PaperProvider>;
}

/** ---------- Card ---------- */
export type CardProps = {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  onPress?: () => void;
};
export const Card = React.forwardRef<View, CardProps>(function Card(
  { title, subtitle, children, style, onPress },
  ref
) {
  const Body = (
    <>
      {(title || subtitle) ? (
        <PaperCard.Title title={title} subtitle={subtitle} />
      ) : null}
      <PaperCard.Content>{children}</PaperCard.Content>
    </>
  );

  if (onPress) {
    return (
      <PaperCard onPress={onPress} style={[{ marginVertical: 8, borderRadius: 12 }, style as any]} ref={ref as any}>
        {Body}
      </PaperCard>
    );
  }
  return (
    <PaperCard style={[{ marginVertical: 8, borderRadius: 12 }, style as any]} ref={ref as any}>
      {Body}
    </PaperCard>
  );
});

/** ---------- CardContent (light wrapper for compatibility) ---------- */
export function CardContent({
  children,
  style,
}: {
  children?: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
}) {
  return <View style={[{ paddingVertical: 6 }, style as any]}>{children}</View>;
}

/** ---------- Btn ---------- */
type BtnProps = {
  title: string;
  onPress?: () => void; // <— make optional to support <Link asChild><Btn/></Link>
  variant?: 'primary' | 'secondary' | 'danger';
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle;
  disabled?: boolean;
};
export const Btn = React.forwardRef<View, BtnProps>(function Btn(
  { title, onPress, variant = 'primary', style, textStyle, disabled },
  ref
) {
  const mode: 'contained' | 'outlined' | 'text' =
    variant === 'secondary' ? 'outlined' : variant === 'danger' ? 'contained' : 'contained';

  return (
    <PaperButton
      mode={mode}
      onPress={onPress}
      disabled={disabled}
      style={[{ borderRadius: 10, alignSelf: 'flex-start' }, style as any]}
      ref={ref as any}
      labelStyle={textStyle}
    >
      {title}
    </PaperButton>
  );
});

/** ---------- Field ---------- */
export type FieldProps = React.ComponentProps<typeof PaperInput> & {
  label?: string;
  trailing?: React.ReactNode;
  value: string;
  onChangeText: (text: string) => void;
};
export function Field({ label, trailing, value, onChangeText, ...rest }: FieldProps) {
  return (
    <PaperInput
      mode="outlined"
      dense
      label={label}
      value={value}
      onChangeText={onChangeText}
      right={trailing ? <PaperInput.Icon icon={() => <View>{trailing}</View>} /> : undefined}
      style={[{ marginVertical: 6 }, (rest as any).style]}
      {...rest}
    />
  );
}

/** ---------- Pill ---------- */
export function Pill({
  children,
  selected,
  onPress,
}: {
  children: React.ReactNode;
  selected?: boolean;
  onPress?: () => void;
}) {
  return (
    <Chip selected={!!selected} onPress={onPress} style={{ marginRight: 8, marginVertical: 4 }}>
      {children}
    </Chip>
  );
}

/** ---------- Tile ---------- */
export type TileProps = {
  title?: string;
  label?: string;
  subtitle?: string;
  caption?: string;
  selected?: boolean;
  icon?: string;
  onPress?: () => void;
};
export const Tile = React.forwardRef<View, TileProps>(function Tile(
  { title, label, subtitle, caption, selected, onPress },
  ref
) {
  return (
    <Pressable
      ref={ref}
      onPress={onPress}
      style={{
        padding: 12,
        borderRadius: 14,
        backgroundColor: selected ? '#eef2ff' : '#fff',
        borderWidth: 1,
        borderColor: selected ? '#93c5fd' : '#eee',
        marginVertical: 6,
      }}
    >
      {!!label && <Text style={{ color: '#666', fontSize: 12, marginBottom: 2 }}>{label}</Text>}
      {!!title && <Text style={{ fontWeight: '700', marginBottom: 2 }}>{title}</Text>}
      {!!subtitle && <Text style={{ color: '#333' }}>{subtitle}</Text>}
      {!!caption && <Text style={{ color: '#666', fontSize: 12 }}>{caption}</Text>}
    </Pressable>
  );
});

/** ---------- Page ---------- */
export function Page({ title, children }: { title?: string; children: React.ReactNode }) {
  return <Screen title={title}>{children}</Screen>;
}

/** ---------- Screen ---------- */
type ScreenProps = {
  title?: string;
  subtitle?: string;
  onBack?: () => void;
  right?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
};
export function Screen({ title, subtitle, onBack, right, footer, children }: ScreenProps) {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Appbar.Header mode="center-aligned">
        {onBack ? <Appbar.BackAction onPress={onBack} /> : null}
        <Appbar.Content title={title} subtitle={subtitle} />
        {right ? <View style={{ marginRight: 8 }}>{right}</View> : null}
      </Appbar.Header>

      <KeyboardAvoidingView behavior={Platform.select({ ios: 'padding', android: undefined })} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: footer ? 90 : 32 }} keyboardShouldPersistTaps="handled">
          {children}
        </ScrollView>
      </KeyboardAvoidingView>

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
  );
}

export function Switch({ value, onValueChange }: { value: boolean; onValueChange: (v: boolean) => void }) {
  return <PaperSwitch value={value} onValueChange={onValueChange} />;
}
