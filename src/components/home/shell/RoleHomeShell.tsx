import React from "react";
import type { RoleHomeModel } from "../types";
import { HomeHeader } from "../header/HomeHeader";
import { SecondaryContextStrip } from "../context/SecondaryContextStrip";
import { PrimaryActions } from "../actions/PrimaryActions";
import { AttentionPanel } from "../attention/AttentionPanel";
import { DiscoverAccordion } from "../discover/DiscoverAccordion";
import { HomeScroll } from "./HomeScroll";
import { HomeSection } from "./HomeSection";

export function RoleHomeShell({ model }: { model: RoleHomeModel }) {
  return (
    <HomeScroll>
      <HomeHeader role={model.role} model={model.header} />
      <SecondaryContextStrip model={model.secondaryContext} />
      <PrimaryActions model={model.actions} icons={model.icons} />
      <AttentionPanel model={model.attention} icons={model.icons} />
      {model.sections.items.map((s) => (
        <HomeSection key={s.key} section={s} icons={model.icons} />
      ))}
      {model.discover ? <DiscoverAccordion model={model.discover} icons={model.icons} /> : null}
    </HomeScroll>
  );
}
