import { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Platform,
  Image,
  TextInput,
  KeyboardAvoidingView,
  ActivityIndicator,
  Alert,
} from "react-native";

import Button from "../components/Button";
import useAuth from "../auth/useAuth";
import Calendar from "../components/Calendar";

import * as therapiesService from "../services/therapiesService";
import * as programsService from "../services/programsService";
import * as appointmentsService from "../services/appointmentsService";

const showConfirmAlert = (title, message) => {
  return new Promise((resolve) => {
    Alert.alert(
      title,
      message,
      [
        { text: "Cancel", style: "cancel", onPress: () => resolve(false) },
        { text: "Confirm", onPress: () => resolve(true) },
      ],
      { cancelable: false },
    );
  });
};

export default function BookingScreen({ route, navigation }) {
  const { type, itemId } = route.params;
  const { user } = useAuth();

  const [booking, setBooking] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [note, setNote] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadItem = async () => {
      try {
        setIsLoading(true);
        let data;

        if (type === "therapy") {
          data = await therapiesService.getById(itemId);
        } else if (type === "program") {
          data = await programsService.getById(itemId);
        }

        setBooking(data);
      } catch (err) {
        setError("Failed to load data.");
      } finally {
        setIsLoading(false);
      }
    };

    loadItem();
  }, [itemId, type]);

  const handleConfirmBooking = async (date) => {
    const confirmed = await showConfirmAlert(
      "Confirm Booking",
      `Book for ${selectedDate.toDateString()}?`,
    );

    if (!confirmed) return;

    try {
      setIsLoading(true);

      const appointment = {
        userId: user.id,
        itemId,
        type,
        note,
        date,
        createdAt: Date.now(),
      };

      await appointmentsService.create(appointment);

      Alert.alert("Success", "Appointment booked successfully!");
      navigation.navigate("Appointments");
    } catch (err) {
      setError("Booking failed. Try again.");
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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {booking?.imageUrl ? (
          <Image source={{ uri: booking.imageUrl }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text>No Image</Text>
          </View>
        )}

        <Text style={styles.title}>
          {type === "therapy" ? "Therapy" : "Program"}: {booking?.name}
        </Text>

        <View style={styles.bookingSection}>
          <Text style={styles.label}>Book a therapy</Text>
          {error && <Text style={styles.error}>{error}</Text>}

          <TextInput
            multiline
            placeholder="Leave a note"
            value={note}
            onChangeText={setNote}
            style={styles.textInput}
          />

          {booking && (
            <Calendar
              data={booking}
              onPress={(date) => handleConfirmBooking(date)}
            />
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    marginVertical: 20,
  },
  bookingSection: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    marginBottom: 10,
    fontSize: 18,
    color: "#8d8e8e",
    alignSelf: "center",
  },
  textInput: {
    minHeight: 100,
    width: "80%",
    borderWidth: 1,
    marginBottom: 20,
    borderRadius: 8,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 12,
  },
  imagePlaceholder: {
    width: "100%",
    height: 200,
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
});
