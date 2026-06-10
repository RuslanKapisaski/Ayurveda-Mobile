import { Platform } from "react-native";
export const createShadow = (color = "#000", opacity = 0.3, elevation = 4) =>
  Platform.select({
    ios: {
      shadowColor: color,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: opacity,
      shadowRadius: 4,
    },
    android: {
      elevation,
    },
    default: {},
  });