import { Image } from "expo-image";
import { Text, View, StyleSheet, Alert, ActivityIndicator } from "react-native";
import * as appointmentsService from "../../services/appointmentsService";
import Calendar from "../../components/Calendar";
import { useState, useEffect } from "react";
import { useTheme } from "../../contexts/theme/useTheme";

export default function EditAppointmentScreen({ route, navigation }) {
  const { data } = route.params;
  const [isLoading, setIsLoading] = useState(false);
  const [appointment, setAppointment] = useState(null);
  const { theme } = useTheme()

  useEffect(() => {
    const loadAppointment = async () => {
      try {
        const result = await appointmentsService.getById(
          data.itemId,
          data.type,
          data.userId
        );

        setAppointment({
          ...result,
          appointmentId: data.id,
        });
        
      } catch (err) {
        Alert.alert("Error", err.message);
      }
    };

    loadAppointment();
  }, []);

  const onEditHandler = (date) => {
    Alert.alert(
      "Save Changes",
      `Change appointment to ${date.toLocaleString()}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => navigation.goBack(),
        },
        {
          text: "Confirm",
          onPress: async () => {
            try {
              setIsLoading(true);
              await appointmentsService.edit({ ...appointment, id: data.id }, { date });

              Alert.alert("Success", "Appointment updated successfully!");

              navigation.pop(1)
            } catch (err) {
              Alert.alert("Error", err.message);
            } finally {
              setIsLoading(false);
            }
          },
        },
      ],
      { cancelable: false },
    );
  };

  if (!appointment) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
        <Image
          source={{ uri: appointment?.imageUrl }}
          style={styles.image}
          contentFit="cover"
        />

        <Text style={[styles.title, { color: theme.colors.primary }]}>
          {appointment.name || appointment.title}
        </Text>
      </View>

      <Calendar
        data={appointment}
        onPress={onEditHandler}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    alignItems: "center",
    alignSelf: "center",
    width: 220,
    margin: 20,
    padding: 30,
    borderRadius: 18,
  },

  image: {
    width: 200,
    height: 180,
    borderRadius: 12,
    marginBottom: 12,
  },

  title: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
