import { View, Text, StyleSheet } from "react-native"
import { Image } from "expo-image"
import { useTheme } from "../contexts/theme/useTheme"
import { Ionicons } from "@expo/vector-icons"
import { formatDate } from "../utils/dateFormater"

const doshaColor = {
    beneficial: { bg: "#e1f5ee", text: "#0f6e56" },
    neutral: { bg: "#faeeda", text: "#854f0b" },
    avoid: { bg: "#fcebeb", text: "#a32d2d" },
}

export default function ScannedFoodCard({ data, userDosha }) {
    const { theme } = useTheme()


    const userDoshaRecommendation = userDosha
        ? data.dosha?.[userDosha.toLowerCase()]
        : null

    const date = data.createdAt?.seconds
        ? new Date(data.createdAt.seconds * 1000).toLocaleDateString()
        : "—"

    return (
        <View style={[styles.card, { backgroundColor: theme.colors.card }]}>

            <View style={styles.row}>
                <Image
                    source={{ uri: data.imageUrl }}
                    style={styles.image}
                    contentFit={'cover'}
                    cachePolicy={'memory-disk'}
                    transition={300}
                />

                <View style={styles.info}>
                    <Text style={[styles.foodName, { color: theme.colors.text }]}>
                        {data.food}
                    </Text>
                    <Text style={[styles.date, { color: theme.colors.text }]}>
                        Date: {date}
                    </Text>
                </View>

                <Text style={[styles.confidence, { color: theme.colors.buttonText, backgroundColor: theme.colors.primary }]}>
                    {Math.round(data.confidence)}% match
                </Text>

                {userDoshaRecommendation && (
                    <View style={[
                        styles.doshaBadge,
                        { backgroundColor: doshaColor[userDoshaRecommendation]?.bg || "#eee" }
                    ]}>
                        <Text style={[
                            styles.doshaBadgeText,
                            { color: doshaColor[userDoshaRecommendation]?.text || "#888" }
                        ]}>
                            {userDoshaRecommendation}
                        </Text>
                    </View>
                )}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 16,
        padding: 12,
        marginVertical: 4,
        marginHorizontal: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
        shadowColor: "#787070",
        elevation: 4,
        shadowOffset: { width: 10, height: 10 },
        shadowOpacity: 0.3,
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
        shadowColor: "#787070",
        elevation: 4,
        shadowOffset: { width: 10, height: 10 },
        shadowOpacity: 0.3,
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
})