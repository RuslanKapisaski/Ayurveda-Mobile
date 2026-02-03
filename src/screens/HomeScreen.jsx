import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Alert,
  FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import { fetchTerapies } from "../api/therapy.api";
import { fetchMedicines } from "../api/medicines.api";
import { fetchNutritionPlans } from "../api/nutritionPlans.api";
import { fetchPrograms } from "../api/programs.api";
import InfoCard from "../components/InfoCard";

export default function HomeScreen() {
  const [therapies, setTherapies] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [nutritionPlans, setNutritionPlans] = useState([]);
  const [programs, setPrograms] = useState([]);

  const navigation = useNavigation();

  fetchData(setTherapies, setMedicines, setNutritionPlans, setPrograms);

  const renderCard = (item, type) => (
    <InfoCard
      data={item}
      type={type}
      key={item.id}
      onPress={() => navigation.navigate("Details", { data: item, type })}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Hero */}
        <Image
          source={{
            uri: "https://vediherbals.com/cdn/shop/articles/AyurvedaHistory.jpg?v=1739768432",
          }}
          style={styles.heroImage}
          resizeMode="cover"
        />
        <Text style={styles.brand}>Ayurveda Journey</Text>
        <Text style={styles.hero}>
          Natural healing for body, mind and balance
        </Text>

        {/* What is Ayurveda */}
        <View style={styles.section}>
          <Text style={styles.title}>What is Ayurveda?</Text>
          <Text style={styles.text}>
            Ayurveda is a holistic healing system that focuses on restoring
            balance between body, mind, and lifestyle. Instead of treating
            symptoms, it addresses the root cause of imbalance.
          </Text>
        </View>

        {/* Our Mission */}
        <View style={styles.section}>
          <Text style={styles.title}>Our Mission</Text>
          <Text style={styles.text}>
            We help people achieve long-term health and vitality through
            personalized therapies, herbal medicine, and mindful living.
          </Text>
        </View>

        {/* What We Offer */}
        <View style={styles.offerSection}>
          <Text style={styles.title}>What We Offer</Text>

          {/* Therapies */}
          <Text style={styles.cardTitle}>Therapies</Text>
          <Text style={styles.cardText}>
            Personalized treatments for detox, stress and healing
          </Text>
          {therapies.length > 0 ? (
            <FlatList
              horizontal
              data={therapies}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => renderCard(item, "therapy")}
              showsHorizontalScrollIndicator={false}
            />
          ) : (
            <Text>No available therapies.</Text>
          )}

          {/* Herbal Medicine */}
          <Text style={styles.cardTitle}>Herbal Medicine</Text>
          <Text style={styles.cardText}>
            Natural herbs prescribed for your unique body type
          </Text>
          {medicines.length > 0 ? (
            <FlatList
              horizontal
              data={medicines}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => renderCard(item, "medicine")}
              showsHorizontalScrollIndicator={false}
            />
          ) : (
            <Text>No available medicines.</Text>
          )}

          {/* Nutrition Plans */}
          <Text style={styles.cardTitle}>Nutrition</Text>
          <Text style={styles.cardText}>
            Food plans designed to support your dosha and energy
          </Text>
          {nutritionPlans.length > 0 ? (
            <FlatList
              horizontal
              data={nutritionPlans}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => renderCard(item, "nutrition")}
              showsHorizontalScrollIndicator={false}
            />
          ) : (
            <Text>No available nutrition plans.</Text>
          )}

          {/* Detox Programs */}
          <Text style={styles.cardTitle}>Detox</Text>
          <Text style={styles.cardText}>
            Detox programs that help clean toxins out of your body
          </Text>
          {programs.length > 0 ? (
            <FlatList
              horizontal
              data={programs}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => renderCard(item, "detox")}
              showsHorizontalScrollIndicator={false}
            />
          ) : (
            <Text>No available programs.</Text>
          )}

          {/* Call to action */}
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Start Your Journey</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );

  function fetchData() {
    useEffect(() => {
      const loadData = async () => {
        try {
          const [
            therapiesData,
            medicinesData,
            nutritionPlansData,
            programsData,
          ] = await Promise.all([
            fetchTerapies(),
            fetchMedicines(),
            fetchNutritionPlans(),
            fetchPrograms(),
          ]);

          setTherapies(therapiesData.data);
          setMedicines(medicinesData.data);
          setNutritionPlans(nutritionPlansData.data);
          setPrograms(programsData.data);
        } catch (error) {
          Alert.alert("Error", `Cannot load data: ${error}!`, [
            { text: "Cancel" },
            { text: "OK" },
          ]);
        }
      };

      loadData();
    }, []);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  content: {
    padding: 8,
  },
  heroImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
  },
  brand: {
    fontSize: 14,
    color: "#ffffff",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginTop: 8,
  },
  hero: {
    fontSize: 28,
    fontWeight: "700",
    color: "#b9e4d8",
    marginTop: 6,
    marginBottom: 24,
  },
  section: {
    backgroundColor: "#a2c0ad",
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#efefef",
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: "#4F6F64",
  },
  offerSection: {
    backgroundColor: "#3a4c43",
    marginVertical: 6,
    borderEndEndRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#bdd0cb",
    marginTop: 12,
  },
  cardText: {
    fontSize: 14,
    color: "#ffffff",
    marginBottom: 6,
  },
  button: {
    backgroundColor: "#1F3F36",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 16,
    marginBottom: 40,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});
