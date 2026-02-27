import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";

export default function ProgramTherapiesGrid({ therapies, onTherapyPress }) {
  const numColumns = 2;

  const renderItem = ({ item }) => (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.card}
        onPress={() => onTherapyPress(item.id)}
      >
        {item.imageUrl ? (
          <Image source={{ uri: item.imageUrl }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imagePlaceholderText}>No Image</Text>
          </View>
        )}
        <Text style={styles.title} numberOfLines={2}>
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
    shadowColor: "#000",
    marginHorizontal: 2,
  },
  card: {
    backgroundColor: "#f5fff5",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 10, height: 3 },
    elevation: 2,
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
    color: "#118161",
  },
});
