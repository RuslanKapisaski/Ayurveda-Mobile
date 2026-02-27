import { useState } from "react";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

import Button from "../../components/Button";
import * as appointmentsService from "../../services/appointmentsService";

export default function EditAppointmentScreen({ route, navigation }) {
  const { appointment } = route.params;
  console.log(appointment);

  const [date, setDate] = useState(new Date(appointment.date));
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;

    // Ограничаваме часа между 9:00 и 17:30
    const hour = currentDate.getHours();
    if (hour < 9) currentDate.setHours(9, 0);
    if (hour > 17 || (hour === 17 && currentDate.getMinutes() > 30))
      currentDate.setHours(17, 30);

    setShow(Platform.OS === "ios");
    setDate(currentDate);
  };

  const showPicker = () => setShow(true);

  const handleSave = async () => {
    Alert.alert(
      "Save Changes",
      `Change appointment to ${date.toLocaleString()}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: async () => {
            try {
              setIsLoading(true);
              await appointmentsService.edit(appointment, {
                date: date.toISOString(),
              });
              Alert.alert("Success", "Appointment updated successfully!");
              navigation.goBack();
            } catch (err) {
              Alert.alert("Error", err.message);
            } finally {
              setIsLoading(false);
            }
          },
        },
      ],
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Select new date & time:</Text>

      <TouchableOpacity onPress={showPicker} style={styles.dateContainer}>
        <Text style={styles.dateText}>{date.toLocaleString()}</Text>
      </TouchableOpacity>

      {show && (
        <DateTimePicker
          value={date}
          mode="datetime"
          minimumDate={new Date()}
          display="default"
          onChange={onChange}
        />
      )}

      <Button text="Save Changes" onPress={handleSave} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  dateContainer: {
    padding: 16,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: "#f0f0f0",
  },
  dateText: {
    fontSize: 18,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
