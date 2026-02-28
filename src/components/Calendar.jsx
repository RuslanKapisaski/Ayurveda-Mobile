import { useState } from "react";
import {
  ScrollView,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

import Button from "./Button";
import { formatDate } from "../utils/dateFormater";

export default function Calendar({ data, onPress }) {
  let initialDate;

  if (data?.date) {
    if (typeof data.date.toDate === "function") {
      // Firestore Timestamp
      initialDate = data.date.toDate();
    } else {
      // ISO string or JS Date
      initialDate = new Date(data.date);
    }
  } else {
    initialDate = new Date(); // fallback
  }

  const [date, setDate] = useState(initialDate);
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;

    // Restrict time between 09:00 and 17:30
    const hour = currentDate.getHours();
    if (hour < 9) currentDate.setHours(9, 0);
    if (hour > 17 || (hour === 17 && currentDate.getMinutes() > 30))
      currentDate.setHours(17, 30);

    setShow(Platform.OS === "ios");
    setDate(currentDate);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Select new date & time:</Text>

      {show && (
        <DateTimePicker
          value={date}
          mode="datetime"
          minimumDate={new Date()}
          display="inline"
          onChange={onChange}
        />
      )}
      <TouchableOpacity
        onPress={() => setShow(true)}
        style={styles.dateContainer}
      >
        <Text style={styles.dateText}>{formatDate(date)}</Text>
      </TouchableOpacity>

      <Button
        text="Save Changes"
        onPress={() => onPress(date)}
        style={styles.button}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "80%",
    alignSelf: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 18,
    color: "#8d8e8e",
    marginBottom: 10,
    alignSelf: "center",
  },
  dateContainer: {
    padding: 16,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: "#f0f0f0",
  },
  dateText: {
    fontSize: 24,
    width: "auto",
  },
  button: {
    marginTop: 20,
  },
});
