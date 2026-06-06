import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./contexts/auth/AuthProvider";
import RootNavigator from "./navigation/RootNavigator";
import ThemeProvider from "./contexts/theme/ThemeProvider";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NotificationsProvider } from "./contexts/notifications/NotificationsProvider";

export default function App() {
  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <AuthProvider>
          <NotificationsProvider>
            <RootNavigator />
          </NotificationsProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
