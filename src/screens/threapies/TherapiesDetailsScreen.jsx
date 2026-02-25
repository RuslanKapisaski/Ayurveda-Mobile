import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import { useState, useEffect } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

import * as therapiesService from "../../services/therapiesService";
import Button from "../../components/Button";

export default function TherapyDetailsScreen({ route, navigation }) {
  const { therapyDocId } = route.params;
  const [therapy, setTherapy] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadTherapy = async () => {
      try {
        setIsLoading(true);
        const data = await therapiesService.getById(therapyDocId);
        setTherapy(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadTherapy();
  }, [therapyDocId]);

  const onSignUp = () => {
    navigation.navigate("Booking");
  };

  if (isLoading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  if (error) return <Text style={styles.error}>{error}</Text>;
  if (!therapy) return null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {therapy.imageUrl ? (
        <Image source={{ uri: therapy.imageUrl }} style={styles.image} />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text style={styles.imagePlaceholderText}>No Image</Text>
        </View>
      )}

      <Text style={styles.title}>{therapy.name}</Text>
      <Text style={styles.category}>{therapy.category}</Text>

      <Text style={styles.sectionTitle}>Description</Text>
      <Text style={styles.description}>{therapy.description}</Text>

      <Text style={styles.sectionTitle}>Benefits</Text>
      {therapy.benefits?.map((benefit, index) => (
        <Text key={index} style={styles.benefitItem}>
          • {benefit}
        </Text>
      ))}

      <Text style={styles.sectionTitle}>Duration</Text>
      <Text style={styles.duration}>{therapy.durationMinutes} minutes</Text>

      <TouchableOpacity style={styles.signUpButton} onPress={onSignUp}>
        <Text style={styles.signUpButtonText}>Sign Up for Therapy</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f6f1e4",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  imagePlaceholder: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  imagePlaceholderText: {
    color: "#888",
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
    color: "#118161",
  },
  category: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginBottom: 12,
    fontStyle: "italic",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
    color: "#333",
  },
  description: {
    fontSize: 16,
    color: "#444",
    lineHeight: 22,
  },
  benefitItem: {
    fontSize: 16,
    color: "#444",
    marginLeft: 8,
    marginBottom: 4,
  },
  duration: {
    fontSize: 16,
    color: "#444",
  },
  signUpButton: {
    marginTop: 24,
    backgroundColor: "#118161",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  signUpButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
