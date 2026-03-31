// CheckupScreen.js
import { useState, useEffect } from "react";
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
import * as doctorService from "../services/doctorService";

export default function CheckupScreen({ navigation }) {
  const { theme } = useTheme();
  const { user } = useAuth();
  const type = "checkup";

  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [note, setNote] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      const data = await doctorService.getAll();
      setDoctors(data);

      if (data.length() > 0) {
        setSelectedDoctor([data[0]]);
      }
    };
    fetchDoctors();
  }, []);

  const loadSlots = async (date) => {
    const slots = await appointmentsService.getBookedSlots({
      date,
      doctorId: selectedDoctor.id,
    });
    setBookedSlots(slots);
  };

  const handleSelectedDate = async (date) => {
    if (!selectedDoctor) {
      Alert.alert("Please select a doctor first");
      return;
    }
    setSelectedDate(date);
    await loadSlots(date);
  };

  const handleConfirmBooking = async (date) => {
    if (!selectedDoctor) {
      Alert.alert("Please select a doctor");
      return;
    }

    const confirmed = await confirmAlert(
      "Confirm Checkup",
      `Book a checkup with ${selectedDoctor.name} on ${formatDate(date)}?`,
    );

    if (!confirmed) return;

    try {
      setIsLoading(true);

      const data = {
        userId: user.id,
        date,
        type,
        note: note || "",
        doctor: {
          doctorId: selectedDoctor.id,
          name: selectedDoctor.name,
        },
      };

      await appointmentsService.create(data);

      Alert.alert("Success", "Appointment booked successfully!");
      navigation.replace("HomeScreen");
    } catch (err) {
      Alert.alert("Error", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDoctorChange = (doctorId) => {
    const doctor = doctors.find((d) => d.id === doctorId);
    setSelectedDoctor(doctor);
    setSelectedDate(null);
    setBookedSlots([]);
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
              style={[
                styles.pickerContainer,
                { borderColor: theme.colors.text },
              ]}
            >
              <Picker
                selectedValue={selectedDoctor?.id}
                onValueChange={handleDoctorChange}
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

            <Text style={[styles.label, { color: theme.colors.text }]}>
              Add a Note
            </Text>
            <TextInput
              multiline
              placeholder="Optional note..."
              style={[
                styles.textInput,
                { color: theme.colors.text, borderColor: theme.colors.text },
              ]}
              value={note}
              onChangeText={setNote}
            />

            <Calendar
              bookedSlots={bookedSlots}
              onSelectDate={handleSelectedDate}
              onPress={handleConfirmBooking}
              type={type}
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
    marginBottom: 10,
    fontWeight: "500",
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
