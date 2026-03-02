import { createNativeStackNavigator } from "@react-navigation/native-stack";

import EditAppointmentsScreen from "../screens/appointments/EditAppointmentsScreen";
import AppointmentsScreen from "../screens/appointments/AppointmentsScreen";
import ThemeButton from "../components/ThemeButton";
import { useTheme } from "../contexts/theme/useTheme";

export default function AppointmentsNavigator() {
  const Stack = createNativeStackNavigator();

  const { toggleTheme, isDarkMode } = useTheme();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Appointments"
        component={AppointmentsScreen}
        options={{
          headerRight: () => (
            <ThemeButton toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
          ),
        }}
      />
      <Stack.Screen
        name="Edit"
        component={EditAppointmentsScreen}
        options={{
          headerRight: () => (
            <ThemeButton toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
          ),
        }}
      />
    </Stack.Navigator>
  );
}
