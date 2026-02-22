import { createNativeStackNavigator } from "@react-navigation/native-stack";
import useAuth from "../auth/useAuth";
import RootNavigator from "./RootNavigator";
import AuthNavigator from "./AuthNavigator";
import { ActivityIndicator } from "react-native";

export default function AppNavigator() {
  const Stack = createNativeStackNavigator();
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <ActivityIndicator
        size="large"
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      />
    );
  }
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <Stack.Screen name="Home" component={RootNavigator} />
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
}
