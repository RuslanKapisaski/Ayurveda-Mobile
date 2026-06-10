import { View, Text, StyleSheet, Pressable } from "react-native"
import { Image } from "expo-image"
import { useTheme } from "../contexts/theme/useTheme"
import { Ionicons } from "@expo/vector-icons"
import { formatDate } from "../utils/dateFormater"

const doshaColor = {
    beneficial: { bg: "#e1f5ee", text: "#0f6e56" },
    neutral: { bg: "#faeeda", text: "#854f0b" },
    avoid: { bg: "#fcebeb", text: "#a32d2d" },
}


export default function ScannedFoodCard({ data, userDosha, onPress }) {
    const { theme } = useTheme()


    const isFeedback = data.type === "feedback"

    const userDoshaRecommendation = userDosha && !isFeedback
        ? data.dosha?.[userDosha.toLowerCase()]
        : null

    const date = data.createdAt?.seconds
        ? new Date(data.createdAt.seconds * 1000).toLocaleDateString()
        : "—"

    return (
        <Pressable onPress={onPress} style={[styles.card, theme.shadows.medium, { backgroundColor: theme.colors.cardColor }]}>
            <View style={styles.row}>
                <Image
                    source={{ uri: data.imageUrl || data.uri }}
                    style={styles.image}
                    contentFit="cover"
                    cachePolicy="memory-disk"
                    transition={300}
                />

                <View style={styles.info}>
                    <Text style={[styles.foodName, { color: theme.colors.text }]}>
                        {data.food}
                    </Text>

                    {isFeedback && (
                        <View style={styles.feedbackBadge}>
                            <Text style={styles.feedbackBadgeText}>User corrected</Text>
                        </View>
                    )}

                    <Text style={[styles.date, { color: theme.colors.text }]}>
                        Date: {date}
                    </Text>
                </View>

                {!isFeedback && (
                    <Text style={[styles.confidence, theme.shadows.large, { color: theme.colors.buttonText, backgroundColor: theme.colors.primary }]}>
                        {Math.round(data.confidence)}% match
                    </Text>
                )}

                {userDoshaRecommendation && (
                    <View style={[styles.doshaBadge, { backgroundColor: doshaColor[userDoshaRecommendation]?.bg || "#eee" }]}>
                        <Text style={[styles.doshaBadgeText, { color: doshaColor[userDoshaRecommendation]?.text || "#888" }]}>
                            {userDoshaRecommendation}
                        </Text>
                    </View>
                )}
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 16,
        padding: 12,
        marginVertical: 4,
        marginHorizontal: 8,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    image: {
        width: 180,
        height: 140,
        borderRadius: 12,
    },
    info: {
        flex: 1,
        gap: 1,
    },
    foodName: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 4,
        textTransform: "capitalize",
    },
    date: {
        fontSize: 12,
    },
    confidence: {
        gap: 4,
        fontSize: 12,
        backgroundColor: "#d2edc1",
        paddingVertical: 12,
        paddingHorizontal: 10,
        width: 60,
        height: 60,
        borderRadius: 40,
        alignSelf: "flex-start",
    },
    doshaBadge: {
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    doshaBadgeText: {
        fontSize: 12,
        fontWeight: "500",
    },
        feedbackBadge: {
        backgroundColor: "#faeeda",
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 2,
        alignSelf: "flex-start",
        marginVertical: 4,
    },
    feedbackBadgeText: {
        fontSize: 11,
        color: "#854f0b",
        fontWeight: "500",
    },
})