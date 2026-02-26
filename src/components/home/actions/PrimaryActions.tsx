import React from "react";
import { View } from "react-native";
import type { ActionsModel, IconRegistry } from "../types";
import { ActionsHeader } from "./ActionsHeader";
import { ActionCategoryPills } from "./ActionCategoryPills";
import { ActionGrid } from "./ActionGrid";

export function PrimaryActions({ model, icons }: { model: ActionsModel; icons: IconRegistry }) {
  return (
    <View>
      <ActionsHeader title={model.title} seeAll={model.seeAll} />
      <ActionCategoryPills model={model} />
      <ActionGrid model={model} icons={icons} />
    </View>
  );
}
