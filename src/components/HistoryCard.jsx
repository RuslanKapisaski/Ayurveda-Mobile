import { StyleSheet, View, Text, Image } from "react-native";
import { formatDate } from "../utils/dateFormater";

export default function HistoryCard({
  imageUrl,
  name,
  price,
  startDate,
  checkup,
}) {
  return (
    <View style={styles.card}>
      <View style={styles.infoContainer}>
        {checkup.type === "checkup" ? (
          <>
            <Text>Type: {checkup?.type || "N/A"}</Text>

            <Text>Doctor: {checkup?.doctor?.name || "N/A"}</Text>

            {checkup?.date && (
              <Text style={styles.date}>Date: {formatDate(checkup.date)}</Text>
            )}
            {checkup?.note && <Text>Note: {checkup.note}</Text>}
          </>
        ) : (
          <>
            {imageUrl ? (
              <Image source={{ uri: imageUrl }} style={styles.image} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text style={styles.placeholderText}>No Image</Text>
              </View>
            )}

            <Text style={styles.title}>{name || "N/A"}</Text>
            <Text style={styles.price}>Price: {price || "N/A"}</Text>

            {startDate && (
              <Text style={styles.date}>{formatDate(startDate)}</Text>
            )}
          </>
        )}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,

    elevation: 4,
  },

  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },

  imagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
  },

  placeholderText: {
    fontSize: 12,
    color: "#888",
  },

  infoContainer: {
    marginLeft: 15,
    flex: 1,
    justifyContent: "center",
  },

  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },

  price: {
    fontSize: 14,
    color: "#4A7C59",
    marginTop: 4,
  },

  date: {
    fontSize: 12,
    color: "#777",
    marginTop: 4,
  },
});
