import { createNativeStackNavigator } from "@react-navigation/native-stack";

import TherapiesScreen from "../screens/threapies/TherapiesScreen";
import TherapiesDetailsScreen from "../screens/threapies/TherapiesDetailsScreen";
import BookingScreen from "../screens/BookingScreen";
import ThemeButton from "../components/ThemeButton";
import { useTheme } from "../contexts/theme/useTheme";

export default function TherapiesNavigator() {
  const Stack = createNativeStackNavigator();

  const { toggleTheme, isDarkMode } = useTheme();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Therapies"
        component={TherapiesScreen}
        options={{
          headerRight: () => (
            <ThemeButton isDark={isDarkMode} toggleTheme={toggleTheme} />
          ),
        }}
      />

      <Stack.Screen
        name="Details"
        component={TherapiesDetailsScreen}
        options={{
          headerRight: () => (
            <ThemeButton isDark={isDarkMode} toggleTheme={toggleTheme} />
          ),
        }}
      />

      <Stack.Screen
        name="Booking"
        component={BookingScreen}
        options={{
          headerRight: () => (
            <ThemeButton isDark={isDarkMode} toggleTheme={toggleTheme} />
          ),
        }}
      />
    </Stack.Navigator>
  );
}
