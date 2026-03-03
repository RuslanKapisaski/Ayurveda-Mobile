import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "../contexts/theme/useTheme";

export default function TherapyCard({ therapy, onPress }) {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: theme.colors.cardColor }]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      {therapy.imageUrl ? (
        <Image source={{ uri: therapy.imageUrl }} style={styles.image} />
      ) : (
        <View
          style={[
            styles.placeholder,
            { backgroundColor: theme.colors.placeholderBackground },
          ]}
        >
          <Ionicons name="leaf-outline" size={28} color="#118161" />
        </View>
      )}

      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          {therapy.name}
        </Text>

        <Text
          style={[styles.description, { color: theme.colors.text }]}
          numberOfLines={2}
        >
          {therapy.shortDescription}
        </Text>

        <View style={styles.footer}>
          <View style={styles.info}>
            <Ionicons name="time-outline" size={14} color="#666" />
            <Text style={[styles.metaText, { color: theme.colors.text }]}>
              {therapy.durationMinutes} min
            </Text>
          </View>

          <Text style={[styles.price, { color: theme.colors.text }]}>
            {therapy.price} €
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  image: {
    width: "100%",
    height: 160,
  },
  placeholder: {
    height: 160,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },
  description: {
    fontSize: 13,
    marginBottom: 12,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  info: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 12,
  },
  price: {
    fontSize: 15,
    fontWeight: "400",
  },
});
