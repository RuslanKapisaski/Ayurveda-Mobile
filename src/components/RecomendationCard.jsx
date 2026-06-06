import { Text } from "react-native"
import { StyleSheet, View } from "react-native"
import { useTheme } from "../contexts/theme/useTheme"

export default function RecommenationCard({ title, category, description }) {
    const { theme } = useTheme()

    return (
        <View style={[styles.card, { backgroundColor: theme.colors.cardColor }]}>
            <View style={[styles.categoryBubble, { backgroundColor: theme.colors.primary }]}>
                <Text style={[styles.categoryTitle]}>{category}</Text>
            </View>
            <Text style={[styles.cardTitle, {color:theme.colors.text}]}>{title}</Text>
            <Text style={[styles.description, { color: theme.colors.text }]}>{description}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        width: "90%",
        alignContent: "center",
        margin: "auto",
        position: "relative",
        marginVertical: 10,
        paddingVertical: 10,
        paddingHorizontal: 8,
        borderTopLeftRadius: 60,
        borderBottomRightRadius: 60,
        shadowColor: "#000000",
        shadowOffset: { width: 2, height:8},
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 4, 
    },
    cardTitle:{
        marginTop:20,
        fontWeight:"800",
        paddingTop: 20,
        paddingHorizontal: 10
    },
    categoryBubble: {
        position: "absolute",
        top: -30,
        right: -20,
        width: 72,
        paddingVertical: 30,
        paddingHorizontal: 10,
        borderRadius: 40,
        marginVertical: 8,
        marginHorizontal: 2,
    },
    categoryTitle: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "200",
        alignSelf: "center",
        textTransform: "capitalize",
    },
    description: {
        fontSize: 16,
        paddingTop:10,
        paddingBottom: 10,
        paddingHorizontal: 8,

    }
})