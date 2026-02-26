import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import type { ActionsModel, IconRegistry } from "../types";
import { HomeTheme } from "../theme";
import { ActionTile } from "./ActionTile";

export function ActionGrid({ model, icons }: { model: ActionsModel; icons: IconRegistry }) {
  const tilesPerRow = model.grid.tilesPerRow;
  const gap = 12;
  const width = Dimensions.get("window").width;
  const usable = width - HomeTheme.spacing.lg * 2;
  const tileW = (usable - gap * (tilesPerRow - 1)) / tilesPerRow;
  const tiles = model.grid.maxVisible ? model.tiles.slice(0, model.grid.maxVisible) : model.tiles;
  return (
    <View style={styles.wrap}>
      <View style={[styles.grid, { gap }]}> 
        {tiles.map((t) => (
          <ActionTile key={t.key} tile={t} icons={icons} width={tileW} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: HomeTheme.spacing.lg,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
});
