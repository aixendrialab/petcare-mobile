import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import type { SecondaryContextModel } from "../types";
import { HomeTheme } from "../theme";
import { ContextAvatarCard } from "./ContextAvatarCard";
import { AddContextCard } from "./AddContextCard";

export function ContextCarousel({ model }: { model: SecondaryContextModel }) {
  const showStatus = model.showStatus ?? true;
  const data = model.items;
  return (
    <View>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
        data={data}
        keyExtractor={(i) => i.key}
        renderItem={({ item }) => <ContextAvatarCard item={item} showStatus={showStatus} />}
        ListFooterComponent={
          model.onAdd ? (
            <View style={{ marginLeft: 6 }}>
              <AddContextCard label={model.onAdd.label} onPress={model.onAdd.onPress} />
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: HomeTheme.spacing.lg,
    gap: 14,
  },
});
