import { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Image,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from "react-native";

import { useTheme } from "../../contexts/theme/useTheme";
import useAuth from "../../contexts/auth/useAuth";
import { createScanFeedback } from "../../services/foodScanningService";

export default function FeedbackScreen({ route, navigation }) {
    const { theme } = useTheme();
    const { user } = useAuth();
    const { uri, predictedFood, confidence, status } = route.params;
    const [correctFood, setCorrectFood] = useState("");
    const [loading, setLoading] = useState(false);

    const confidenceMap = {
        low_confidence: "We are not confident enough about this food. Please help us identify it.",
        food_not_found: "The food is not yet part of our Ayurveda knowledge base.",
        unsupported_food: "This food is currently unsupported.",
    };

    const message = confidenceMap[status];

    const handleSubmit = async () => {
        if (!correctFood.trim()) {
            Alert.alert("Please enter the correct food");
            return;
        }

        try {
            setLoading(true);

            await createScanFeedback({
                userId: user.id,
                uri,
                predictedFood,
                confidence,
                status: "pending",
                correctFood: correctFood.trim().toLowerCase(),
            });

            Alert.alert(
                "Thank you!",
                "Your feedback will help improve the AI model.",
                [{ text: "OK", onPress: () => navigation.navigate("Scan History") }]
            );

        } catch (error) {
            Alert.alert("Error", error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 120 : 0}
        >
            <ScrollView
                contentContainerStyle={[
                    styles.container,
                    { backgroundColor: theme.colors.background }
                ]}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <Text style={[styles.title, { color: theme.colors.primary }]}>
                    Wrong prediction?
                </Text>

                <Text style={[styles.subtitle, { color: theme.colors.text }]}>
                    Help improve the AI by entering the correct food.
                </Text>

                <Image source={{ uri }} style={styles.image} />

                <View style={[styles.predictionBox, { backgroundColor: theme.colors.card }]}>
                    <Text style={[styles.predictionLabel, { color: theme.colors.secondaryText }]}>
                        AI Prediction
                    </Text>
                    <Text style={[styles.predictionFood, { color: theme.colors.text }]}>
                        {predictedFood}
                    </Text>
                    <Text style={[styles.confidence, { color: theme.colors.secondaryText }]}>
                        Confidence: {confidence}%
                    </Text>
                    {message && (
                        <Text style={[styles.message, { color: theme.colors.secondaryText }]}>
                            {message}
                        </Text>
                    )}
                </View>

                <TextInput
                    placeholder="Enter correct food..."
                    placeholderTextColor="#999"
                    value={correctFood}
                    onChangeText={setCorrectFood}
                    style={[styles.input, { backgroundColor: theme.colors.card, color: theme.colors.text }]}
                    autoCapitalize="none"
                    returnKeyType="done"
                />

                <TouchableOpacity
                    style={[styles.button, { backgroundColor: theme.colors.primary }]}
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>
                        {loading ? "Saving..." : "Submit Feedback"}
                    </Text>
                </TouchableOpacity>

            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 18,
    },
    title: {
        fontSize: 28,
        fontWeight: "700",
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 14,
        textAlign: "center",
        marginBottom: 24,
        lineHeight: 20,
    },
    image: {
        width: "100%",
        height: 280,
        borderRadius: 22,
        marginBottom: 20,
    },
    predictionBox: {
        width: "100%",
        padding: 18,
        borderRadius: 18,
        marginBottom: 20,
        alignItems: "center",
        gap: 6,
    },
    predictionLabel: {
        fontSize: 14,
        marginBottom: 6,
    },
    predictionFood: {
        fontSize: 22,
        fontWeight: "700",
        textTransform: "capitalize",
    },
    confidence: {
        marginTop: 4,
        fontSize: 14,
    },
    message: {
        marginTop: 8,
        fontSize: 13,
        textAlign: "center",
        lineHeight: 20,
    },
    input: {
        width: "100%",
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 20,
        fontSize: 14,
        marginBottom: 18,
    },
    button: {
        width: "100%",
        paddingVertical: 16,
        borderRadius: 18,
        alignItems: "center",
        marginBottom: 32,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
    },
});