import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import HomeNavigator from "./HomeNavigator";
import MyProfileScreen from "../screens/MyProfileScreen";
import ProgramsNavigator from "./ProgramsNavigator";
import TherapiesNavigator from "./TherapiesNavigator";
import AppointmentsNavigator from "./AppointemntsNavigator";
import ScanNaviagator from "./ScanNavigator";

import { useTheme } from "../contexts/theme/useTheme";
import ThemeButton from "../components/ThemeButton";

export default function AppNavigator() {
  const Tabs = createBottomTabNavigator();

  const { theme, toggleTheme,isDarkMode } = useTheme();

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
      name="Scan"
      component={ScanNaviagator}
      options={{
        headerRight: () =>(
          <ThemeButton toggleTheme={toggleTheme} isDark={isDarkMode}/>
        ),
        tabBarIcon: (({color,size}) =>(
          <Ionicons name="scan-circle-outline" size={size} color={color}/>
        )),
        headerTitle: "Scan Food",
        tabBarIconStyle: {marginTop: -2},
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
          ),
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs.Navigator>
  );
}
