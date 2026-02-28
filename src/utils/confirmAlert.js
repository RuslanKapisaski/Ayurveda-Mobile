import { Alert } from "react-native";

export default function confirmAlert(title, message) {
  return new Promise((resolve) => {
    Alert.alert(
      title,
      message,
      [
        { text: "Cancel", style: "cancel", onPress: () => resolve(false) },
        { text: "Confirm", onPress: () => resolve(true) },
      ],
      { cancelable: false },
    );
  });
}
