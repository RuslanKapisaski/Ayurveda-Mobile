import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import HomeNavigator from "./HomeNavigator";
import MyProfileScreen from "../screens/MyProfileScreen";
import ProgramsNavigator from "./ProgramsNavigator";
import TherapiesNavigator from "./TherapiesNavigator";
import AppointmentsNavigator from "./AppointemntsNavigator";

const Tabs = createBottomTabNavigator();

import { useTheme } from "../contexts/theme/useTheme";

export default function RootNavigator() {
  const { theme, isDarkMode } = useTheme();

  return (
    <Tabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#118161",
        tabBarInactiveTintColor: "#888",
        tabBarLabelStyle: { fontSize: 10, fontWeight: "600" },
      }}
    >
      <Tabs.Screen
        name="HomeTab"
        component={HomeNavigator}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="TherapiesStack"
        component={TherapiesNavigator}
        options={{
          tabBarLabel: "Therapies",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="analytics" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="Appointments"
        component={AppointmentsNavigator}
        options={{
          tabBarLabel: "Appointments",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="documents" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="Programs"
        component={ProgramsNavigator}
        options={{
          tabBarLabel: "Programs",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="scale" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Profile"
        component={MyProfileScreen}
        options={{
          headerRight: () => (
            <ThemeButton toggleTheme={toggleTheme} isDark={isDarkMode} />
          ), // Тук коригираме пропса
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs.Navigator>
  );
}
