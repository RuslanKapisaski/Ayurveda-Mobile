import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import HomeNavigator from "./HomeNavigator";
import MyProfileScreen from "../screens/MyProfileScreen";
import AppointmentsScreen from "../screens/AppointmentsScreen";
import ProgramsScreen from "../screens/ProgramsScreen";
import TherapiesNavigator from "./TherapiesNavigator";

const Tabs = createBottomTabNavigator();

export default function RootNavigator() {
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
        component={AppointmentsScreen}
        options={{
          tabBarLabel: "Appointments",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="documents" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        options={{
          tabBarIcon: ({ color, size }) => (
          ),
        }}
      />

      <Tabs.Screen
        name="Profile"
        component={MyProfileScreen}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs.Navigator>
  );
}
