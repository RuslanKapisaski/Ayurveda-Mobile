import React from "react";
import { View, Text, StyleSheet } from "react-native";

import Button from "../../components/Button";

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Ayurveda App</Text>
      <Text style={styles.subtitle}>
        Discover your personalized Ayurveda journey.
      </Text>
      <Button
        text="Get Started"
        style={styles.button}
        active={true}
        onPress={() => navigation.navigate("AboutAyurveda")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F0F8FF",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F3F36",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 40,
    color: "#4A7C59",
  },
  button: {
    width: 200,
    backgroundColor: "#aedfc9",
  },
});
