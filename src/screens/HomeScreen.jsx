import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Button from "../components/Button";
import useAuth from "../auth/useAuth";

export default function HomeScreen() {
  const { user } = useAuth();
  console.log(user);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good Morning,</Text>
            <Text style={styles.username}>{user.name} 🌿</Text>
          </View>
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
        </View>

        {/* NEXT APPOINTMENT */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Next Appointment</Text>
          <Text style={styles.cardMain}>23 Feb • 14:00</Text>
          <Text style={styles.cardSub}>Initial Consultation</Text>
        </View>

        {/* ACTIVE THERAPY */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Active Therapy</Text>
          <Text style={styles.cardMain}>Vata Balancing Program</Text>
          <Text style={styles.cardSub}>Day 7 of 21</Text>
        </View>

        {/* HERBAL REMINDER */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Today’s Herbal Intake</Text>
          <Text style={styles.cardSub}>• Ashwagandha – 1 capsule</Text>
          <Text style={styles.cardSub}>• Triphala – evening</Text>
        </View>

        {/* PROGRESS */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBox}>
            <Text style={styles.progressNumber}>3</Text>
            <Text style={styles.progressLabel}>Therapies</Text>
          </View>
          <View style={styles.progressBox}>
            <Text style={styles.progressNumber}>14</Text>
            <Text style={styles.progressLabel}>Active Days</Text>
          </View>
          <View style={styles.progressBox}>
            <Text style={styles.progressNumber}>2</Text>
            <Text style={styles.progressLabel}>Herbal Plans</Text>
          </View>
        </View>

        {/* QUICK ACTIONS */}
        <View style={styles.actionsContainer}>
          <Button text="Book Therapy" active={true} />
          <Button text="My Progress" active={false} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#f6f1e4",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },

  greeting: {
    fontSize: 16,
    color: "#777",
  },

  username: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2E2E2E",
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },

  card: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 10,
    // iOS Shadow
    shadowColor: "#224324",
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    // Android Shadow
    elevation: 8,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
  },
  cardTitle: {
    fontSize: 14,
    color: "#4A7C59",
    marginBottom: 6,
  },

  cardMain: {
    fontSize: 20,
    fontWeight: "600",
    height: 80,
    color: "#012b10",
  },

  cardSub: {
    fontSize: 16,
    color: "#666",
    marginTop: 4,
  },

  progressContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginBottom: 20,
  },

  progressBox: {
    backgroundColor: "#FFFFFF",
    flex: 1,
    marginHorizontal: 10,
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    // iOS Shadow
    shadowColor: "#224324",
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    // Android Shadow
    elevation: 8,
  },

  progressNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4A7C59",
  },

  progressLabel: {
    fontSize: 10,
    color: "#777",
    marginTop: 4,
  },

  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    marginHorizontal: 40,
  },
});
