import { useEffect, useState } from "react";
import { View, Text,StyleSheet } from "react-native";
import { useTheme } from "../../contexts/theme/useTheme";
import useAuth from "../../contexts/auth/useAuth";
import AnalyzedFoodCard from "../../components/AnalyzedFoodCard";
import useFetchUserData from "../../hooks/useFetchUserData";
import * as scanService from "../../services/foodScanningService";

export default function AnalyzeScreen({ route, navigation }) {
    const { scanResult } = route.params;
    const { user } = useAuth()
    const { theme } = useTheme();
    const { allergies, firestoreUser, loadUserData, isLoading, error } = useFetchUserData(user?.uid);
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        if (user?.uid) loadUserData();
    }, [user?.uid]);

    console.log(`Scan result: ${scanResult}`)
    console.log('dosha_recommendation:', JSON.stringify(scanResult?.dosha_recommendation))

    const handleAddToMeals = async () => {
        setSaving(true)
        try {
            const imageUrl = await scanService.uploadImage(scanResult.uri, user.id);

            const analyzeData = {
                userId: user.id,
                food: scanResult.food,
                confidence: scanResult.confidence,
                dosha: scanResult.dosha_recommendation,
                imageUrl,
            }

            await scanService.create(analyzeData)

            navigation.navigate("Scan History");

        } catch (error) {
            alert("Error saving: " + error.message);
        }
        finally {
            setSaving(false)
        }

    }

    return (
        <View
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
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
     alignItems:"center",
     justifyContent:"center"   
    }
});