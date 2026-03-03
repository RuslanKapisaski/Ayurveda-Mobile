import React, { useEffect, useState, useCallback } from "react";
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
import AppointmentCard from "../../components/AppointmentCard";
import * as appointmentsService from "../../services/appointmentsService";
import useAuth from "../../contexts/auth/useAuth";
import confirmAlert from "../../utils/confirmAlert";
import { useTheme } from "../../contexts/theme/useTheme"; 
import { useFocusEffect } from "@react-navigation/native"; 

export default function AppointmentsScreen({ navigation }) {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadAppointments = useCallback(async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      const data = await appointmentsService.getAllByUser(user.id);
      setAppointments(data);
    } catch (err) {
      setError(err.message || "Failed to load appointments");
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useFocusEffect(
    useCallback(() => {
      loadAppointments();
    }, [loadAppointments]),
  );

  // Cancel appointment
  const handleCancel = async (appointmentId) => {
    const confirmed = await confirmAlert(
      "Cancel Appointment",
      "Are you sure you want to cancel this appointment?",
    );

    if (!confirmed) return;

    try {
      await appointmentsService.deleteAppointment(appointmentId);
      setAppointments((prev) =>
        prev.filter((item) => item.id !== appointmentId),
      );
    } catch (err) {
      Alert.alert("Error", err.message || "Failed to cancel appointment");
    }
  };

  const handleEdit = async (appointmentData) => {
    const confirmed = await confirmAlert(
      "Edit Appointment",
      "Are you sure you want to edit this appointment?",
    );

    if (!confirmed) return;

    navigation.navigate("Edit", { appointment: appointmentData });
  };

  if (isLoading) {
    return (
      <View
        style={[styles.loader, { backgroundColor: theme.colors.background }]}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <Text style={[styles.error, { color: theme.colors.text }]}>{error}</Text>
    );
  }

  if (appointments.length === 0) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <Text style={[styles.noAppointments, { color: theme.colors.text }]}>
          No upcoming appointments
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Text style={[styles.title, { color: theme.colors.text }]}>
        Your Appointments
      </Text>

      <FlatList
        data={appointments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AppointmentCard
            appointment={item}
            onCancel={handleCancel}
            onEdit={handleEdit}
          />
        )}
        refreshing={isLoading}
        onRefresh={loadAppointments}
        contentContainerStyle={{
          paddingBottom: 20,
          flexGrow: 1,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
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
    textAlign: "center",
    marginTop: 80,
  },
  noAppointments: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 40,
  },
});
