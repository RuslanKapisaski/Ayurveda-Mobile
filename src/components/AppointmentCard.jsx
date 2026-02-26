import { useEffect, useState } from "react";
import { Text, StyleSheet, TouchableOpacity, Image, View } from "react-native";

import * as therapiesService from "../services/therapiesService";

export default function AppointmentCard({ appointment, onCancel }) {
  const [therapy, setTherapy] = useState(null);

  useEffect(() => {
    const loadTherapy = async () => {
      try {
        const result = await therapiesService.getById(appointment.therapyId);
        setTherapy(result);
      } catch (error) {
        console.log("Error loading therapy:", error);
      }
    };

    loadTherapy();
  }, [appointment.therapyId]);

  return (
    <View style={styles.card}>
      {therapy?.imageUrl ? (
        <Image source={{ uri: therapy.imageUrl }} style={styles.image} />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text style={styles.imagePlaceholderText}>No Image</Text>
        </View>
      )}

      <Text style={styles.therapyName}>Therapy: {therapy?.name}</Text>

      <Text style={styles.date}>
        {new Date(appointment.date).toLocaleString()}
      </Text>

      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => onCancel(appointment.id)}
      >
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  therapyName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#118161",
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: "#444",
    marginBottom: 12,
  },
  cancelButton: {
    backgroundColor: "#ff5c5c",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  image: {
    width: "100%",
    height: 160,
    borderRadius: 8,
    marginBottom: 8,
  },
  imagePlaceholder: {
    height: 160,
    backgroundColor: "#E9F5F1",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    borderRadius: 8,
  },
  imagePlaceholderText: {
    fontSize: 14,
    color: "#444",
  },
});
