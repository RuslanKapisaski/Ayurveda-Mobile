// DoshaIntroScreen.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Button from "../../components/Button";

export default function DoshaIntroScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Discover Your Dosha</Text>
      <Text style={styles.text}>
        In Ayurveda, there are three doshas:
        <Text style={styles.boldText}>Vata, Pitta, and Kapha</Text>.
        Understanding your dosha helps tailor your diet and lifestyle.
      </Text>
      <Button
        text="Next"
        active={true}
        style={styles.button}
        onPress={() => navigation.navigate("DoshaTest")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  button: {
    width: 200,
    backgroundColor: "#aedfc9",
  },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  text: {
    fontSize: 20,
    margin: 10,
    lineHeight: 24,
    textAlign: "center",
    color: "#333",
    marginBottom: 40,
  },
  boldText: {
    fontWeight: "bold",
  },
});
