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
    const {
        uri,
        predictedFood,
        confidence,
        status
    } = route.params;
    const [correctFood, setCorrectFood] = useState("");
    const [loading, setLoading] = useState(false);

    const confidenceMap = {
    low_confidence:
        "We are not confident enough about this food. Please help us identify it.",

    food_not_found:
        "The food is not yet part of our Ayurveda knowledge base.",

    unsupported_food:
        "This food is currently unsupported.",
};

    const message = confidenceMessages.map((m) => m === status)

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
                "Your feedback will help improve the AI model."
            );

            navigation.navigate("Scan History", {
                scanResult: {
                    userId: user.id,
                    food: correctFood.trim().toLowerCase(),
                    confidence: 100,
                    dosha: null,
                    uri,
                    isUserCorrected: true,
                }
            });

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
        >

            <ScrollView
                style={[
                    styles.container,
                    { backgroundColor: theme.colors.background }
                ]}
            >

                <Text
                    style={[
                        styles.title,
                        { color: theme.colors.primary }
                    ]}
                >
                    Wrong prediction?
                </Text>

                <Text
                    style={[
                        styles.subtitle,
                        { color: theme.colors.text }
                    ]}
                >
                    Help improve the AI by entering the correct food.
                </Text>

                <Image
                    source={{ uri: uri }}
                    style={styles.image}
                />

                <View style={styles.predictionBox}>

                    <Text style={styles.predictionLabel}>
                        AI Prediction
                    </Text>

                    <Text style={styles.predictionFood}>
                        {predictedFood}
                    </Text>

                    <Text style={styles.confidence}>
                        Confidence: {confidence}%
                    </Text>

                    <Text style={styles.predictedFood}>{message}</Text>

                </View>

                <TextInput
                    placeholder="Enter correct food..."
                    placeholderTextColor="#999"
                    value={correctFood}
                    onChangeText={setCorrectFood}
                    style={styles.input}
                />

                <TouchableOpacity
                    style={[
                        styles.button,
                        { backgroundColor: theme.colors.primary }
                    ]}
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
        flex: 1,
        padding: 24,
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
        backgroundColor: "#F4F4F4",
        marginBottom: 20,
        alignItems: "center",
    },

    predictionLabel: {
        fontSize: 14,
        color: "#777",
        marginBottom: 6,
    },

    predictionFood: {
        fontSize: 22,
        fontWeight: "700",
        color: "#222",
    },

    confidence: {
        marginTop: 8,
        fontSize: 14,
        color: "#666",
    },

    input: {
        width: "100%",
        backgroundColor: "#F4F4F4",
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        marginBottom: 18,
        color: "#111",
    },

    button: {
        width: "100%",
        paddingVertical: 16,
        borderRadius: 18,
        alignItems: "center",
    },

    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
    },
});