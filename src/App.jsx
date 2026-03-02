import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./contexts/auth/AuthProvider";
import AppNavigator from "./navigation/AppNavigator";
import ThemeProvider from "./contexts/theme/ThemeProvider";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function App() {
  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <AuthProvider>
          <AppNavigator />
        </AuthProvider>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
