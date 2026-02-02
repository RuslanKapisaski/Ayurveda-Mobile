import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import HomeNavigator from "./HomeNavigator";
import AboutUsScreen from "../screens/AboutUsScreen";

export default function RootNaviagtor() {
  const Tabs = createBottomTabNavigator();

  return (
    <Tabs.Navigator>
      <Tabs.Screen name="Home" component={HomeNavigator} />

      <Tabs.Screen name="About Us" component={AboutUsScreen} />
    </Tabs.Navigator>
  );
}
