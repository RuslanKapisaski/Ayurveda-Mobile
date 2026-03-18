import { TouchableOpacity, Text, StyleSheet } from "react-native";

import { useTheme } from "../../contexts/theme/useTheme";
import { useEffect, useState } from "react";

export default function TimeGrid({
  slot,
  isBooked,
  isSelected,
  onPress,
  date,
}) {
  const { theme } = useTheme();
  const [isPastSlot, setIsPastSlot] = useState(false);

  useEffect(() => {
    const selectedDate = new Date(date);
    const currentDate = new Date();

    setIsPastSlot(selectedDate < currentDate);
  }, [slot, date]);

  return (
    <TouchableOpacity
      disabled={isBooked || isPastSlot}
      onPress={() => onPress(slot)}
      style={[
        styles.slot,
        {
          backgroundColor:
            isBooked || isPastSlot
              ? "#ccc"
              : isSelected
                ? "#4CAF50"
                : theme.colors.cardColor,
        },
      ]}
    >
      <Text style={{ color: isBooked ? "#666" : theme.colors.text }}>
        {slot}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  slot: {
    padding: 10,
    margin: 5,
    borderRadius: 8,
    minWidth: 70,
    alignItems: "center",
  },
});
