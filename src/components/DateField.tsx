// src/features/slot-settings/components/DateField.tsx
import React from "react";
import { Platform, TextInput } from "react-native";

// For web this becomes an <input type="date">, for native we just use a simple TextInput for now.
export default function DateField({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  if (Platform.OS === "web") {
    return (
      <input
        type="date"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        style={{
          border: "1px solid #ddd",
          borderRadius: 8,
          padding: "6px 10px",
          fontSize: 13,
          minWidth: 150,
        }}
      />
    );
  }

  // On mobile we can later plug in expo-datepicker, for now TextInput fallback
  return (
    <TextInput
      value={value}
      onChangeText={onChange}
      placeholder="YYYY-MM-DD"
      style={{
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 6,
        minWidth: 150,
      }}
    />
  );
}
