import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "../screens/HomeScreen";
import DetailsScreen from "../screens/DetailsScreen";
import ReservationScreen from "../screens/ReservationScreen";
import QusetionUsScreen from "../screens/QuestionUsScreen";

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
        name="DetailsScreen"
        component={DetailsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ReservationScreen"
        component={ReservationScreen}
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
