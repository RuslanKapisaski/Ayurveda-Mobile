import { useEffect, useState } from "react";
import { Text, StyleSheet, TouchableOpacity, Image, View } from "react-native";

import * as therapiesService from "../services/therapiesService";
import * as programsService from "../services/programsService";
import Button from "./Button";
import { formatDate } from "../utils/dateFormater";

export default function AppointmentCard({ appointment, onCancel, onEdit }) {
  const [item, setItem] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        let result = null;
        if (appointment.type === "therapy") {
          result = await therapiesService.getById(appointment.itemId);
        } else if (appointment.type === "program") {
          result = await programsService.getById(appointment.itemId);
        } else if (appointment.type === "checkup") {
          // For checkups, we just use the appointment itself
          result = { name: "Checkup", type: "checkup" };
        }
        setItem(result);
      } catch (error) {
        console.error(`Error loading appointment: ${error.message}`);
      }
    };
    loadData();
  }, [appointment]);

  const getImageUri = () => {
    if (item?.imageUrl) return item.imageUrl;
    if (appointment.type === "checkup") {
      return "https://st3.depositphotos.com/9998432/19176/v/450/depositphotos_191768074-stock-illustration-default-placeholder-doctor-half-length.jpg";
    }
    return "https://media.istockphoto.com/id/2074983548/vector/default-placeholder-doctor-portrait-photo-avatar-on-gray-background-greyscale-female.jpg?s=612x612&w=0&k=20&c=kRx9BZpeg3WruAKBRDfBrd03P6sWyLW2PzLRUaQnueE=";
  };

  return (
    <View style={styles.card}>
      <Image
        source={{ uri: getImageUri() }}
        style={styles.image}
        resizeMode="cover"
      />

      <Text style={styles.subtitle}>
        Appointment:
        <Text style={styles.itemName}> {item?.name || appointment.type} </Text>
      </Text>
      <Text style={styles.subtitle}>
        Type:
        <Text style={styles.itemName}> {appointment?.type}</Text>
      </Text>
      <Text style={styles.subtitle}>
        Date:
        <Text style={styles.itemName}>
          {appointment?.date && formatDate(appointment.date)}
        </Text>
      </Text>

      <View style={styles.buttonPanel}>
        <Button
          style={styles.cancelButton}
          textStyle={styles.buttonText}
          text="Cancel"
          onPress={() => onCancel(appointment.id)}
        />
        <Button
          style={styles.editButton}
          textStyle={styles.buttonText}
          text="Edit"
          onPress={() => onEdit(appointment)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  subtitle: {
    fontSize: 20,
    margin: 4,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "400",
    color: "#6e706f",
    marginBottom: 4,
  },
  buttonPanel: {
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
    justifyContent: "flex-end",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "500",
  },
  cancelButton: {
    backgroundColor: "#960909",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  editButton: {
    backgroundColor: "#1b6608",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 160,
    borderRadius: 8,
    marginBottom: 8,
  },
});
