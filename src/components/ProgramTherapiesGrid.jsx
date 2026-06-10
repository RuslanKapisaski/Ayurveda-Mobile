import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "../contexts/theme/useTheme";

export default function ProgramTherapiesGrid({ therapies, onTherapyPress }) {
  const numColumns = 2;

  const {theme} = useTheme()

  const renderItem = ({ item }) => (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.card, theme.shadows.small, {backgroundColor: theme.colors.primary}]}
        onPress={() => onTherapyPress(item.id)}
      >
        {item.imageUrl ? (
          <Image source={{ uri: item.imageUrl }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imagePlaceholderText}>No Image</Text>
          </View>
        )}
        <Text style={[{color:theme.colors.card}], styles.title} numberOfLines={1}>
          {item.name}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <FlatList
      data={therapies}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      numColumns={numColumns}
      columnWrapperStyle={styles.row}
      scrollEnabled={false}
      contentContainerStyle={{ paddingBottom: 20 }}
    />
  );
}

const styles = StyleSheet.create({
  row: {
    justifyContent: "space-between",
  },
  container: {
    flex: 1,
    marginVertical: 16,
    marginHorizontal: 2,
  },
  card: {
    backgroundColor: "#f5fff5",
  },
  image: {
    width: "100%",
    height: 120,
  },
  imagePlaceholder: {
    width: "100%",
    height: 120,
    backgroundColor: "#E9F5F1",
    justifyContent: "center",
    alignItems: "center",
  },
  imagePlaceholderText: {
    color: "#666",
    fontSize: 14,
  },
  title: {
    padding: 8,
    fontSize: 12,
    alignSelf: "center",
    fontWeight: "600",
    color: "#ffffff",
  },
});
