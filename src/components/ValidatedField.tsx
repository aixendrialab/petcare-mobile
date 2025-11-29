import React, { useEffect } from "react";
import { View, Text } from "react-native";
import { Field } from "@/src/ui";
import { useValidation } from "./FormValidationContext";

export default function ValidatedField({
  name,
  label,
  required,
  validate,      // ⬅ added
  value,
  onChangeText,
  ...rest
}: any) {
  const { registerField, updateField, errors } = useValidation();

  useEffect(() => {
    registerField({ name, label, required, validate, value });
  }, []);

  useEffect(() => {
    updateField(name, value);
  }, [value]);

  return (
    <View style={{ marginBottom: 10 }}>
      <Field
        label={required ? `${label} *` : label}
        value={value}
        onChangeText={onChangeText}
        {...rest}
      />
      {errors[name] && (
        <Text style={{ color: "red", marginTop: 4, fontSize: 12 }}>
          {errors[name]}
        </Text>
      )}
    </View>
  );
}

