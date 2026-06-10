import { View, Text, StyleSheet, Touchable, TouchableOpacity, ScrollView } from "react-native";
import { Image } from "expo-image"
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/theme/useTheme";
import Button from "./Button";
import { ThemeContext } from "@react-navigation/native";

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
    saving,
    readOnly = false

}) {
    const { theme } = useTheme();

    const alternatives = scanResult?.alternatives || [];
    const allergens = scanResult?.allergens || [];
    const properties = scanResult?.properties || [];

    return (
        <View style={[styles.card, theme.shadows.medium, { backgroundColor: theme.colors.cardColor }]}>

            <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
                <Image
                    source={{ uri: scanResult.uri || scanResult.imageUrl }}
                    style={styles.image}
                    contentFit={'cover'}
                    cachePolicy={'memory-disk'}
                    transition={300}
                />

                <View style={styles.headerInfo}>
                    <Text style={[styles.foodName, { color: theme.colors.text }]}>
                        {scanResult.food}
                    </Text>
                    <Text style={[styles.foodLabel, { color: theme.colors.primary }]}>
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
                    <Text style={[styles.sectionLabel, { color: theme.colors.primary }]}>
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

            {scanResult?.explanation && (
                <View style={[styles.section, { borderBottomColor: theme.colors.border }]}>
                    <Text style={[styles.sectionLabel, { color: theme.colors.primary }]}>
                        EXPLANATION
                    </Text>
                    <Text style={[styles.explanationText, { color: theme.colors.text }]}>
                        {scanResult.explanation}
                    </Text>
                </View>
            )}

            {alternatives.length > 0 && (
                <View style={[styles.section, { borderBottomColor: theme.colors.border }]}>
                    <Text style={[styles.sectionLabel, { color: theme.colors.primary }]}>
                        ALTERNATIVES
                    </Text>

                    {alternatives.map((item) => (
                        <Text key={item} style={[styles.contentText, { color: theme.colors.text }]}>
                            • {item}
                        </Text>
                    ))}
                </View>
            )}

            {allergens.length > 0 && (
                <View style={[styles.section, { borderBottomColor: theme.colors.border }]}>
                    <Text style={[styles.sectionLabel, { color: theme.colors.primary }]}>
                        ALLERGENS
                    </Text>

                    <View style={styles.allergiesRow}>
                        {allergens.map((item) => (
                            <View key={item} style={styles.allergyPill}>
                                <Ionicons name="warning-outline" size={13} color="#a32d2d" />
                                <Text style={[styles.allergyText, styles.contentText,]}>{item}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            )}

            {properties.length > 0 && (
                <View style={[styles.section, { borderBottomColor: theme.colors.border }]}>
                    <Text style={[styles.sectionLabel, { color: theme.colors.primary }]}>
                        PROPERTIES
                    </Text>

                    <View style={styles.allergiesRow}>
                        {properties.map((item) => (
                            <View key={item} style={styles.propertyPill}>
                                <Text style={[styles.contentText, { color: theme.colors.text }]}>{item}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            )}


            {!readOnly && <View style={styles.previewActions}>
                <TouchableOpacity
                    onPress={onCancel}
                    style={[styles.actionButton, theme.shadows.large, { backgroundColor: theme.colors.background }]}
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
                    style={[styles.actionButton, theme.shadows.large, { backgroundColor: theme.colors.background }]}
                    disabled={saving}
                >
                    <Ionicons
                        name="checkmark-circle-outline"
                        size={28}
                        color="#096c16"
                    />
                    <Text style={styles.actionText}>{saving ? "Saving..." : "Add To Meals"}</Text>
                </TouchableOpacity>
            </View>}

        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        width: "90%",
        borderRadius: 20,
        overflow: "scroll",
        margin: "auto",
        marginBottom: 10,
    },
    contentText: {
        textTransform: "capitalize",
        fontWeight: "400",
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
        fontSize: 18,
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
        marginBottom: 4,
    },
    sectionLabel: {
        fontSize: 14,
        fontWeight: "800",
        letterSpacing: 0.8,
        marginBottom: 14,
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
    explanationText: {
        fontStyle: "italic",
        fontWeight: "300",
        fontSize: 15,
        lineHeight: 22,
    },
    recommendationDosha: {
        fontSize: 15,
    },
    pill: {
        borderRadius: 30,
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
        paddingVertical: 12,
        marginBottom: 28,
        marginHorizontal: 16,
        borderRadius: 20,
    },

    actionText: {
        marginTop: 4,
        fontSize: 14,
        fontWeight: "600",
        color: "#777474"
    },
});