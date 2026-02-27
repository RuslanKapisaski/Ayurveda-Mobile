import { createNativeStackNavigator } from "@react-navigation/native-stack";

import EditAppointmentsScreen from "../screens/appointments/EditAppointmentsScreen";
import AppointmentsScreen from "../screens/appointments/AppointmentsScreen";

export default function AppointmentsNavigator() {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AppointmentScreen" component={AppointmentsScreen} />
      <Stack.Screen
        name="EditAppointments"
        component={EditAppointmentsScreen}
      />
    </Stack.Navigator>
  );
}
