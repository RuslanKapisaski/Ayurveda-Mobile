import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useTheme } from "../../contexts/theme/useTheme";
import useAuth from "../../contexts/auth/useAuth";
import AnalyzedFoodCard from "../../components/AnalyzedFoodCard";
import useFetchUserData from "../../hooks/useFetchUserData";
import * as scanService from "../../services/foodScanningService";
import { useNotifications } from "../../contexts/notifications/NotificationContext";

export default function AnalyzeScreen({ route, navigation }) {
    const { scanResult } = route.params;
    const { user } = useAuth()
    const { theme } = useTheme();
    const { allergies, firestoreUser, loadUserData, isLoading, error } = useFetchUserData(user?.uid);
    const [saving, setSaving] = useState(false)
    const { sendLocalNotification } = useNotifications()

    useEffect(() => {
        if (user?.uid) loadUserData();
    }, [user?.uid]);

    const handleAddToMeals = async () => {
        setSaving(true)
        try {
            const imageUrl = await scanService.uploadImage(scanResult.uri, user.id);

            const mealData = {
                userId: user.id,
                food: scanResult.food,
                confidence: scanResult.confidence,
                dosha: scanResult.dosha,
                explanation: scanResult.explanation || null,
                alternatives: scanResult.alternatives || [],
                allergens: scanResult.allergens || [],
                properties: scanResult.properties || [],
            };

            await scanService.create({
                ...mealData,
                imageUrl,
            });

            await sendLocalNotification(
                "Scan saved!",
                `${scanResult.food} has been added to your meal history.`
            )

            navigation.navigate("Scan History");

        } catch (error) {
            alert("Error saving: " + error.message);
        }
        finally {
            setSaving(false)
        }

    }

    return (
        <ScrollView
            contentContainerStyle={[
                styles.container,
                { backgroundColor: theme.colors.background },
            ]}
        >

            <AnalyzedFoodCard
                scanResult={scanResult}
                userDosha={user?.dosha}
                allergies={allergies}
                isLoadingUser={isLoading}
                userError={error}
                onAddToMeals={handleAddToMeals}
                onCancel={() => navigation.pop(2)}
                saving={saving}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 20,
    }
});