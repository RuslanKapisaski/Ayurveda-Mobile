import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image"
import { useTheme } from "../contexts/theme/useTheme";

export default function ProgramCard({ program, onPress }) {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.card, theme.shadows.large, { backgroundColor: theme.colors.cardColor }]}
      onPress={onPress}
    >
      {program.imageUrl ? (
        <Image 
        source={{ uri: program.imageUrl }}
        style={styles.image} 
        cachePolicy={'memory-disk'} 
        contentFit="cover" 
        transition={200} />
      ) : (
        <View
          style={[
            styles.imagePlaceholder,
            { backgroundColor: theme.colors.placeholder },
          ]}
        >
          <Text style={{ color: theme.colors.text }}>No Image</Text>
        </View>
      )}

      <Text style={[styles.title, { color: theme.colors.text }]}>
        {program.name}
      </Text>
      <Text style={[styles.description, { color: theme.colors.text }]}>
        {program.shortDescription}
      </Text>
      <Text style={[styles.price, { color: theme.colors.text }]}>
        {program.price}€
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
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
  },
  price: {
    marginLeft: "auto",
    fontSize: 18,
    fontWeight: "400",
    marginBottom: 6,
  },
});
