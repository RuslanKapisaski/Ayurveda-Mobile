import { StyleSheet, Text, View } from "react-native";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import Header from "../components/Header";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text>Ayurveda</Text>
    </View>
    <ScrollView style={styles.container}>
      {/* Header */}
      <Header username={"Kameliya"} />
      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F5FAF6",
    padding: 16,
  },
  },
});
