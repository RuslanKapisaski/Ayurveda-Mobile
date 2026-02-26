import { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

import Button from "../../components/Button";
import useAuth from "../../auth/useAuth.js";

import * as therapiesService from "../../services/therapiesService.js";
import * as appointmentsService from "../../services/appointmentsService.js";

export default function BookingScreen({ route, navigation }) {
  const [therapy, setTherapy] = useState(null);
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [note, setNotes] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { therapyId } = route.params;
  const { user } = useAuth();

  useEffect(() => {
    const loadTherapy = async () => {
      try {
        setIsLoading(true);
        const data = await therapiesService.getById(therapyId);
        setTherapy(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadTherapy();
  }, [therapyId]);

  const handleConfirmBooking = () => {
    Alert.alert(
      "Confirm Booking",
      `Are you sure you want to book a therapy for ${date}?`,
      [
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            onConfirm();
          },
        },
      ],
      { cancelable: false },
    );
  };

  const onConfirm = () => {
    try {
      setIsLoading(true);

      const appointment = {
        userId: user.id,
        therapyId,
        note,
        date,
        createdAt: Date.now(),
      };

      const result = appointmentsService.create(appointment);
      console.log(result);
    } catch (error) {
      setError("Unsuccessfull therapy registration", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);
  };

  if (isLoading) {
    return (
      <ActivityIndicator
        size="large"
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      />
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View>
        {therapy?.imageUrl ? (
          <Image source={{ uri: therapy.imageUrl }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imagePlaceholderText}>No Image</Text>
          </View>
        )}
        <Text style={styles.title}>Therapy: {therapy?.name}</Text>
      </View>

      <View>
        <TouchableOpacity onPress={() => setShow(true)}>
          <Text style={styles.label}>Click to select a date</Text>

          {error && (
            <Text style={styles.errorMessage}>
              {error.message}.Please try again later!
            </Text>
          )}

          {show && (
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "calendar"}
              onChange={onChange}
              style={styles.picker}
            />
          )}

          <Text style={styles.dateText}>{date.toDateString()}</Text>
        </TouchableOpacity>

        <TextInput
          editable
          multiline
          numberOfLines={1}
          maxLength={40}
          placeholder="Leave a note"
          onChangeText={(text) => setNotes(text)}
          value={note}
          style={styles.textInput}
        />

        {show && (
          <Button text="Confirm" ative={true} onPress={handleConfirmBooking} />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    color: "#847f7f",
    marginBottom: 20,
  },
  container: {
    margin: 20,
    borderRadius: 16,
    padding: 20,
    backgroundColor: "#f4f9f4",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  label: {
    fontSize: 20,
    fontWeight: "400",
    color: "#4A7C59",
    margin: 10,
  },
  button: {
    padding: 15,
    borderRadius: 12,
    backgroundColor: "#4A7C5",
    alignItems: "center",
  },
  dateText: {
    color: "#3c662e",
    alignSelf: "center",
    margin: 20,
    fontSize: 28,
  },
  picker: {
    marginTop: 10,
    backgroundColor: "#ffffff",
    borderRadius: 12,
  },
  errorMessage: {
    color: "#ff0000",
    fontSize: 18,
    fontWeight: "500",
    textAlign: "center",
    marginTop: 10,
  },
  textInput: {
    minHeight: 100,
    margin: 20,
    borderWidth: 1,
    borderColor: "#3c662e",
    padding: 10,
    textAlignVertical: "top",
  },

  image: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  imagePlaceholder: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    backgroundColor: "#ddd", // Сив фон за placeholder изображение
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
});
