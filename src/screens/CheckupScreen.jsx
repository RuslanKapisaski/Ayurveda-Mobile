import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { SafeAreaView } from "react-native-safe-area-context";

import Calendar from "../components/Calendar";
import useAuth from "../contexts/auth/useAuth";
import * as appointmentsService from "../services/appointmentsService";
import confirmAlert from "../utils/confirmAlert";
import { formatDate } from "../utils/dateFormater";
import { useTheme } from "../contexts/theme/useTheme";

export default function CheckupScreen({ navigation }) {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [doctors] = useState([
    { id: "d1", name: "Dr. Mahesh Vilas Garje" },
    { id: "d2", name: "Dr. Balaji Pavar " },
  ]);
  const [selectedDoctor, setSelectedDoctor] = useState(doctors[0]);
  const [note, setNote] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleConfirmBooking = async (date) => {
    if (!selectedDoctor) {
      Alert.alert("Please select a doctor");
      return;
    }

    const bookingDate = new Date(date);

    const confirmed = await confirmAlert(
      "Confirm Checkup",
      `Book a checkup with ${selectedDoctor.name} on ${formatDate(date)}?`,
    );

    if (!confirmed) return;

    try {
      setIsLoading(true);

      const data = {
        userId: user.id,
        date: bookingDate,
        type: "checkup",
        note: note || "",
        doctor: {
          doctorId: selectedDoctor.id,
          name: selectedDoctor.name,
        },
      };

      await appointmentsService.create(data);

      Alert.alert("Success", "Appointment booked successfully!");
      navigation.navigate("Appointments");
    } catch (err) {
      Alert.alert("Error", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            Select Doctor
          </Text>
          <View
            style={[styles.pickerContainer, { borderColor: theme.colors.text }]}
          >
            <Picker
              selectedValue={selectedDoctor.id}
              onValueChange={(itemValue) => {
                const doctor = doctors.find((d) => d.id === itemValue);
                setSelectedDoctor(doctor);
              }}
              style={{ color: theme.colors.text }}
            >
              {doctors.map((doctor) => (
                <Picker.Item
                  key={doctor.id}
                  label={doctor.name}
                  value={doctor.id}
                />
              ))}
            </Picker>
          </View>

          <Text
            style={[
              styles.label,
              {
                color: theme.colors.text,
              },
            ]}
          >
            Add a Note
          </Text>
          <TextInput
            multiline
            placeholder="Optional note..."
            style={[
              styles.textInput,
              {
                color: theme.colors.text,
                borderColor: theme.colors.text,
                borderWidth: 1,
              },
            ]}
            value={note}
            onChangeText={setNote}
          />

          <Calendar
            data={selectedDoctor}
            onPress={(date) => handleConfirmBooking(date)}
          />

          {error && <Text style={styles.error}>{error}</Text>}
        </ScrollView>
      </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
    marginTop: 100,
  },
  label: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: "500",
    marginBottom: 10,
    alignSelf: "flex-start",
    color: "#8d8e8e",
  },
  pickerContainer: {
    width: "100%",
    height: 180,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
  },
  textInput: {
    width: "100%",
    minHeight: 80,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    textAlignVertical: "top",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
});
