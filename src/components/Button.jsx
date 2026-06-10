import { StyleSheet, TouchableOpacity, Text } from "react-native";
import { useTheme } from "../contexts/theme/useTheme";

export default function Button({
  textStyle = {},
  style = {},
  text = "",
  active,
  passive,
  onPress,
}) {
  const { theme } = useTheme();
  return (
    <TouchableOpacity
      style={[
        styles.button,
        theme.shadows.medium,
        active && styles.primaryButton,
        passive && styles.secondaryButton,
        style,
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          active && styles.primaryText,
          passive && styles.secondaryText,
          textStyle,
          { color: theme.colors.buttonText },
        ]}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    width: 120,
    margin:6,
  },

  primaryButton: {
    backgroundColor: "#4A7C59",
  },
  secondaryButton: {
    backgroundColor: "#9fd5af",
  },
  primaryText: {
    color: "#e5f9eb",
    fontWeight: "600",
  },
  secondaryText: {
    color: "#4A7C59",
    fontWeight: "600",
  },
});
