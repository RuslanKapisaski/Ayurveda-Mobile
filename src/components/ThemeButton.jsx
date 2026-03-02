import { TouchableOpacity, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "../contexts/theme/useTheme";

export default function ThemeButton({ isDark, toggleTheme }) {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.button, isDark && theme.colors.background]}
      onPress={toggleTheme}
      activeOpacity={0.2}
    >
      <Ionicons
        size={18}
        name={isDark ? "sunny-outline" : "moon-outline"}
        color={isDark ? "#fff" : "#000"}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },
  darkButton: {
    backgroundColor: "#333",
  },
});
