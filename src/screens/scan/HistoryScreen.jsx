import { View, Text, StyleSheet, ActivityIndicator } from "react-native"
import { useTheme } from "../../contexts/theme/useTheme"
import { useEffect, useState } from "react"
import ScannedFoodCard from "../../components/ScannedFoodCard"
import useFetch from "../../hooks/useFetch"
import { useFetchHistoryScans } from "../../hooks/useFetchHistoryScans"
import useAuth from "../../contexts/auth/useAuth"
import { ScrollView ,FlatList} from "react-native"
import useFetchUserData from "../../hooks/useFetchUserData"

export default function HistoryScreen() {

    const { theme } = useTheme()
    const { user } = useAuth()
    const { scans, loadScans, isLoading, error } = useFetchHistoryScans(user.id)

//    const {loadUserData} = useFetchUserData(user.id)

console.log("History render");
    useEffect(() => {
        loadScans()
        // loadUserData()
    }, [user.id])

    console.log(scans)
    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Text style={[styles.title, { color: theme.colors.primary }]}> Your past scans: </Text>
            {isLoading && <ActivityIndicator />}

                {scans?.length > 0 
                ? 
                <FlatList
                data={scans}
                keyExtractor={(item) => item.id}
                renderItem={({item}) => <ScannedFoodCard  data={item}
                initialNumToRender={5}
                maxToRenderPerBatch={5}
                windowSize={5}
                removeClippedSubviews={true}
                />
             }
                />
                : <Text style={[styles.noScans, {color: theme.colors.primary}]}> No scans yet.</Text>}

            {error && < Text>{error}</Text>}
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    historySection: {
        gap: 10,
    },
    title: {
        paddingVertical: 20,
        paddingHorizontal: 24,
        fontSize: 24,
        fontWeight: "600",
    },
    noScans:{

    }

})
