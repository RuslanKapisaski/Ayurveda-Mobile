import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import useAuth from "../contexts/auth/useAuth";
import { formatDate } from "../utils/dateFormater";

import * as appointmentService from "../services/appointmentsService";
import * as userService from "../services/userService";
import { SafeAreaView } from "react-native-safe-area-context";
import HistoryCard from "../components/HistoryCard";

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [firestoreUser, setFirestoreUser] = useState([]);
  const [historyOfAppointments, setHistoryOfAppointments] = useState([]);
  const [therapiesCount, setTherapiesCount] = useState(0);
  const [programsCount, setProgramsCount] = useState(0);
  const [checkupsCount, setCheckupsCount] = useState(0);
  const [detailedAppointments, setDetailedAppointment] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allergies, setAllergies] = useState([]);
  const [editingAllergies, setEditingAllergies] = useState(false);

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

  const loadHistoryOfAppointments = async () => {
    try {
      setIsLoading(true);
      const result = await appointmentService.getHistory(user.id);
      setHistoryOfAppointments(result);
      await fetchAppointmentsDetails(result);
    } catch (error) {
      setError("Failed to load history of appointments");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAppointmentsDetails = async (appointments) => {
    try {
      const details = await Promise.all(
        appointments.map(async (appointment) => {
          const details = await appointmentService.getById(
            appointment.itemId,
            appointment.type,
            user.id,
          );
          return { details };
        }),
      );
      setDetailedAppointment(details);
    } catch (error) {
      setError("Failed to load appointment details");
    }
  };

  const loadUserData = async () => {
    try {
      const result = await userService.getUserData(user.id);
      setFirestoreUser(result);
      setAllergies(result.allergies || []);
    } catch (error) {
      setError(error);
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadHistoryOfAppointments();
      loadCountAppointments();
      loadUserData();
    }
  }, [user?.id]);

  const handleEditAllergies = () => {
    if (editingAllergies) {
      const updatedAllergies = allergies.filter((item) => item.trim() !== "");
      userService.setUserAllergies(user.id, updatedAllergies);
    }
    setEditingAllergies(!editingAllergies);
  };

  const handleAddAllergy = () => {
    setAllergies([...allergies, ""]);
  };

  const handleAllergyChange = (index, value) => {
    const updatedAllergies = [...allergies];
    updatedAllergies[index] = value;
    setAllergies(updatedAllergies);
  };

  const handleLogout = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          try {
            setIsLoading(true);
            await logout();
          } catch (error) {
            console.log("Logout error:", error);
          } finally {
            setIsLoading(false);
          }
        },
      },
    ]);
  };
  if (isLoading) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  if (error) {
    return <Text style={styles.error}>{error}</Text>;
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
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

        <View style={styles.card}>
          <Text style={styles.cardTitle}>User Information</Text>
          <Text style={styles.infoText}>
            Active since: {formatDate(firestoreUser.createdAt)}
          </Text>
          <Text style={styles.infoText}>
            Name: {firestoreUser.name || "Not available"}
          </Text>
          <Text style={styles.infoText}>
            Email: {firestoreUser.email || "Not available"}
          </Text>
          <Text style={styles.infoText}>
            Dominant Dosha: {firestoreUser.dosha?.dominant || "Not available"}
          </Text>
          <Text style={styles.infoText}>
            Dosha Scores:
            {`Kapha: ${user.dosha?.scores?.Kapha || 0}, Pitta: ${user.dosha?.scores?.Pitta || 0}, Vata: ${user.dosha?.scores?.Vata || 0}`}
          </Text>
        </View>

        {/* Allergies Section */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Allergies</Text>
          {editingAllergies ? (
            allergies.map((allergy, index) => (
              <TextInput
                key={index}
                style={styles.textInput}
                value={allergy}
                onChangeText={(value) => handleAllergyChange(index, value)}
                placeholder={`Allergy #${index + 1}`}
              />
            ))
          ) : (
            <Text style={styles.infoText}>
              {allergies.length > 0
                ? allergies.join(", ")
                : "No allergies listed"}
            </Text>
          )}

          {editingAllergies && (
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddAllergy}
            >
              <Text style={styles.addButtonText}>+ Add Allergy</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={handleEditAllergies}
            style={styles.editButton}
          >
            <Text style={styles.editButtonText}>
              {editingAllergies ? "Save" : "Edit"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* GOALS */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Goals</Text>
          {firestoreUser.goals?.length > 0 ? (
            firestoreUser.goals.map((goal, index) => (
              <Text key={index} style={styles.goalText}>
                {goal}
              </Text>
            ))
          ) : (
            <Text>No goals set</Text>
          )}
        </View>

        {/* History */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>History of appointments</Text>
          {detailedAppointments.length > 0 ? (
            detailedAppointments.map((app, index) => (
              <HistoryCard
                key={index}
                imageUrl={app.details?.imageUrl}
                name={app.details?.name}
                price={app.details?.price}
                startDate={app.details?.startDate}
                checkup={app?.details}
              />
            ))
          ) : (
            <Text>No appointment history available</Text>
          )}
        </View>

        {/* SIGN OUT */}
        <View style={styles.logoutContainer}>
          {isLoading ? (
            <ActivityIndicator size="large" />
          ) : (
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Text style={styles.logoutButtonText}>Sign Out</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
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
  card: {
    backgroundColor: "#FFF",
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 20,
    borderRadius: 12,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 18,
    color: "#4A7C59",
    fontWeight: "bold",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 16,
    color: "#777",
    marginTop: 4,
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: "#f5f5f5",
  },
  textInput: {
    fontSize: 16,
    padding: 8,
    marginTop: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#f9f9f9",
  },
  addButton: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#4A7C59",
    borderRadius: 8,
  },
  addButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
  },
  editButton: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#4A7C59",
    borderRadius: 8,
  },
  editButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
  },
  goalText: {
    fontSize: 14,
    color: "#555",
    marginTop: 8,
  },

  logoutContainer: {
    marginTop: 10,
    marginBottom: 40,
    alignItems: "center",
  },
  logoutButton: {
    backgroundColor: "#B00020",
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 12,
  },
  logoutButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  error: {
    color: "#FF0000",
    textAlign: "center",
    fontSize: 18,
    marginTop: 80,
  },
});
