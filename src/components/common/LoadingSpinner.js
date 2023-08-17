import { View, Text } from "react-native";
import { ActivityIndicator } from "react-native";
import React from "react";

export default function LoadingSpinner({ size, color }) {
  return (
    <ActivityIndicator
      size={size == "large" || size == "small" ? size : "large"}
      color={color}
    />
  );
}
