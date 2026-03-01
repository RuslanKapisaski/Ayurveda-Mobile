import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Animated, Dimensions } from "react-native";
import Button from "../../components/Button";

import * as onBoardingService from "../../services/onBoardingService";
import useAuth from "../../auth/useAuth";

const { width } = Dimensions.get("window");

export default function DoshaResultScreen({ route, navigation }) {
  const { dominantDosha, percentages } = route.params;
  const { user, setUser } = useAuth();

  const handleCompleteOnboarding = async () => {
    try {
      await onBoardingService.setCompleteOnBoardingStatus(user);

      setUser({ hasCompletedOnBoarding: true });
    } catch (error) {
      console.error("Onboarding update error:", error);
    } finally {
      setLoading(false);
    }
  };

  const vataAnim = useRef(new Animated.Value(0)).current;
  const pittaAnim = useRef(new Animated.Value(0)).current;
  const kaphaAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(vataAnim, {
        toValue: percentages.Vata,
        duration: 900,
        useNativeDriver: false,
      }),
      Animated.timing(pittaAnim, {
        toValue: percentages.Pitta,
        duration: 900,
        useNativeDriver: false,
      }),
      Animated.timing(kaphaAnim, {
        toValue: percentages.Kapha,
        duration: 900,
        useNativeDriver: false,
      }),
    ]).start();
  }, []);

  const renderBar = (label, percentage, color, animValue) => {
    const barWidth = animValue.interpolate({
      inputRange: [0, 100],
      outputRange: [0, width - 120],
    });

    return (
      <View style={styles.barContainer}>
        <View style={styles.barHeader}>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.percentText}>{percentage}%</Text>
        </View>

        <View style={styles.backgroundBar}>
          <Animated.View
            style={[
              styles.fillBar,
              {
                backgroundColor: color,
                width: barWidth,
              },
            ]}
          />
        </View>
      </View>
    );
  };

  const doshaColors = {
    Vata: "#8FAADC",
    Pitta: "#E07A5F",
    Kapha: "#81B29A",
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Your Dosha Result</Text>

        <Text style={styles.subtitle}>Discover your energetic balance</Text>

        <View style={styles.dominantContainer}>
          <Text style={styles.dominantLabel}>DOMINANT DOSHA</Text>

          <Text
            style={[
              styles.dominant,
              { color: doshaColors[dominantDosha] || "#2E5E4E" },
            ]}
          >
            {dominantDosha}
          </Text>
        </View>

        <View style={styles.barsWrapper}>
          {renderBar("Vata", percentages.Vata, "#8FAADC", vataAnim)}
          {renderBar("Pitta", percentages.Pitta, "#E07A5F", pittaAnim)}
          {renderBar("Kapha", percentages.Kapha, "#81B29A", kaphaAnim)}
        </View>
      </View>

      <Button
        style={styles.button}
        textStyle={styles.buttonText}
        text="Enter App"
        onPress={handleCompleteOnboarding}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#F4F7F5",
    justifyContent: "space-between",
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 28,
    marginTop: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 25,
    elevation: 6,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    color: "#1F3F36",
  },

  subtitle: {
    fontSize: 15,
    textAlign: "center",
    color: "#6B7280",
    marginTop: 6,
    marginBottom: 35,
  },

  dominantContainer: {
    alignItems: "center",
    marginBottom: 35,
  },

  dominantLabel: {
    fontSize: 13,
    color: "#9CA3AF",
    letterSpacing: 1.5,
    marginBottom: 6,
  },

  dominant: {
    fontSize: 34,
    fontWeight: "700",
  },

  barsWrapper: {
    marginTop: 10,
  },

  barContainer: {
    marginBottom: 20,
  },

  barHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#374151",
  },

  percentText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#374151",
  },

  backgroundBar: {
    height: 18,
    backgroundColor: "#E5E7EB",
    borderRadius: 30,
    overflow: "hidden",
  },

  fillBar: {
    height: "100%",
    borderRadius: 30,
  },

  button: {
    backgroundColor: "#2E5E4E",
    borderRadius: 20,
    marginBottom: 50,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
  },
});
