import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ProgramsScreen from "../screens/programs/ProgramsScreen";
import ProgramDetailsScreen from "../screens/programs/ProgramsDetailsScreen";
import BookingScreen from "../screens/BookingScreen";
import ThemeButton from "../components/ThemeButton";
import { useTheme } from "../contexts/theme/useTheme";

export default function ProgramsNavigator() {
  const Stack = createNativeStackNavigator();

  const { toggleTheme, isDarkMode } = useTheme();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProgramsScreen"
        component={ProgramsScreen}
        options={{
          headerRight: () => (
            <ThemeButton toggleTheme={toggleTheme} isDarkMode />
          ),
        }}
      />

      <Stack.Screen
        name="ProgramDetails"
        component={ProgramDetailsScreen}
        options={{
          headerRight: () => (
            <ThemeButton toggleTheme={toggleTheme} isDarkMode />
          ),
        }}
      />

      <Stack.Screen
        name="Booking"
        component={BookingScreen}
        options={{
          headerRight: () => (
            <ThemeButton toggleTheme={toggleTheme} isDarkMode />
          ),
        }}
      />
    </Stack.Navigator>
  );
}
