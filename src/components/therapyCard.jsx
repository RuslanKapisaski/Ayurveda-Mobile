import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function TherapyCard({ therapy, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      {therapy.imageUrl ? (
        <Image source={{ uri: therapy.imageUrl }} style={styles.image} />
      ) : (
        <View style={styles.placeholder}>
          <Ionicons name="leaf-outline" size={28} color="#118161" />
        </View>
      )}

      <View style={styles.content}>
        <Text style={styles.title}>{therapy.name}</Text>

        <Text style={styles.description} numberOfLines={2}>
          {therapy.shortDescription}
        </Text>

        <View style={styles.footer}>
          <View style={styles.info}>
            <Ionicons name="time-outline" size={14} color="#666" />
            <Text style={styles.metaText}>{therapy.durationMinutes} min</Text>
          </View>

          <Text style={styles.price}>{therapy.price} EU</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
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
    backgroundColor: "#E9F5F1",
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
    color: "#222",
  },
  description: {
    fontSize: 13,
    color: "#666",
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
    color: "#666",
  },
  price: {
    fontSize: 15,
    fontWeight: "700",
    color: "#118161",
  },
});
