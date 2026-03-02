import useAuth from "../contexts/auth/useAuth";
import RootNavigator from "./RootNavigator";
import AuthNavigator from "./AuthNavigator";
import { ActivityIndicator, StatusBar } from "react-native";
import OnBoardingNavigator from "./OnBoardingNavigator";
import { NavigationContainer } from "@react-navigation/native";
import { useTheme } from "../contexts/theme/useTheme";

export default function AppNavigator() {
  const { isAuthenticated, isLoading, hasCompletedOnBoarding } = useAuth();
  const { theme, isDarkMode } = useTheme();

  return (
    <NavigationContainer theme={theme}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      {!isAuthenticated ? (
        <AuthNavigator />
      ) : !hasCompletedOnBoarding ? (
        <OnBoardingNavigator />
      ) : (
        <RootNavigator />
      )}
    </NavigationContainer>
  );
}
