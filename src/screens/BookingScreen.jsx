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

import useAuth from "../contexts/auth/useAuth";
import { useTheme } from "../contexts/theme/useTheme";
import Calendar from "../components/Calendar";

import * as therapiesService from "../services/therapiesService";
import * as programsService from "../services/programsService";
import * as appointmentsService from "../services/appointmentsService";
import confirmAlert from "../utils/confirmAlert";
import { formatDate } from "../utils/dateFormater";

export default function BookingScreen({ route, navigation }) {
  const { type, itemId } = route.params;
  const { user } = useAuth();
  const { theme } = useTheme();
  const [booking, setBooking] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
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

  const loadSlots = async (date) => {
    const slots = await appointmentsService.getBookedSlots({
      date,
      itemId,
    });

    setBookedSlots(slots);
  };

  const handleSelectedDate = async (date) => {
    setSelectedDate(date);
    await loadSlots(date);
  };

  const handleConfirmBooking = async (date) => {
    setSelectedDate(new Date(date));

    const title = type === "program" ? "Request Program" : "Confirm Booking";

    const message =
      type === "program"
        ? `Request a program for ${formatDate(date)}? \n Please note that we will contact you for confirmation.`
        : `Book for ${formatDate(date)}?`;

    const confirmed = await confirmAlert(title, message);

    if (!confirmed) {
      selectedDate(null);
      return;
    }

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
            <Text style={{ color: theme.colors.text }}>No Image</Text>
          </View>
        )}

        <Text style={[styles.title, { color: theme.colors.text }]}>
          {type === "therapy" ? "Therapy" : "Program"}: {booking?.name}
        </Text>

        <View style={[styles.bookingSection]}>
          {error && <Text style={styles.error}>{error}</Text>}

          <TextInput
            placeholder="Leave a note"
            multiline
            placeholderTextColor={theme.colors.text}
            value={note}
            onChangeText={setNote}
            style={[
              styles.textInput,
              { color: theme.colors.text, borderColor: theme.colors.text },
            ]}
          />

          {booking && (
            <Calendar
              bookedSlots={bookedSlots}
              onSelectDate={handleSelectedDate}
              onPress={handleConfirmBooking}
              type={type}
            />
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    marginTop: 6,
    marginBottom: 40,
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
    alignSelf: "center",
  },
  textInput: {
    minHeight: 100,
    width: "90%",
    borderWidth: 1,
    marginBottom: 20,
    borderRadius: 8,
    paddingLeft: 10,
    textAlignVertical: "top",
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
