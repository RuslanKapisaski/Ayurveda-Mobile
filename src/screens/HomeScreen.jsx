import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import * as appointmentService from "../services/appointmentsService";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../components/Button";
import useAuth from "../contexts/auth/useAuth";
import { formatDate } from "../utils/dateFormater";
import { useFocusEffect } from "@react-navigation/native";
import { useTheme } from "../contexts/theme/useTheme";

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [pastAppointments, setPastAppointments] = useState([]);
  const [therapiesCount, setTherapiesCount] = useState(0);
  const [programsCount, setProgramsCount] = useState(0);
  const [checkupsCount, setCheckupsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadCountAppointments = async () => {
    try {
      setIsLoading(true);
      const { appointmentsCount } = await appointmentService.getCount(user.id);
      setTherapiesCount(appointmentsCount.therapies);
      setProgramsCount(appointmentsCount.programs);
      setCheckupsCount(appointmentsCount.checkups);
    } catch (error) {
      setError("Failed to load appointments count");
    } finally {
      setIsLoading(false);
    }
  };

  // Load Upcoming Appointments
  const loadUpcomingAppointments = async () => {
    try {
      setIsLoading(true);
      const result = await appointmentService.getUpcommingAppointmets(user.id);
      setUpcomingAppointments(result);
    } catch (error) {
      setError("Failed to load upcoming appointments");
    } finally {
      setIsLoading(false);
    }
  };

  // Load Past Appointments
  const loadPastAppointments = async () => {
    try {
      setIsLoading(true);
      const result = await appointmentService.getPastAppointmets(user.id);
      setPastAppointments(result);
    } catch (error) {
      setError("Failed to load past appointments");
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      if (!user?.id) return;
      loadUpcomingAppointments();
      loadPastAppointments();
      loadCountAppointments();
    }, [user?.id]),
  );

  if (isLoading) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  if (error) {
    return (
      <Text style={[styles.error, { color: theme.colors.text }]}>{error}</Text>
    );
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {/* Section: Upcoming Appointments */}
      <View style={[styles.card, { backgroundColor: theme.colors.cardColor }]}>
        <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
          Upcoming Appointments
        </Text>
        {upcomingAppointments && upcomingAppointments.length > 0 ? (
          upcomingAppointments.map((appointment, index) => (
            <View
              key={index}
              style={[styles.infoCard, styles.featureInfoCards]}
            >
              <Text style={{ color: theme.colors.text }}>
                Type: {appointment.type}
              </Text>
              <Text style={{ color: theme.colors.text }}>
                Time:
                {appointment.date
                  ? formatDate(appointment.date)
                  : "Invalid date"}
              </Text>
            </View>
          ))
        ) : (
          <Text
            style={[styles.noAppointmentsText, { color: theme.colors.text }]}
          >
            No upcoming appointments
          </Text>
        )}
      </View>

      {/* Section: Past Appointments */}
      <View style={[styles.card, { backgroundColor: theme.colors.cardColor }]}>
        <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
          Past Appointments
        </Text>
        {pastAppointments && pastAppointments.length > 0 ? (
          pastAppointments.map((appointment, index) => (
            <View key={index} style={[styles.infoCard, styles.pastinfoCards]}>
              <Text style={{ color: theme.colors.text }}>
                Type: {appointment.type}
              </Text>
              <Text style={{ color: theme.colors.text }}>
                Time:{" "}
                {appointment.date
                  ? formatDate(appointment.date)
                  : "Invalid date"}
              </Text>
            </View>
          ))
        ) : (
          <Text style={{ color: theme.colors.text }}>No past appointments</Text>
        )}
      </View>

      {/* PROGRESS SECTION */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBox}>
          <Text style={[styles.progressNumber, { color: theme.colors.text }]}>
            {therapiesCount}
          </Text>
          <Text style={[styles.progressLabel, { color: theme.colors.text }]}>
            Therapies
          </Text>
        </View>
        <View style={styles.progressBox}>
          <Text style={[styles.progressNumber, { color: theme.colors.text }]}>
            {programsCount}
          </Text>
          <Text style={[styles.progressLabel, { color: theme.colors.text }]}>
            Programs
          </Text>
        </View>
        <View style={styles.progressBox}>
          <Text style={[styles.progressNumber, { color: theme.colors.text }]}>
            {checkupsCount}
          </Text>
          <Text style={[styles.progressLabel, { color: theme.colors.text }]}>
            Checkups
          </Text>
        </View>
      </View>

      {/* QUICK ACTIONS */}
      <Button
        text="Book Consultation"
        active={true}
        style={[
          styles.consultationButton,
          { backgroundColor: theme.colors.primary },
        ]}
        onPress={() => navigation.navigate("Checkup")}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginBottom: 20,
  },

  progressBox: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 5,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },

  progressNumber: {
    fontSize: 24,
    fontWeight: "bold",
  },

  progressLabel: {
    fontSize: 14,
    color: "#777",
    marginTop: 4,
  },

  card: {
    backgroundColor: "#c13f3f",
    marginVertical: 20,
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 12,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  cardTitle: {
    fontSize: 22,
    color: "#4A7C59",
    fontWeight: "bold",
    marginBottom: 8,
  },

  infoCard: {
    marginBottom: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 10,
  },

  featureInfoCards: {
    backgroundColor: "#e9f7e3",
  },

  pastinfoCards: {
    backgroundColor: "#ead6d6",
  },

  consultationButton: {
    marginVertical: 20,
    paddingVertical: 12,
    backgroundColor: "#4A7C59",
    borderRadius: 8,
    alignSelf: "center",
    width: "80%",
    textAlign: "center",
  },

  noAppointmentsText: {
    marginVertical: 20,
    fontSize: 14,
  },
});
