import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as appointmentsService from "../services/appointmentsService";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../components/Button";
import useAuth from "../contexts/auth/useAuth";
import { useFocusEffect } from "@react-navigation/native";
import { useTheme } from "../contexts/theme/useTheme";
import useFetchCount from "../hooks/useFetchCount";
import useFetchAppointments from "../hooks/useFetchAppointments";
import AppointmentCard from "../components/AppointmentCard";
import confirmAlert from "../utils/confirmAlert";
import useDailyRecommendations from "../hooks/useRecommendations";
import RecommenationCard from "../components/RecomendationCard";

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const { theme } = useTheme();
  const { counts, loadCount } = useFetchCount(user.id);
  const [changed, setChanged] = useState(false);
  const { upcomingAppointments, loadUpcoming, isLoading, error } = useFetchAppointments(user.id);
  const { dailyRecommendations, isLoading: recommendationsLoading } = useDailyRecommendations(
    user?.id,
    user?.dosha?.dominant
  );

  useFocusEffect(
    useCallback(() => {
      if (!user?.id) return;
      loadUpcoming();
      loadCount();
    }, [user?.id, changed])
  );

  if (isLoading) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  if (error) {
    return <Text style={[styles.error, { color: theme.colors.text }]}>{error}</Text>;
  }

  const handleEdit = (data) => {
    navigation.navigate("EditAppointment", { data });
  };

  const handleCancel = async (appointmentId) => {
    const confirmed = await confirmAlert(
      "Cancel Appointment",
      "Are you sure you want to cancel this appointment?"
    );
    if (!confirmed) return;

    try {
      await appointmentsService.deleteAppointment(appointmentId);
      setChanged((prev) => !prev)
    } catch (err) {
      Alert.alert("Error", err.message || "Failed to cancel appointment");
    }
  };

  const recommendations = dailyRecommendations?.recommendations
    ? Object.values(dailyRecommendations.recommendations)
    : [];

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Upcoming Appointments */}
      <View style={[styles.cardContainer, theme.shadows.medium, { backgroundColor: theme.colors.cardColor }]}>
        <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
          Upcoming Appointments
        </Text>

        {!upcomingAppointments || upcomingAppointments.length === 0 ? (
          <Text style={[styles.noAppointmentsText, { color: theme.colors.text }]}>
            No upcoming appointments
          </Text>
        ) : (
          upcomingAppointments.map((item) => (
            <AppointmentCard
              key={item.id.toString()}
              appointment={item}
              onCancel={() => handleCancel(item?.id)}
              onEdit={() => handleEdit(item)}
            />
          ))
        )}
      </View>

      {/* Daily Recommendations */}
      <View style={[styles.cardContainer,theme.shadows.medium, { backgroundColor: theme.colors.cardColor }]}>
        <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
          Daily Recommendations
        </Text>

        {recommendations.length > 0 ? (
          recommendations.map((rec) => (
            <RecommenationCard
              key={rec.id || rec.title}
              category={rec.category}
              dosha={rec.dosha}
              description={rec.description}
              title={rec.title}
            />
          ))
        ) : (
          <Text style={[styles.noAppointmentsText, { color: theme.colors.text }]}>
            No daily recommendations
          </Text>
        )}

        <Text style={[styles.cardSubTitle, { color: theme.colors.text }]}>
          Based on your {user?.dosha?.dominant} dosha
        </Text>
      </View>

      {/* Progress */}
      <View style={[styles.cardContainer, theme.shadows.medium, { backgroundColor: theme.colors.cardColor }]}>
        <Text style={[styles.cardTitle, { color: theme.colors.text, marginHorizontal: 16 }]}>
          Your Progress
        </Text>
        <View style={styles.progressContainer}>
          <View style={[styles.progressBox, theme.shadows.large, { backgroundColor: theme.colors.cardColor }]}>
            <Text style={[styles.progressNumber, { color: theme.colors.text }]}>
              {counts.therapies}
            </Text>
            <Text style={[styles.progressLabel, { color: theme.colors.text }]}>Therapies</Text>
          </View>

          <View style={[styles.progressBox, theme.shadows.large,{ backgroundColor: theme.colors.cardColor }]}>
            <Text style={[styles.progressNumber, { color: theme.colors.text }]}>
              {counts.programs}
            </Text>
            <Text style={[styles.progressLabel, { color: theme.colors.text }]}>Programs</Text>
          </View>

          <View style={[styles.progressBox, theme.shadows.large,{ backgroundColor: theme.colors.cardColor }]}>
            <Text style={[styles.progressNumber, { color: theme.colors.text }]}>
              {counts.checkups}
            </Text>
            <Text style={[styles.progressLabel, { color: theme.colors.text }]}>Checkups</Text>
          </View>
        </View>
                 <Text style={[styles.cardSubTitle, { color: theme.colors.text }]}>
          Your count of activities 
        </Text>
      </View>
      <Button
        text="Book Consultation"
        active={true}
        style={[styles.consultationButton, { backgroundColor: theme.colors.primary }]}
        onPress={() => navigation.navigate("Checkup")}
      />

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingVertical: 16,
  },
  cardContainer: {
    marginVertical: 10,
    marginHorizontal: "auto",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 16,
    width: "95%",
    elevation: 5,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 16,
  },
  cardSubTitle: {
    marginTop: 10,
    alignSelf: "flex-end",
    fontStyle: "italic",
    fontSize: 13,
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginBottom: 20,
  },
  progressBox: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  progressNumber: {
    fontSize: 18,
    fontWeight: "600",
  },
  progressLabel: {
    fontSize: 13,
    marginTop: 4,
  },
  consultationButton: {
    marginVertical: 20,
    paddingVertical: 12,
    borderRadius: 16,
    alignSelf: "center",
    width: "80%",
  },
  noAppointmentsText: {
    marginVertical: 10,
    fontSize: 14,
  },
  error: {
    flex: 1,
    textAlign: "center",
    marginTop: 40,
  },
});