// AboutAyurvedaScreen.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Button from "../../components/Button";

export default function AboutAyurvedaScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>What is Ayurveda?</Text>
      <Text style={styles.text}>
        Ayurveda is an ancient system of medicine from India, focused on
        balancing the body, mind, and spirit. It promotes natural healing
        through diet, lifestyle, and remedies tailored to your unique dosha.
      </Text>
      <Button
        text="Next"
        onPress={() => navigation.navigate("DoshaIntro")}
        active={true}
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F9F7",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1F3F36",
    marginBottom: 30,
    textAlign: "center",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 20,
    marginBottom: 30,
    borderWidth: 2,
    borderColor: "#4A7C59",
  },
  button: {
    width: 200,
    backgroundColor: "#aedfc9",
  },
  text: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 40,
    color: "#333",
  },
});
