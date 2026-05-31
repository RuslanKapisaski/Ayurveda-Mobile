import { useRef, useState, useCallback } from "react";
import {
    View, Text, StyleSheet, TouchableOpacity,
    Modal, Animated, TouchableWithoutFeedback
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../contexts/theme/useTheme";
import { useFocusEffect } from "@react-navigation/native";

export default function ScanHomeScreen({ navigation }) {
    const { theme } = useTheme();
    const [visible, setVisible] = useState(false);
    const slideAnim = useRef(new Animated.Value(300)).current;

    useFocusEffect(
        useCallback(() => {
            setVisible(true);
            slideAnim.setValue(300);
            Animated.spring(slideAnim, {
                toValue: 0,
                useNativeDriver: true,
            }).start();
        }, [])
    );

    const hide = (callback) => {
        Animated.timing(slideAnim, {
            toValue: 300,
            duration: 200,
            useNativeDriver: true,
        }).start(() => {
            setVisible(false);
            if (callback) callback();
        });
    };

    return (
        <Modal visible={visible} transparent animationType="none">
            <TouchableWithoutFeedback onPress={() => hide(() => navigation.goBack())}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback>
                        <Animated.View style={[
                            styles.sheet,
                            { backgroundColor: theme.colors.card },
                            { transform: [{ translateY: slideAnim }] }
                        ]}>
                            <View style={styles.handle} />

                            <Text style={[styles.title, { color: theme.colors.text }]}>
                                Select option
                            </Text>

                            <View style={styles.options}>
                                <TouchableOpacity
                                    style={styles.option}
                                    onPress={() => hide(() => navigation.navigate("Scan"))}
                                >
                                    <Ionicons name="scan-outline" size={32} color={theme.colors.primary} />
                                    <Text style={[styles.optionText, { color: theme.colors.text }]}>Scan</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.option}
                                    onPress={() => hide(() => navigation.navigate("Scan History"))}
                                >
                                    <Ionicons name="time-outline" size={32} color={theme.colors.primary} />
                                    <Text style={[styles.optionText, { color: theme.colors.text }]}>History</Text>
                                </TouchableOpacity>
                            </View>
                        </Animated.View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "flex-end",
    },
    sheet: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        paddingBottom: 48,
        alignItems: "center",
    },
    handle: {
        width: 40,
        height: 4,
        backgroundColor: "#ccc",
        borderRadius: 2,
        marginBottom: 20,
    },
    title: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 24,
    },
    options: {
        flexDirection: "row",
        justifyContent: "space-around",
        width: "100%",
    },
    option: {
        alignItems: "center",
        gap: 8,
        padding: 16,
    },
    optionText: {
        fontSize: 13,
        fontWeight: "500",
    },
});