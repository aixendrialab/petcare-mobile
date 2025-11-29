import React, { createContext, useContext, useState } from "react";

interface FieldConfig {
  name: string;
  label: string;
  required?: boolean;
  value: any;
  validate?: (value: any) => string | null;
}

const ValidationContext = createContext<any>(null);

export function FormValidationProvider({ children }: any) {
  const [fields, setFields] = useState<Record<string, FieldConfig>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  function registerField(config: FieldConfig) {
    setFields((prev) => ({ ...prev, [config.name]: config }));
  }

  function updateField(name: string, value: any) {
    setFields((prev) => ({
      ...prev,
      [name]: { ...prev[name], value },
    }));
  }

function validateForm() {
  const nextErrors: Record<string, string> = {};

  Object.values(fields).forEach((f) => {
    const v = f.value;

    // Required rule
    if (f.required && (!v || String(v).trim() === "")) {
      nextErrors[f.name] = `${f.label} is required`;
      return;
    }

    // Custom validator rule (email, phone, etc.)
    if (f.validate) {
      const err = f.validate(v);
      if (err) {
        nextErrors[f.name] = err;
      }
    }
  });

  setErrors(nextErrors);
  return Object.keys(nextErrors).length === 0;
}

  return (
    <ValidationContext.Provider
      value={{ registerField, updateField, validateForm, errors }}
    >
      {children}
    </ValidationContext.Provider>
  );
}

export function useValidation() {
  return useContext(ValidationContext);
}
