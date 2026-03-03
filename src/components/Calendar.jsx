import { useMemo, useState } from "react";
import {
  ScrollView,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

import Button from "./Button";
import { formatDate } from "../utils/dateFormater";
import { useTheme } from "../contexts/theme/useTheme";

function clampWorkingHours(d) {
  const x = new Date(d);

  const h = x.getHours();
  const m = x.getMinutes();

  // Минимум 09:00
  if (h < 9) {
    x.setHours(9, 0, 0, 0);
    return x;
  }

  // Максимум 17:30
  if (h > 17 || (h === 17 && m > 30)) {
    x.setHours(17, 30, 0, 0);
    return x;
  }

  return x;
}

export default function Calendar({ data, onPress, buttonText }) {
  const { theme } = useTheme();

  const initialDate = useMemo(() => {
    if (data?.date) {
      if (typeof data.date.toDate === "function") return data.date.toDate(); // Firestore Timestamp
      return new Date(data.date); // ISO string или Date
    }
    return new Date();
  }, [data]);

  const [date, setDate] = useState(clampWorkingHours(initialDate));
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    if (Platform.OS === "android") {
      setShow(false);

      if (event?.type !== "set" || !selectedDate) return;
    }

    if (!selectedDate) return;

    const clamped = clampWorkingHours(selectedDate);
    setDate(clamped);

  
    if (Platform.OS === "ios") setShow(true);
  };

  const handleSave = () => {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      Alert.alert("Грешка", "Невалидна дата/час.");
      return;
    }
    onPress(date);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={[styles.label, { color: theme.colors.text ?? "#8d8e8e" }]}>
        Select new date & time:
      </Text>

      {show && (
        <DateTimePicker
          value={date}
          mode="datetime"
          minimumDate={new Date()}
          display={Platform.OS === "ios" ? "inline" : "default"}
          onChange={onChange}
          is24Hour={true}
        />
      )}

      <TouchableOpacity
        onPress={() => setShow(true)}
        style={[
          styles.dateContainer,
          { backgroundColor: theme.colors.card ?? "#f0f0f0" },
        ]}
      >
        <Text style={[styles.dateText, { color: theme.colors.text ?? "#000" }]}>
          {formatDate(date)}
        </Text>
      </TouchableOpacity>

      <Button
        text={buttonText || "Save Changes"}
        onPress={handleSave}
        style={[
          styles.button,
          {
            backgroundColor: theme.colors.primary,
          },
        ]}
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
    marginBottom: 10,
    alignSelf: "center",
  },
  dateContainer: {
    padding: 16,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
  },
  dateText: {
    fontSize: 24,
    width: "auto",
  },
  button: {
    color: "#fff",
    marginVertical: 20,
  },
});