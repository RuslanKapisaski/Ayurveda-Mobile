import { createNativeStackNavigator } from "@react-navigation/native-stack";
import useAuth from "../auth/useAuth";
import RootNavigator from "./RootNavigator";
import AuthNavigator from "./AuthNavigator";
import { ActivityIndicator } from "react-native";
import OnBoardingNavigator from "./OnBoardingNavigator";

export default function AppNavigator() {
  const { isAuthenticated, isLoading, hasCompletedOnBoarding } = useAuth();

  if (isLoading) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  if (!isAuthenticated) {
    return <AuthNavigator />;
  }

  if (!hasCompletedOnBoarding) {
    return <OnBoardingNavigator />;
  }

  return <RootNavigator />;
}
