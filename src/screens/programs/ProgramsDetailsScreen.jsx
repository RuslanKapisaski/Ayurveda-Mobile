import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  ScrollView,
} from "react-native";

import Button from "../../components/Button";
import * as programsService from "../../services/programsService";
import * as therapiesService from "../../services/therapiesService";
import ProgramTherapiesGrid from "../../components/ProgramTherapiesGrid";

export default function ProgramDetailsScreen({ route, navigation }) {
  const { programId } = route.params;
  const [program, setProgram] = useState(null);
  const [therapies, setTherapies] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProgramData = async () => {
      try {
        const result = await programsService.getById(programId);
        setProgram(result);

        const therapyIds = result.therapyIds.map((id) => String(id));

        if (therapyIds?.length) {
          const therapiesResult =
            await therapiesService.getTherapiesByIds(therapyIds);
          setTherapies(therapiesResult);
        }
      } catch (err) {
        setError("Failed to load program.");
      } finally {
        setIsLoading(false);
      }
    };

    loadProgramData();
  }, [programId]);

  const handleTherapyPress = (therapyId) => {
    navigation.navigate("TherapiesStack", {
      screen: "TherapyDetails",
      params: { therapyDocId: therapyId },
    });
  };

  const handleBooking = () => {
    navigation.navigate("Booking", {
      type: "program",
      itemId: programId,
    });
  };
  if (isLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loader}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  if (!program) return null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {program.imageUrl ? (
        <Image source={{ uri: program.imageUrl }} style={styles.image} />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text>No Image</Text>
        </View>
      )}

      <Text style={styles.title}>{program.name}</Text>

      <View style={styles.infoContainer}>
        <Text style={styles.subTitle}>Information</Text>

        <Text style={styles.infoText}>
          <Text style={styles.label}>Start:</Text> {program.startDate}
        </Text>
        <Text style={styles.infoText}>
          <Text style={styles.label}>End:</Text> {program.endDate}
        </Text>
        <Text style={styles.infoText}>
          <Text style={styles.label}>Duration:</Text> {program.durationDays}{" "}
          days
        </Text>
        <Text style={styles.infoText}>
          <Text style={styles.label}>Origin:</Text> {program.origin}
        </Text>

        <Text style={styles.infoText}>
          Price:
          <Text style={styles.price}> {program.price} €</Text>
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.subTitle}>Description</Text>
        <Text style={styles.description}>{program.description}</Text>
      </View>

      {program.benefits?.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.subTitle}>Benefits</Text>
          {program.benefits.map((benefit, index) => (
            <Text key={index} style={styles.benefitText}>
              • {benefit}
            </Text>
          ))}
        </View>
      )}

      {therapies?.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.subTitle}>Included Therapies</Text>
          <ProgramTherapiesGrid
            therapies={therapies}
            onTherapyPress={handleTherapyPress}
          />
        </View>
      )}

      <Button
        text="Book Program"
        onPress={(programId) => handleBooking(programId)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f6f1e4",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 220,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  imagePlaceholder: {
    width: "100%",
    height: 220,
    backgroundColor: "#D9F0E5",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#118161",
    marginBottom: 16,
  },
  infoContainer: {
    marginBottom: 10,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  infoText: {
    fontSize: 16,
    color: "#444",
    marginBottom: 6,
  },
  label: {
    fontWeight: "400",
    color: "#118161",
  },
  price: {
    fontSize: 18,
    fontWeight: "700",
    color: "#4A7C59",
    marginTop: 8,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  subTitle: {
    fontSize: 24,
    padding: 2,
    fontWeight: "400",
    color: "#118161",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    color: "#444",
  },
  benefitText: {
    fontSize: 16,
    lineHeight: 22,
    color: "#444",
    marginBottom: 4,
  },
  error: {
    color: "red",
    fontSize: 16,
  },
});
