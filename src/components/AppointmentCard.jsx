import { useEffect, useState } from "react";
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  View,
  ScrollView,
} from "react-native";

import * as therapiesService from "../services/therapiesService";
import * as programsService from "../services/programsService";
import Button from "./Button";
import { formatDate } from "../utils/dateFormater";

export default function AppointmentCard({ appointment, onCancel, onEdit }) {
  const [item, setItem] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        let result;
        if (appointment.type === "therapy") {
          result = await therapiesService.getById(appointment.itemId);
        } else if (appointment.type === "program") {
          result = await programsService.getById(appointment.itemId);
        }
        // } else if (appointment.type === "checkup") {
        //   result = appointment;
        // }

        setItem(result);
      } catch (error) {
        console.error(`Error loading appointments: ${error.message}`);
      }
    };

    loadData();
  }, [appointment.therapyId]);

  return (
    <ScrollView style={styles.card}>
      {item?.imageUrl ? (
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : item?.type === "checkup" ? (
        <Image
          source={{
            uri: "https://st3.depositphotos.com/9998432/19176/v/450/depositphotos_191768074-stock-illustration-default-placeholder-doctor-half-length.jpg",
          }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <Image
          source={{
            uri: "https://media.istockphoto.com/id/2074983548/vector/default-placeholder-doctor-portrait-photo-avatar-on-gray-background-greyscale-female.jpg?s=612x612&w=0&k=20&c=kRx9BZpeg3WruAKBRDfBrd03P6sWyLW2PzLRUaQnueE=",
          }}
          style={styles.image}
          resizeMode="cover"
        />
      )}
      <Text style={styles.subtitle}>
        Appointment:
        <Text style={styles.itemName}> {item?.name} </Text>
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    gap: 10,
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
    flex: 1,
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
  imagePlaceholder: {
    height: 160,
    backgroundColor: "#E9F5F1",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    borderRadius: 8,
  },
  imagePlaceholderText: {
    fontSize: 14,
    color: "#444",
  },
});
