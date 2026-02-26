import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppointmentCard from "../components/AppointmentCard";

import * as appointmentsService from "../services/appointmentsService";
import useAuth from "../auth/useAuth";

export default function AppointmentsScreen() {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const loadAppointments = async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      const data = await appointmentsService.getAllByUser(user.id);
      setAppointments(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, [user?.id]);

  const handleCancel = (appointmentId) => {
    Alert.alert(
      "Cancel Appointment",
      "Are you sure you want to cancel this appointment?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes",
          onPress: async () => {
            try {
              await appointmentsService.deleteAppointment(appointmentId);

              setAppointments((prev) =>
                prev.filter((item) => item.id !== appointmentId),
              );
            } catch (err) {
              Alert.alert("Error", err.message);
            }
          },
        },
      ],
    );
  };

  if (isLoading) {
    return <ActivityIndicator size="large" style={styles.loader} />;
  }

  if (error) {
    return <Text style={styles.error}>{error}</Text>;
  }

  if (appointments.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.noAppointments}>No upcoming appointments</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Your Appointments</Text>

      <FlatList
        data={appointments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AppointmentCard appointment={item} onCancel={handleCancel} />
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f6f1e4",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  error: {
    color: "red",
    textAlign: "center",
    marginTop: 80,
  },
  noAppointments: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 40,
    color: "#666",
  },
});
