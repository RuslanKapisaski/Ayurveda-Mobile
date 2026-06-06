import { View, Text, StyleSheet, Touchable, TouchableOpacity } from "react-native";
import { Image } from "expo-image"
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/theme/useTheme";
import Button from "./Button";

const doshaColor = {
    beneficial: { bg: "#e1f5ee", text: "#0f6e56" },
    neutral: { bg: "#faeeda", text: "#854f0b" },
    avoid: { bg: "#fcebeb", text: "#a32d2d" },
};

const doshaIcon = {
    Vata: "water-outline",
    Pitta: "flame-outline",
    Kapha: "water-outline",
};


export default function AnalyzedFoodCard({
    scanResult,
    userDosha,
    allergies = [],
    isLoadingUser,
    userError,
    onAddToMeals,
    onCancel,
    saving

}) {
    const { theme } = useTheme();

    return (
        <View style={[styles.card, { backgroundColor: theme.colors.card }]}>

            <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
                <Image
                    source={{ uri: scanResult.uri }}
                    style={styles.image}
                    contentFit={'cover'}
                    cachePolicy={'memory-disk'}
                    transition={300}
                />

                <View style={styles.headerInfo}>
                    <Text style={[styles.foodName, { color: theme.colors.text }]}>
                        {scanResult.food}
                    </Text>
                    <Text style={[styles.foodLabel, { color: theme.colors.secondaryText }]}>
                        Food identified
                    </Text>
                </View>

                <View style={styles.confidenceBadge}>
                    <Text style={styles.confidenceValue}>
                        {Math.round(scanResult.confidence)}%
                    </Text>
                    <Text style={styles.confidenceLabel}>match</Text>
                </View>
            </View>

            {userDosha && (
                <View style={[styles.section, { borderBottomColor: theme.colors.border }]}>
                    <Text style={[styles.sectionLabel, { color: theme.colors.secondaryText }]}>
                        YOUR DOSHA
                    </Text>
                    <View style={styles.doshaRow}>
                        <Text style={[styles.doshaName, { color: theme.colors.text }]}>
                            {userDosha?.dominant || userDosha}
                        </Text>
                        <View style={styles.doshaIconCircle}>
                            <Ionicons
                                name={doshaIcon[userDosha?.dominant] || "leaf-outline"}
                                size={20}
                                color="#0f6e56"
                            />
                        </View>
                    
                    </View>
                </View>
            )}

            <View style={[styles.section, { borderBottomColor: theme.colors.border }]}>
                <Text style={[styles.sectionLabel, { color: theme.colors.secondaryText }]}>
                    DOSHA RECOMMENDATIONS
                </Text>
                {Object.entries(scanResult?.dosha_recommendation || {}).map(([dosha, value]) => (
                    <View key={dosha} style={styles.recommendationRow}>
                        <Text style={[styles.recommendationDosha, { color: theme.colors.text }]}>
                            {dosha.charAt(0).toUpperCase() + dosha.slice(1)}
                        </Text>

                        <View style={[styles.pill, { backgroundColor: doshaColor[value]?.bg || "#eee" }]}>
                            <Text style={[styles.pillText, { color: doshaColor[value]?.text || "#888" }]}>
                                {value}
                            </Text>
                        </View>
                    </View>
                ))}
            </View>

            {allergies.length > 0 && (
                <View style={styles.section}>
                    <Text style={[styles.sectionLabel, { color: theme.colors.secondaryText }]}>
                        ALLERGIES
                    </Text>
                    <View style={styles.allergiesRow}>
                        {allergies.map((allergy, index) => (
                            <View key={index} style={styles.allergyPill}>
                                <Ionicons name="warning-outline" size={13} color="#a32d2d" />
                                <Text style={styles.allergyText}>{allergy}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            )}

       

            <View style={styles.previewActions}>
                <TouchableOpacity
                    onPress={onCancel}
                    style={styles.actionButton}
                    disabled={saving}
                >
                    <Ionicons
                        name="close-circle-outline"
                        size={28}
                        color="#E53935"
                    />
                    <Text style={styles.actionText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={onAddToMeals}
                    style={styles.actionButton}
                    disabled={saving}
                >
                    <Ionicons
                        name="checkmark-circle-outline"
                        size={28}
                        color="#096c16"
                    />
                    <Text style={styles.actionText}>{saving ? "Saving..." : "Add To Meals"}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        width: "100%",
        borderRadius: 20,
        overflow: "hidden",
        marginTop: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        gap: 12,
        borderBottomWidth: 0.5,
    },
    image: {
        width: 100,
        height: 80,
        borderRadius: 12,
    },
    headerInfo: {
        flex: 1,
    },
    foodName: {
        fontSize: 18,
        fontWeight: "600",
        textTransform: "capitalize",
    },
    foodLabel: {
        fontSize: 13,
        marginTop: 2,
    },
    confidenceBadge: {
        backgroundColor: "#e1f5ee",
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
        alignItems: "center",
    },
    confidenceValue: {
        fontSize: 16,
        fontWeight: "600",
        color: "#0f6e56",
    },
    confidenceLabel: {
        fontSize: 11,
        color: "#0f6e56",
    },

    section: {
        padding: 16,
        borderBottomWidth: 0.5,
    },
    sectionLabel: {
        fontSize: 11,
        fontWeight: "600",
        letterSpacing: 0.5,
        marginBottom: 12,
    },
    buttonSection: {
        flex: "row",
        backgroundColor: "red",
        justifyContent: "space-around",
        alignItems: "center",

    },
    doshaRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    doshaIconCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "#e1f5ee",
        alignItems: "center",
        justifyContent: "center",
    },
    doshaName: {
        fontSize: 16,
        fontWeight: "500",
    },

    recommendationRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    recommendationDosha: {
        fontSize: 15,
    },
    pill: {
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 4,
    },
    pillText: {
        fontSize: 13,
        fontWeight: "500",
    },

    allergiesRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
    allergyPill: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        backgroundColor: "#fcebeb",
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 4,
    },
    allergyText: {
        fontSize: 13,
        color: "#a32d2d",
        fontWeight: "500",
    },
    previewActions: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        marginTop: 20,
        gap: 1,
    },
    actionButton: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 18,
        marginBottom: 28,
        marginHorizontal: 8,
        borderRadius: 16,
        backgroundColor: "#F5F5F5",
    },

    actionText: {
        marginTop: 4,
        fontSize: 14,
        fontWeight: "600",
        color: "#333",
    },
});