import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import * as onBoardingService from "../../services/onBoardingService";

const goals = [
  "Improve digestion",
  "Enhance mental clarity",
  "Balance energy",
  "Improve sleep",
];

export default function GoalsScreen({ navigation }) {
  const [selectedGoals, setSelectedGoals] = useState([]);

  const handleGoalToggle = (goalText) => {
    setSelectedGoals((prevSelected) => {
      if (prevSelected.includes(goalText)) {
        return prevSelected.filter((goal) => goal !== goalText);
      } else {
        return [...prevSelected, goalText];
      }
    });
  };

  const handleGoalsSubmit = async () => {
    if (selectedGoals.length > 0) {
      try {
        await onBoardingService.saveUserGoals(selectedGoals);
        navigation.navigate("AboutAyurveda");
      } catch (error) {
        console.error("Error saving user goals:", error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>What are your goals?</Text>
      {goals.map((goal, idx) => (
        <TouchableOpacity
          key={idx}
          style={[
            styles.goalItem,
            selectedGoals.includes(goal) && styles.selectedGoal,
          ]}
          onPress={() => handleGoalToggle(goal)}
        >
          <Text style={styles.goalText}>{goal}</Text>
        </TouchableOpacity>
      ))}

      <View style={styles.buttonSection}>
        <TouchableOpacity
          style={[styles.button, styles.prevButton]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Prev</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            styles.nextButton,
            selectedGoals.length === 0 && styles.disabledButton,
          ]}
          disabled={selectedGoals.length === 0}
          onPress={handleGoalsSubmit}
        >
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 40,
    justifyContent: "center",
  },
  title: {
    fontSize: 26,
    marginBottom: 30,
    textAlign: "center",
  },
  goalItem: {
    padding: 20,
    borderWidth: 1,
    borderColor: "#888",
    borderRadius: 8,
    margin: 4,
  },
  selectedGoal: {
    backgroundColor: "#cde1f9",
    borderColor: "#3b82f6",
  },
  goalText: {
    fontSize: 16,
  },
  buttonSection: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    width: 160,
    backgroundColor: "#aedfc9",
  },
  disabledButton: {
    backgroundColor: "#888888",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
});
