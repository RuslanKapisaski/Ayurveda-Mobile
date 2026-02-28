import { useState } from "react";
import { View, StyleSheet, Alert, ActivityIndicator } from "react-native";
import * as appointmentsService from "../../services/appointmentsService";
import Calendar from "../../components/Calendar";

export default function EditAppointmentScreen({ route, navigation }) {
  const { appointment } = route.params;

  const [isLoading, setIsLoading] = useState(false);

  const onEditHandler = (date) => {
    Alert.alert(
      "Save Changes",
      `Change appointment to ${date.toLocaleString()}?`,
      [
        { text: "Cancel", onPress: navigation.goBack(), style: "cancel" },
        {
          text: "Confirm",
          onPress: async () => {
            try {
              setIsLoading(true);

              await appointmentsService.edit(appointment, {
                date: date.toISOString(),
              });

              Alert.alert("Success", "Appointment updated successfully!");

              navigation.navigate("AppointmentScreen", {
                appointmentData: {
                  ...appointment,
                  date: date.toISOString(),
                },
              });
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
    <View style={styles.container}>
      <Calendar data={appointment} onPress={onEditHandler} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: "center",
  },
});
