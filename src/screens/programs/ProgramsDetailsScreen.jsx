import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
} from "react-native";
import * as programsService from "../../services/programsService";
import * as therapiesService from "../../services/therapiesService";
import ProgramTherapiesGrid from "../../components/ProgramTherapiesGrid";
import Button from "../../components/Button";
import { useTheme } from "../../contexts/theme/useTheme";

export default function ProgramDetailsScreen({ route, navigation }) {
  const { programId } = route.params;
  const [program, setProgram] = useState(null);
  const [therapies, setTherapies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { theme } = useTheme();

  useEffect(() => {
    const loadProgram = async () => {
      try {
        setIsLoading(true);
        const data = await programsService.getById(programId);
        setProgram(data);

        if (data?.therapyIds?.length) {
          const result = await therapiesService.getTherapiesByIds(
            data.therapyIds.map(String),
          );
          setTherapies(result);
        }
      } catch (err) {
        setError("Failed to load program.");
      } finally {
        setIsLoading(false);
      }
    };

    loadProgram();
  }, [programId]);

  const handleBooking = () => {
    navigation.navigate("Booking", {
      type: "program",
      itemId: program.id,
    });
  };

  const handleTherapyPress = (therapyId) => {
    navigation.navigate("TherapiesStack", {
      screen: "Details",
      params: { therapyDocId: therapyId },
    });
  };

  if (isLoading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;

  if (error)
    return (
      <Text style={[styles.error, { color: theme.colors.text }]}>{error}</Text>
    );

  if (!program) return null;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {program.imageUrl ? (
        <Image source={{ uri: program.imageUrl }} style={styles.image} />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text style={styles.imagePlaceholderText}>No Image</Text>
        </View>
      )}

      <Text style={[styles.title, { color: theme.colors.text }]}>
        {program.name}
      </Text>

      <Text style={[styles.price, { color: theme.colors.primary }]}>
        {program.price} €
      </Text>

      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
        Information
      </Text>

      <Text style={[styles.infoText, { color: theme.colors.text }]}>
        Start: {program.startDate}
      </Text>
      <Text style={[styles.infoText, { color: theme.colors.text }]}>
        End: {program.endDate}
      </Text>
      <Text style={[styles.infoText, { color: theme.colors.text }]}>
        Duration: {program.durationDays} days
      </Text>
      <Text style={[styles.infoText, { color: theme.colors.text }]}>
        Origin: {program.origin}
      </Text>

      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
        Description
      </Text>
      <Text style={[styles.description, { color: theme.colors.text }]}>
        {program.description}
      </Text>

      {program.benefits?.length > 0 && (
        <>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Benefits
          </Text>
          {program.benefits.map((benefit, index) => (
            <Text
              key={index}
              style={[styles.benefitItem, { color: theme.colors.text }]}
            >
              • {benefit}
            </Text>
          ))}
        </>
      )}

      {therapies?.length > 0 && (
        <>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Included Therapies
          </Text>
          <ProgramTherapiesGrid
            therapies={therapies}
            onTherapyPress={handleTherapyPress}
          />
        </>
      )}

      <Button
        text="Book Program"
        active={true}
        onPress={handleBooking}
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
  infoText: {
    fontSize: 16,
    marginBottom: 6,
  },
  price: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  signUpButton: {
    marginTop: 20,
    marginBottom: 40,
    alignItems: "center",
  },
  error: {
    textAlign: "center",
    marginTop: 20,
  },
});
