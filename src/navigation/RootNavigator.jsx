import { ActivityIndicator, StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { navigationRef } from "./navigationRef";
import AppNavigator from "./AppNavigator";
import OnBoardingNavigator from "./OnBoardingNavigator";
import AuthNavigator from "./AuthNavigator";
import useAuth from "../contexts/auth/useAuth";
import { useTheme } from "../contexts/theme/useTheme";

export default function RootNavigator() {
  const { isAuthenticated, isLoading, hasCompletedOnBoarding } = useAuth();
  const { theme, isDarkMode } = useTheme();

  return (
    <NavigationContainer theme={theme} ref={navigationRef}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      {!isAuthenticated ? (
        <AuthNavigator />
      ) : !hasCompletedOnBoarding ? (
        <OnBoardingNavigator />
      ) : (
        <AppNavigator />
      )}
    </NavigationContainer>
  );
}
