import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "../screens/HomeScreen";
import CheckupScreen from "../screens/CheckupScreen";
import ThemeButton from "../components/ThemeButton";
import { useTheme } from "../contexts/theme/useTheme";

export default function HomeNavigator() {
  const { toggleTheme, isDarkMode } = useTheme();

  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          headerRight: () => (
            <ThemeButton toggleTheme={toggleTheme} isDark={isDarkMode} />
          ),
          headerTitle: "Ayurveda Mobile",
        }}
      />
      <Stack.Screen
        name="Checkup"
        component={CheckupScreen}
        options={{ headerShown: true }}
      />
    </Stack.Navigator>
  );
}
