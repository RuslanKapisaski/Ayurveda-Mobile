import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function CustomImagePicker({ imageUri, onImagePicked }) {
  const selectImageHandler = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission denied",
        "We need gallery permissions to continue.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.7,
    });

    if (!result.canceled) {
      onImagePicked(result.assets[0].uri);
    }
  };

  const takePhotoHandler = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission denied",
        "We need camera permissions to continue.",
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      onImagePicked(result.assets[0].uri);
    }
  };

  const removeImageHandler = () => {
    onImagePicked(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile Photo</Text>

      <TouchableOpacity
        style={[
          styles.imageContainer,
          imageUri ? { aspectRatio: 16 / 9 } : { height: 130 },
        ]}
        onPress={selectImageHandler}
        activeOpacity={0.8}
      >
        {imageUri ? (
          <>
            <Image source={{ uri: imageUri }} style={styles.image} />

            {/* ❌ Remove Button */}
            <TouchableOpacity
              style={styles.removeButton}
              onPress={removeImageHandler}
            >
              <Ionicons name="close" size={18} color="#fff" />
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.placeholder}>
            <Ionicons name="image-outline" size={40} color="#aaa" />
            <Text style={styles.placeholderText}>Tap to select image</Text>
          </View>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.cameraButton} onPress={takePhotoHandler}>
        <Ionicons name="camera-outline" size={18} color="#333" />
        <Text style={styles.cameraText}>Take Photo</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    elevation: 2,
  },

  title: {
    fontSize: 14,
    marginBottom: 10,
    color: "#888",
  },

  imageContainer: {
    width: "100%",
    backgroundColor: "#eef5ea",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  placeholder: {
    justifyContent: "center",
    alignItems: "center",
  },

  placeholderText: {
    marginTop: 6,
    fontSize: 13,
    color: "#888",
  },

  cameraButton: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f3f3f3",
    paddingVertical: 10,
    borderRadius: 10,
  },

  cameraText: {
    marginLeft: 6,
    fontSize: 14,
    color: "#333",
  },

  removeButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 14,
    padding: 6,
  },
});
