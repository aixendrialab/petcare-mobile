import React from "react";
import type { AttentionModel, IconRegistry } from "../types";
import { StackWithSeparators } from "../sections/StackWithSeparators";
import { AttentionItem } from "./AttentionItem";
import { EmptyAttention } from "./EmptyAttention";

export function AttentionList({ model, icons }: { model: AttentionModel; icons: IconRegistry }) {
  const items = model.maxVisible ? model.items.slice(0, model.maxVisible) : model.items;
  if (items.length === 0) {
    return model.empty ? <EmptyAttention text={model.empty.text} /> : null;
  }
  return (
    <StackWithSeparators>
      {items.map((it) => (
        <AttentionItem key={it.key} item={it} icons={icons} />
      ))}
    </StackWithSeparators>
  );
}
