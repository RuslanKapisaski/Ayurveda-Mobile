import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ThemeButton from "../components/ThemeButton";
import { useTheme } from "../contexts/theme/useTheme";

import ScanScreen from "../screens/scan/ScanScreen";
import HistoryScreen from "../screens/scan/HistoryScreen";
import ScanHomeScreen from "../screens/scan/ScanHomeScreen";
import AnalyzeScreen from "../screens/scan/AnalyzeScreen";
import FeedbackScreen from "../screens/scan/FeedbackScreen";


export default function ScanNaviagator() {

    const { toggleTheme, isDarkMode } = useTheme()

    const Stack = createNativeStackNavigator()

    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Home"
                component={ScanHomeScreen}
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="Scan"
                component={ScanScreen}
                options={
                    {
                        headerRight: () => {
                            return <ThemeButton isDark={isDarkMode} toggleTheme={toggleTheme} />
                        }
                    }
                }
            />

            <Stack.Screen
                name="Analyze"
                component={AnalyzeScreen}
                options={
                    {
                        headerRight: () => {
                            return <ThemeButton isDark={isDarkMode} toggleTheme={toggleTheme} />
                        }
                    }
                }

            />

            <Stack.Screen
                name="Scan History"
                component={HistoryScreen}
                options={{
                    headerRight: () => {
                        return <ThemeButton isDark={isDarkMode} toggleTheme={toggleTheme} />
                    }
                }} />

            <Stack.Screen
                name="Feedback"
                component={FeedbackScreen}
                options={{
                    headerRight: () => {
                       return <ThemeButton isDark={isDarkMode} toggleTheme={toggleTheme} />
                    }
                }} />

        </Stack.Navigator>
    )
}