import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ProgramsScreen from "../screens/programs/ProgramsScreen";
import ProgramDetailsScreen from "../screens/programs/ProgramsDetailsScreen";
import BookingScreen from "../screens/BookingScreen";

export default function ProgramsNavigator() {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator>
      <Stack.Screen name="ProgramsScreen" component={ProgramsScreen} />

      <Stack.Screen name="ProgramDetails" component={ProgramDetailsScreen} />

      <Stack.Screen name="Booking" component={BookingScreen} />
    </Stack.Navigator>
  );
}
