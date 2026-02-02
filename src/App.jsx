import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";

import RootNaviagtor from "./navigation/RootNavigator";

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <RootNaviagtor />
    </NavigationContainer>
  );
}
