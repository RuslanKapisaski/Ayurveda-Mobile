import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as therapiesService from "../../services/therapiesService";
import TherapyCard from "../../components/therapyCard.jsx";

export default function TherapiesScreen({ navigation }) {
  const [isLoading, setIsLoading] = useState(false);
  const [therapies, setTherapies] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadTherapies = async () => {
      try {
        setIsLoading(true);
        const data = await therapiesService.getAll();
        setTherapies(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadTherapies();
  }, []);

  if (isLoading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  if (error) return <Text style={styles.error}>{error}</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>Choose your healing journey</Text>

      <FlatList
        data={therapies}
        keyExtractor={(item) => item.id} 
        renderItem={({ item }) => (
          <TherapyCard
            therapy={item}
            onPress={
              () =>
                navigation.navigate("TherapyDetails", { therapyDocId: item.id })
            }
          />
        )}
        contentContainerStyle={{ paddingBottom: 60 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#f6f1e4", flex: 1, padding: 16 },
  subtitle: { fontSize: 18, fontWeight: "500", marginBottom: 16 },
  error: { color: "red", textAlign: "center", marginTop: 20 },
});
