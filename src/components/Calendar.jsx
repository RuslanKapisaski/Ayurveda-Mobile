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

  if (h < 9) {
    x.setHours(9, 0, 0, 0);
  }

  if (h > 17 || (h === 17 && m > 30)) {
    x.setHours(17, 30, 0, 0);
  }

  return x;
}

export default function Calendar({ data, onPress, buttonText }) {
  const { theme } = useTheme();

  const now = clampWorkingHours(new Date());

  const initialDate = useMemo(() => {
    if (data?.date) {
      if (typeof data.date.toDate === "function") return data.date.toDate();
      return new Date(data.date);
    }
    return now;
  }, [data]);

  // 🚀 Гарантираме, че началната дата не е в миналото
  const safeInitial =
    initialDate instanceof Date && !isNaN(initialDate)
      ? initialDate < now
        ? now
        : initialDate
      : now;

  const [date, setDate] = useState(safeInitial);
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState("date"); // само за Android

  const onChange = (event, selectedDate) => {
    if (!selectedDate) {
      setShow(false);
      return;
    }

    if (Platform.OS === "android") {
      if (event.type === "dismissed") {
        setShow(false);
        return;
      }

      if (mode === "date") {
        const updated = new Date(selectedDate);
        setDate(updated);
        setMode("time");
        return;
      }

      if (mode === "time") {
        let updated = new Date(selectedDate);

        // 🚀 Забраняваме минали дати
        if (updated < now) {
          Alert.alert("Invalid date", "You cannot select a past date.");
          updated = now;
        }

        updated = clampWorkingHours(updated);

        setDate(updated);
        setShow(false);
        setMode("date");
        return;
      }
    } else {
      let updated = new Date(selectedDate);

      if (updated < now) {
        Alert.alert("Invalid date", "You cannot select a past date.");
        updated = now;
      }

      updated = clampWorkingHours(updated);
      setDate(updated);
    }
  };

  const handleSave = () => {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      Alert.alert("Error", "Invalid date.");
      return;
    }

    if (date < now) {
      Alert.alert("Invalid date", "You cannot select a past date.");
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
          mode={Platform.OS === "ios" ? "datetime" : mode}
          minimumDate={now}
          display={Platform.OS === "ios" ? "inline" : "default"}
          onChange={onChange}
          is24Hour={true}
        />
      )}

      <TouchableOpacity
        onPress={() => {
          setMode("date");
          setShow(true);
        }}
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
          { backgroundColor: theme.colors.primary },
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
  },
  button: {
    marginVertical: 20,
  },
});