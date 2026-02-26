import { createNativeStackNavigator } from "@react-navigation/native-stack";

import TherapiesScreen from "../screens/threapies/TherapiesScreen";
import TherapiesDetailsScreen from "../screens/threapies/TherapiesDetailsScreen";
import BookingScreen from "../screens/BookingScreen";

export default function TherapiesNavigator() {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator>
      <Stack.Screen name="Therapies" component={TherapiesScreen} />

      <Stack.Screen name="TherapyDetails" component={TherapiesDetailsScreen} />

      <Stack.Screen name="Booking" component={BookingScreen} />
    </Stack.Navigator>
  );
}
