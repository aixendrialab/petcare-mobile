import React from "react";
import { StyleSheet, View } from "react-native";
import { HomeTheme } from "../theme";

export function StackWithSeparators({
  children,
  insetLeft = 0,
}: {
  children: React.ReactNode;
  insetLeft?: number;
}) {
  const arr = React.Children.toArray(children);
  return (
    <View>
      {arr.map((child, i) => (
        <View key={i}>
          {child}
          {i < arr.length - 1 ? <View style={[styles.sep, { marginLeft: insetLeft }]} /> : null}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  sep: {
    height: 1,
    backgroundColor: HomeTheme.divider,
  },
});
