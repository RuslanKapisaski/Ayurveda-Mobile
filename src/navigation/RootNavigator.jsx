import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text } from "react-native";

import HomeNavigator from "./HomeNavigator";
import { NavigationContainer } from "@react-navigation/native";

export default function RootNaviagtor() {
  const Tabs = createBottomTabNavigator();

  return (
    <Tabs.Navigator>

      <Tabs.Screen name="Home" component={HomeNavigator} />
      
      <Tabs.Screen
        name="Therapies"
        component={() => <Text>Your Therapies</Text>}
      />

      <Tabs.Screen
        name="Medicines"
        component={() => <Text>Your Medicines</Text>}
      />

      <Tabs.Screen
        name="Progress"
        component={() => <Text>Your Progress</Text>}
      />
    </Tabs.Navigator>
  );
}
