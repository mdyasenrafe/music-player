import { Text, StyleSheet } from "react-native";
import React, { Children } from "react";
import { presets } from "./TextPreset";

export default function OwnText(props) {
  const { children, preset = "default", style } = props;
  const styles = StyleSheet.compose(style, presets[preset]);
  return <Text style={styles}>{children}</Text>;
}
