import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "../screens/HomeScreen";
import QusetionUsScreen from "../screens/QuestionUsScreen";
import CheckupScreen from "../screens/CheckupScreen";

export default function HomeNavigator() {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Checkup"
        component={CheckupScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="QuestioUsScreen"
        component={QusetionUsScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
