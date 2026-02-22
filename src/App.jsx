import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";

// import RootNaviagtor from "./navigation/RootNavigator";
import { AuthProvider } from "./auth/AuthProvider";
import AppNavigator from "./navigation/AppNavigator";

export default function App() {
  return (
    <NavigationContainer>
        <StatusBar style="auto" />
      <AuthProvider>
      </AuthProvider>
    </NavigationContainer>
  );
}
