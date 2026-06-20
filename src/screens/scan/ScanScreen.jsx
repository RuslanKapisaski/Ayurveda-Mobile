import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker"; 
import { useRef, useState } from "react";
import {
    View, Text, TouchableOpacity, StyleSheet,
    ActivityIndicator, Image, ScrollView,
} from "react-native";
import { auth } from "../../fireBaseConfig";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../contexts/theme/useTheme";
import useAuth from "../../contexts/auth/useAuth";
import Button from "../../components/Button";

const API_URL = "https://ayurveda-lens-api.onrender.com/api/scan";

export default function ScanScreen({ navigation }) {
    const { theme } = useTheme();
    const { user } = useAuth();
    const [permission, requestPermission] = useCameraPermissions();
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [cameraOpen, setCameraOpen] = useState(false);
    const cameraRef = useRef(null);


    const handleAgree = async () => {
        const { granted } = await requestPermission();
        if (granted) setCameraOpen(true);
    };

    const handleCapture = async () => {
        if (!cameraRef.current) return;
        try {
            const photo = await cameraRef.current.takePictureAsync({ quality: 0.35 });
            setImage(photo.uri);
            setCameraOpen(false);
        } catch (error) {
            alert("Camera error: " + error.message);
        }
    };

    const handleImagePicker = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync(); 

        if (status !== "granted") {
            alert("Gallery permission is required to pick an image.");
            return;
        }

        const pickerResult = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.7,
        });

        if (!pickerResult.canceled) {
            setImage(pickerResult.assets[0].uri);
        }
    };
    const analyzeFood = async (uri) => {
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("file", { uri, name: "food.jpg", type: "image/jpeg" });

            if (!auth.currentUser) {
                throw new Error("User is not authenticated");
            }
            const token = await auth.currentUser.getIdToken()

            const controller = new AbortController()
            const timeout = setTimeout(() => {
                controller.abort()
            }, 60000)

            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData,
                signal: controller.signal
            });

            clearTimeout(timeout);

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Scan failed: ${response.status} ${errorText}\n Please try again..`);
            }

            const data = await response.json();

            if (data.status !== "success") {
                navigation.navigate("Feedback", {
                    uri,
                    predictedFood: data.food,
                    confidence: data.confidence,
                    status: data.status,
                });
                return;
            }
            navigation.navigate("Analyze", { scanResult: { ...data, uri: uri } })

        } catch (error) {
            if (error.name === "AbortError") {
                alert("The AI service is starting. Please try again in a few seconds.");
            } else {
                alert("Error: " + error.message)
            }
                return;
        } finally {
            setLoading(false);
        }
    };
    if (cameraOpen) {
        return (
            <View style={styles.cameraWrapper}>
                <CameraView style={styles.camera} ref={cameraRef} facing="back">
                    <View style={styles.cameraControls}>
                        <TouchableOpacity
                            onPress={() => setCameraOpen(false)}
                            style={styles.closeButton}
                        >
                            <Ionicons name="close" size={34} color="#fff" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={handleCapture}
                            style={styles.captureButton}
                        >
                            <View style={styles.captureOuter}>
                                <View style={styles.captureInner} />
                            </View>
                        </TouchableOpacity>
                    </View>
                </CameraView>
            </View>
        );
    }

    if (!permission?.granted) {
        return (
            <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
                <Ionicons
                    name="shield-checkmark"
                    size={64}
                    color={theme.colors.primary}
                />

                <Text style={[styles.title, { color: theme.colors.text }]}>
                    Before continue
                </Text>

                <Text style={[styles.subtitle, { color: theme.colors.text }]}>
                    Food pictures are not stored or shared with third parties.
                    Please grant camera permissions to use this feature.
                </Text>

                <Button text="Grant Permission" active onPress={handleAgree} />
            </View>
        );
    }

    return (
        <ScrollView
            contentContainerStyle={[
                styles.scrollContent,
                { backgroundColor: theme.colors.background },
            ]}
            showsVerticalScrollIndicator={false}
        >
            {!image ? (
                <View style={styles.foodScannerSection}>
                    <Ionicons
                        name="restaurant-outline"
                        size={54}
                        color={theme.colors.primary}
                    />

                    <Text style={[styles.title, { color: theme.colors.primary }]}>
                        Food Scanner
                    </Text>

                    <Text style={[styles.subtitle, { color: theme.colors.text }]}>
                        Show a picture of food and receive ayurvedic recommendations based on your dosha.
                    </Text>

                    <View style={styles.buttonSection}>
                        <TouchableOpacity
                            style={[
                                styles.scanButton,
                                theme.shadows.large,
                                { backgroundColor: theme.colors.primary },
                            ]}
                            onPress={() => setCameraOpen(true)}
                        >
                            <Ionicons name="scan-circle" size={64} color="#fff" />
                            <Text style={styles.scanButtonText}>Scan food</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.scanButton,
                                 theme.shadows.large,
                                { backgroundColor: theme.colors.primary },
                            ]}
                            onPress={handleImagePicker}
                        >
                            <Ionicons name="images-outline" size={64} color="#fff" />
                            <Text style={styles.scanButtonText}>Take from gallery</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ) : (
                <View style={[styles.imageSection, theme.shadows.large, { backgroundColor: theme.colors.card }]}>
                    <Text style={[styles.title, { color: theme.colors.primary }]}>
                        Your Image
                    </Text>

                    <Text style={[styles.previewSubtitle, { color: theme.colors.text }]}>
                        Review your photo before analyzing.
                    </Text>

                    <Image source={{ uri: image }} style={styles.previewImage} />

                    <View style={styles.previewActions}>
                        <TouchableOpacity
                            onPress={() => {
                                setImage(null);
                            }}
                            style={styles.actionButton}
                            disabled={loading}
                        >
                            <Ionicons
                                name="camera-reverse-outline"
                                size={28}
                                color="#E53935"
                            />
                            <Text style={styles.actionText}>Retake</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => analyzeFood(image)}
                            style={styles.actionButton}
                            disabled={loading}
                        >
                            <Ionicons
                                name="checkmark-circle-outline"
                                size={28}
                                color="#096c16"
                            />
                            <Text style={styles.actionText}>Analyze</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {loading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                    <Text style={[styles.loadingText, { color: theme.colors.primary }]}>
                        Food analyzing.Please wait..
                    </Text>
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
    },

    scrollContent: {
        flexGrow: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
    },

    title: {
        fontSize: 28,
        fontWeight: "700",
        marginTop: 12,
        marginBottom: 12,
        textAlign: "center",
    },

    subtitle: {
        fontSize: 14,
        textAlign: "center",
        marginBottom: 32,
        lineHeight: 22,
        maxWidth: 310,
    },
    foodScannerSection: {
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    buttonSection: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-around"

    },
    scanButton: {
        borderRadius: 24,
        paddingVertical: 14,
        paddingHorizontal: 18,
        alignItems: "center",
        justifyContent: "center",
        width: "40%",
        minHeight: 100,
        elevation: 6,
    },

    scanButtonText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "600",
        marginTop: 8,
        textAlign: "center"
    },

    imageSection: {
        width: "100%",
        alignItems: "center",
        padding: 18,
        borderRadius: 28,
        elevation: 5,
    },

    previewSubtitle: {
        fontSize: 14,
        textAlign: "center",
        marginBottom: 16,
        lineHeight: 20,
    },

    previewImage: {
        width: "100%",
        height: 330,
        borderRadius: 22,
    },

    previewActions: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        marginTop: 20,
        gap: 16,
    },

    actionButton: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 14,
        borderRadius: 16,
        backgroundColor: "#F5F5F5",
    },

    actionText: {
        marginTop: 4,
        fontSize: 14,
        fontWeight: "600",
        color: "#333",
    },

    loadingContainer: {
        alignItems: "center",
        marginTop: 24,
    },

    loadingText: {
        marginTop: 8,
        fontSize: 16,
    },

    cameraWrapper: {
        flex: 1,
        backgroundColor: "#000",
    },

    camera: {
        flex: 1,
    },

    cameraControls: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: 44,
    },

    closeButton: {
        position: "absolute",
        top: 48,
        left: 24,
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "rgba(0,0,0,0.35)",
        alignItems: "center",
        justifyContent: "center",
    },

    captureButton: {
        alignItems: "center",
        justifyContent: "center",
    },

    captureOuter: {
        width: 82,
        height: 82,
        borderRadius: 41,
        borderWidth: 5,
        borderColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },

    captureInner: {
        width: 62,
        height: 62,
        borderRadius: 31,
        backgroundColor: "#fff",
    },
});