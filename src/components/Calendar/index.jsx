import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

import Button from "../Button";
import { useTheme } from "../../contexts/theme/useTheme";
import TimeGrid from "./TimeGrid";

function generateTimeSlots() {
  const slots = [];
  for (let h = 9; h <= 17; h++) {
    slots.push(`${h}:00`);
    if (h !== 17) slots.push(`${h}:30`);
  }
  return slots;
}

export default function Calendar({
  bookedSlots = [],
  onSelectDate,
  onPress,
  type,
}) {
  const { theme } = useTheme();
  const [date, setDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [show, setShow] = useState(false);
  const [hasSelectedDate, setHasSelectedDate] = useState(false);

  let buttonText = "Confirm Booking";

  if (type == "program") {
    buttonText = "Request Program";
  }

  const slots = generateTimeSlots();

  const onChange = (event, selectedDate) => {
    if (!selectedDate || event?.type === "dismissed") {
      setShow(false);
      return;
    }

    setDate(selectedDate);
    setSelectedSlot(null);
    setShow(false);
    setHasSelectedDate(true);

    onSelectDate?.(selectedDate);
  };

  const toggleDates = (slot) => {
    selectedSlot ? setSelectedSlot(null) : setSelectedSlot(slot);
  };

  const handleConfirm = () => {
    if (!selectedSlot) {
      return;
    }
    if (bookedSlots.includes(selectedSlot)) return;

    const [h, m] = selectedSlot.split(":");
    const finalDate = new Date(date);
    finalDate.setHours(Number(h), Number(m), 0, 0);

    onPress(finalDate);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setShow(true)}
        style={[styles.dateBtn, { backgroundColor: theme.colors.primary }]}
      >
        <Text style={{ color: theme.colors.buttonText }}>Select date</Text>
      </TouchableOpacity>

      {show && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === "ios" ? "inline" : "default"}
          onChange={onChange}
          minimumDate={new Date()}
        />
      )}

      {hasSelectedDate && (
        <>
          <Text style={[styles.label, { color: theme.colors.primary }]}>
            Select time
          </Text>

          <View style={styles.grid}>
            {slots.map((slot) => {
              const isBooked = bookedSlots.includes(slot);
              const isSelected = selectedSlot === slot;
              return (
                <TimeGrid
                  key={slot}
                  slot={slot}
                  isBooked={isBooked}
                  isSelected={isSelected}
                  onPress={toggleDates}
                  date={date}
                />
              );
            })}
          </View>

          <Button
            text={buttonText}
            onPress={handleConfirm}
            style={{ marginTop: 20, backgroundColor: theme.colors.primary }}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
  },
  label: {
    fontSize: 18,
    marginVertical: 10,
  },
  dateBtn: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
});
