import { StyleSheet, TouchableOpacity, Text } from "react-native";

export default function Button({
  textStyle = {},
  style = {},
  text = "",
  active,
  passive,
  onPress,
}) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
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
        ]}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 1, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  primaryButton: {
    backgroundColor: "#4A7C59",
  },
  secondaryButton: {
    backgroundColor: "#d0f5db",
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
