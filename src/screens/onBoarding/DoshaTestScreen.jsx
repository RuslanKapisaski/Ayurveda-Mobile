import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

import { db } from "../../fireBaseConfig";
import { getDocs, collection } from "firebase/firestore";
import * as onBoardingService from "../../services/onBoardingService";
import Button from "../../components/Button";

export default function DoshaTestScreen({ navigation }) {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const snapshot = await getDocs(collection(db, "questions"));
        const fetchedQuestions = snapshot.docs.map((doc) => doc.data());
        setQuestions(fetchedQuestions);
      } catch (error) {
        console.error("Error fetching questions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleAnswerChange = (questionIndex, selectedAnswer) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: selectedAnswer,
    }));
  };

  const handleSubmit = async () => {
    const doshaScores = {
      Vata: 0,
      Pitta: 0,
      Kapha: 0,
    };

    //Sum dosha scores
    questions.forEach((question, index) => {
      const selectedIndex = answers[index];
      if (selectedIndex == undefined) return;

      const impact = question.options[selectedIndex].impact;

      Object.keys(doshaScores).forEach((dosha) => {
        doshaScores[dosha] += impact[dosha] || 0;
      });
    });

    //Total Sum
    const totalPoints = Object.values(doshaScores).reduce(
      (sum, value) => sum + value,
      0,
    );

    //Percenteges
    const doshaPercentages = {};

    Object.keys(doshaScores).forEach((dosha) => {
      if (totalPoints > 0) {
        doshaPercentages[dosha] = Math.round(
          (doshaScores[dosha] / totalPoints) * 100,
        );
      } else {
        doshaPercentages[dosha] = 0;
      }
    });

    //Dominant dosha
    const dominantDosha = Object.keys(doshaPercentages).reduce((a, b) =>
      doshaPercentages[a] > doshaPercentages[b] ? a : b,
    );

    //Save in Firestore
    try {
      await onBoardingService.saveDoshaResultToUser(
        dominantDosha,
        doshaPercentages,
        doshaScores,
      );
    } catch (error) {
      console.error(`Error submitting onboarding data:${error.message}`);
    }

    navigation.navigate("DoshaResult", {
      dominantDosha,
      percentages: doshaPercentages,
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2E5E4E" />
        <Text style={styles.loadingText}>Loading questions...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Dosha Test</Text>
      {questions.map((question, index) => (
        <View key={index} style={styles.questionContainer}>
          <Text style={styles.questionText}>{question.text}</Text>

          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={answers[index]}
              onValueChange={(value) => handleAnswerChange(index, value)}
              style={styles.picker}
              mode="dropdown"
            >
              <Picker.Item label="Select an option..." value={null} />
              {question.options.map((option, i) => (
                <Picker.Item key={i} label={option.label} value={i} />
              ))}
            </Picker>
          </View>
        </View>
      ))}
      <Button
        text="Submit"
        textStyle={styles.buttonText}
        style={styles.button}
        onPress={handleSubmit}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 100,
    backgroundColor: "#F5F7F6",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F7F6",
  },

  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: "#333",
  },

  title: {
    fontSize: 34,
    fontWeight: "700",
    color: "#1F3F36",
    marginBottom: 25,
    textAlign: "center",
  },

  questionContainer: {
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 16,
    marginBottom: 18,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },

  questionText: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 12,
    color: "#2E2E2E",
  },

  pickerWrapper: {
    backgroundColor: "#F2F2F2",
    borderRadius: 12,
    overflow: "hidden",
  },

  picker: {
    height: Platform.OS === "ios" ? 150 : 50,
    width: "100%",
    color: "#333",
  },

  button: {
    marginTop: 10,
    backgroundColor: "#aedfc9",
    width: 200,
    alignSelf: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "400",
  },
});
