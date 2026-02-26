import { StyleSheet, View } from "react-native";
import { Image, Text, TouchableOpacity } from "react-native";

export default function ProgramCard({ program, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {program.imageUrl ? (
        <Image source={{ uri: program.imageUrl }} style={styles.image} />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text>No Image</Text>
        </View>
      )}

      <Text style={styles.title}>{program.name}</Text>
      <Text style={styles.description}>{program.shortDescription}</Text>

    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  image: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    marginBottom: 12,
  },
  imagePlaceholder: {
    width: "100%",
    height: 180,
    backgroundColor: "#E9F5F1",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: "#555",
  },
});
