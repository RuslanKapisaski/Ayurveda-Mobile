import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { useTheme } from "../contexts/theme/useTheme";

export default function HistoryCard({ item, formatDate }) {
  const data = item?.details || {};
  const { theme } = useTheme();

  const getType = () => {
    if (data.type === "checkup") return "checkup";
    if (data.durationDays) return "program";
    if (data.durationMinutes) return "therapy";
    return "unknown";
  };

  const type = getType();

  const getFormattedDate = (date) => {
    if (!date) return null;

    if (date?.toDate) {
      return formatDate(date.toDate());
    }

    return formatDate(new Date(date));
  };

  const renderCheckup = () => (
    <View style={styles.imageCard}>
      <Image
        source={{
          uri: "https://st3.depositphotos.com/9998432/19176/v/450/depositphotos_191768074-stock-illustration-default-placeholder-doctor-half-length.jpg",
        }}
        style={styles.image}
        resizeMode="cover"
      />

      <View style={styles.imageCardContent}>
        <Text style={{ color: theme.colors.text }}>Type: {data.type}</Text>

        <Text style={{ color: theme.colors.text }}>
          Doctor: {data.doctor?.name || "N/A"}
        </Text>

        {data.date && (
          <Text style={{ color: theme.colors.text }}>
            Date: {getFormattedDate(data.date)}
          </Text>
        )}

        {data.note ? (
          <Text style={{ color: theme.colors.text }}>Note: {data.note}</Text>
        ) : null}
      </View>
    </View>
  );

  const renderProgram = () => (
    <View style={styles.imageCard}>
      {data.imageUrl ? (
        <Image source={{ uri: data.imageUrl }} style={styles.image} />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text>No Image</Text>
        </View>
      )}

      <View style={styles.imageCardContent}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          {data.name}
        </Text>

        <Text style={{ color: theme.colors.text }}>Price: {data.price} €</Text>

        <Text style={{ color: theme.colors.text }}>
          Start: {getFormattedDate(data.startDate)}
        </Text>

        <Text style={{ color: theme.colors.text }}>
          End: {getFormattedDate(data.endDate)}
        </Text>
      </View>
    </View>
  );

  const renderTherapy = () => (
    <View style={styles.imageCard}>
      {data.imageUrl ? (
        <Image source={{ uri: data.imageUrl }} style={styles.image} />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text>No Image</Text>
        </View>
      )}

      <View style={styles.imageCardContent}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          {data.name}
        </Text>

        <Text style={{ color: theme.colors.text }}>
          Category: {data.category}
        </Text>

        <Text style={{ color: theme.colors.text }}>
          Duration: {data.durationMinutes} min
        </Text>

        <Text style={{ color: theme.colors.text }}>Price: {data.price} €</Text>

        <Text style={{ color: theme.colors.text }}>
          Rating: ⭐ {data.rating}
        </Text>
      </View>
    </View>
  );

  const renderContent = () => {
    switch (type) {
      case "checkup":
        return renderCheckup();
      case "program":
        return renderProgram();
      case "therapy":
        return renderTherapy();
      default:
        return <Text style={{ color: theme.colors.text }}>Unknown type</Text>;
    }
  };

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.cardColor }]}>
      {renderContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  imageCard: {
    flexDirection: "row",
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 10,
  },
  imagePlaceholder: {
    width: 90,
    height: 90,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  imageCardContent: {
    marginLeft: 12,
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
