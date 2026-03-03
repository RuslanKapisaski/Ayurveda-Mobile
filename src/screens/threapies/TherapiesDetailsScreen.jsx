import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
} from "react-native";
import * as therapiesService from "../../services/therapiesService";
import Button from "../../components/Button";
import { useTheme } from "../../contexts/theme/useTheme";

export default function TherapyDetailsScreen({ route, navigation }) {
  const { therapyDocId } = route.params;
  const [therapy, setTherapy] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { theme } = useTheme();

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

  const onSignUp = (therapyId) => {
    navigation.navigate("Booking", {
      type: "therapy",
      itemId: therapy.id,
    });
  };

  if (isLoading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  if (error)
    return (
      <Text style={[styles.error, { color: theme.colors.text }]}>{error}</Text>
    );
  if (!therapy) return null;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {therapy.imageUrl ? (
        <Image source={{ uri: therapy.imageUrl }} style={styles.image} />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text style={styles.imagePlaceholderText}>No Image</Text>
        </View>
      )}

      <Text style={[styles.title, { color: theme.colors.text }]}>
        {therapy.name}
      </Text>
      <Text style={[styles.category, { color: theme.colors.text }]}>
        {therapy.category}
      </Text>
      <Text style={[styles.price, { color: theme.colors.primary }]}>
        {therapy.price} €
      </Text>

      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
        Description
      </Text>
      <Text style={[styles.description, { color: theme.colors.text }]}>
        {therapy.description}
      </Text>

      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
        Benefits
      </Text>
      {therapy.benefits?.map((benefit, index) => (
        <Text
          key={index}
          style={[styles.benefitItem, { color: theme.colors.text }]}
        >
          • {benefit}
        </Text>
      ))}

      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
        Duration
      </Text>
      <Text style={[styles.duration, { color: theme.colors.text }]}>
        {therapy.durationMinutes} minutes
      </Text>

      <Button
        text="Sign Up for Therapy"
        active={true}
        onPress={() => onSignUp(therapy.id)}
        style={styles.signUpButton}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 20,
  },
  imagePlaceholder: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  imagePlaceholderText: {
    color: "#888",
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 6,
  },
  category: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
    fontStyle: "italic",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 16,
  },
  benefitItem: {
    fontSize: 16,
    marginLeft: 8,
    marginBottom: 4,
  },
  duration: {
    fontSize: 16,
    marginBottom: 20,
  },
  price: {
    fontSize: 18,
    fontWeight: "400",
    marginBottom: 16,
  },
  signUpButton: {
    marginBottom: 40,
    alignItems: "center",
  },
  signUpButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  error: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
});
