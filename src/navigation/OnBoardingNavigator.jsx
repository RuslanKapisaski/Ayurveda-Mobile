import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WelcomeScreen from "../screens/onBoarding/WelcomeScreen";
import AboutAyurvedaScreen from "../screens/onBoarding/AboutAyurvedaScreen";
import GoalsScreen from "../screens/onBoarding/GoalsScreen";
import DoshaIntroScreen from "../screens/onBoarding/DoshaIntroScreen";
import DoshaTestScreen from "../screens/onBoarding/DoshaTestScreen";
import DoshaResultScreen from "../screens/onBoarding/DoshaResultScreen";
import CompleteScreen from "../screens/onBoarding/CompleteScreen";

export default function OnBoardingNavigator() {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="AboutAyurveda" component={AboutAyurvedaScreen} />
      <Stack.Screen name="Goals" component={GoalsScreen} />
      <Stack.Screen name="DoshaIntro" component={DoshaIntroScreen} />
      <Stack.Screen name="DoshaTest" component={DoshaTestScreen} />
      <Stack.Screen name="DoshaResult" component={DoshaResultScreen} />
      <Stack.Screen name="Comple" component={CompleteScreen} />
    </Stack.Navigator>
  );
}
