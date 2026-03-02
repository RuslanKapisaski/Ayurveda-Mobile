import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import * as appointmentService from "../services/appointmentsService";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../components/Button";
import useAuth from "../auth/useAuth";
import { formatDate } from "../utils/dateFormater"; // Assuming you have a custom date formatter
import { useFocusEffect } from "@react-navigation/native";

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
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

  useEffect(() => {
    if (user?.id) {
      loadUpcomingAppointments();
      loadPastAppointments();
      loadCountAppointments(); // Call the count function on mount
    }
  }, [user?.id]);

  useFocusEffect(
    React.useCallback(() => {
      loadUpcomingAppointments();
    }, []),
  );

  if (isLoading) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  if (error) {
    return <Text style={styles.error}>{error}</Text>;
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View style={styles.header}>
          {user?.photoURL ? (
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
          ) : (
            <Image
              source={{
                uri: "https://img.freepik.com/premium-vector/profile-icon-vector-image-can-be-used-ui_120816-260932.jpg?semt=ais_rp_progressive&w=740&q=80",
              }}
              style={styles.avatar}
            />
          )}
          <View>
            <Text style={styles.greeting}>
              Welcome,
              <Text style={styles.username}>{user.name} 🌿</Text>
            </Text>
          </View>
        </View>

        {/* Section: Upcoming Appointments */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Upcoming Appointments</Text>
          {upcomingAppointments.map((appointment, index) => (
            <View
              key={index}
              style={[styles.infoCard, styles.featureInfoCards]}
            >
              <Text>Type: {appointment.type}</Text>
              <Text>
                Time:{" "}
                {appointment.createdAt
                  ? formatDate(appointment.date)
                  : "Invalid date"}
              </Text>
            </View>
          ))}
        </View>

        {/* Section: Past Appointments */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Past Appointments</Text>
          {pastAppointments.map((appointment, index) => (
            <View key={index} style={[styles.infoCard, styles.pastinfoCards]}>
              <Text>Type: {appointment.type}</Text>
              <Text>
                Time:{" "}
                {appointment.createdAt
                  ? formatDate(appointment.date)
                  : "Invalid date"}
              </Text>
            </View>
          ))}
        </View>

        {/* PROGRESS SECTION */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBox}>
            <Text style={styles.progressNumber}>{therapiesCount}</Text>
            <Text style={styles.progressLabel}>Therapies</Text>
          </View>
          <View style={styles.progressBox}>
            <Text style={styles.progressNumber}>{programsCount}</Text>
            <Text style={styles.progressLabel}>Programs</Text>
          </View>
          <View style={styles.progressBox}>
            <Text style={styles.progressNumber}>{checkupsCount}</Text>
            <Text style={styles.progressLabel}>Checkups</Text>
          </View>
        </View>

        {/* QUICK ACTIONS */}
        <Button
          text="Book Consultation"
          active={true}
          style={styles.consultationButton}
          onPress={() => navigation.navigate("Checkup")}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#F8F8F8",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: "#4A7C59",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },

  greeting: {
    fontSize: 16,
    color: "#fff",
  },

  username: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFF",
    marginTop: 4,
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
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
    color: "#4A7C59",
  },

  progressLabel: {
    fontSize: 14,
    color: "#777",
    marginTop: 4,
  },

  card: {
    backgroundColor: "#FFF",
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
});
