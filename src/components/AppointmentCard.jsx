import { useEffect, useState } from "react";
import { Text, StyleSheet, TouchableOpacity, Image, View } from "react-native";

import * as therapiesService from "../services/therapiesService";
import * as programsService from "../services/programsService";
import Button from "./Button";
import { formatDate } from "../utils/dateFormater";
import { useTheme } from "../contexts/theme/useTheme";

export default function AppointmentCard({ appointment, onCancel, onEdit }) {
  const { theme } = useTheme();
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
    <View style={[styles.card, theme.shadows.large, { backgroundColor: theme.colors.cardColor }]}>

      <View>
        <Image
          source={{ uri: getImageUri() }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      <View>
        <Text style={[styles.subtitle, { color: theme.colors.text }]}>
          Appointment:
          <Text style={[styles.itemName, { color: theme.colors.text }]}>
            {" "}
            {item?.name || appointment.type}{" "}
          </Text>
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.text }]}>
          Type:
          <Text style={[styles.itemName, { color: theme.colors.text }]}>
            {" "}
            {appointment?.type}
          </Text>
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.text }]}>
          Date:
          <Text style={[styles.itemName, { color: theme.colors.text }]}>
            {appointment?.date && formatDate(appointment.date)}
          </Text>
        </Text>
      </View>

      <View style={styles.buttonPanel}>
        <Button
          style={[styles.cancelButton]}
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
    flexDirection: "row",
    alignItems:"flex-center",
    justifyContent:"space-around",
    width: 'auto',
    height: 90,
    borderRadius: 12,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 10,
    fontWeight: "800",
    margin: 4,
  },
  itemName: {
    fontSize: 12,
    fontWeight: "400",
    marginBottom: 4,
  },
  buttonPanel: {
    flexDirection: "column",
    justifyContent: "flex-end",
   
  },
  buttonText: {
    color: "#fff",
    fontWeight: "300",
    fontSize:10,
  },
  cancelButton: {
    height: 30,
    width: 80,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: "#c25555",
  },
  editButton: {
    height: 30,
    width: 80,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#4A7C59",
  },
  image: {
    marginTop:10,
    width: "80%",
    height: 60,
    width: 60,
    borderRadius: 8,
    
  },
});
