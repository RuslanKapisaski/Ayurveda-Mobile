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

import Button from "../components/Button";
import useAuth from "../auth/useAuth";

import * as therapiesService from "../services/therapiesService";
import * as programsService from "../services/programsService";
import * as appointmentsService from "../services/appointmentsService";

export default function BookingScreen({ route, navigation }) {
  const { type, itemId } = route.params;
  const { user } = useAuth();

  const [item, setItem] = useState(null);
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
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

        setItem(data);
      } catch (err) {
        setError("Failed to load data.");
      } finally {
        setIsLoading(false);
      }
    };

    loadItem();
  }, [itemId, type]);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);
  };

  const onConfirm = async () => {
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

  const handleConfirmBooking = () => {
    Alert.alert("Confirm Booking", `Book for ${date.toDateString()}?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Confirm", onPress: onConfirm },
    ]);
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
        {item?.imageUrl ? (
          <Image source={{ uri: item.imageUrl }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text>No Image</Text>
          </View>
        )}

        <Text style={styles.title}>
          {type === "therapy" ? "Therapy" : "Program"}: {item?.name}
        </Text>

        <TouchableOpacity onPress={() => setShow(true)}>
          <Text style={styles.label}>Select Date</Text>

          {show && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={onChange}
            />
          )}

          <Text style={styles.dateText}>{date.toDateString()}</Text>
        </TouchableOpacity>

        <TextInput
          multiline
          placeholder="Leave a note"
          value={note}
          onChangeText={setNote}
          style={styles.textInput}
        />

        {error && <Text style={styles.error}>{error}</Text>}

        <Button text="Confirm Booking" onPress={handleConfirmBooking} />
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
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  dateText: {
    fontSize: 18,
    marginBottom: 20,
  },
  textInput: {
    minHeight: 100,
    borderWidth: 1,
    padding: 10,
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
