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
import { useTheme } from "../../contexts/theme/useTheme"; // Импортиране на useTheme за динамични стилове

export default function TherapiesScreen({ navigation }) {
  const { theme } = useTheme(); // Извличаме текущата тема
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
  if (error)
    return (
      <Text style={[styles.error, { color: theme.colors.text }]}>{error}</Text>
    );

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Text style={[styles.subtitle, { color: theme.colors.text }]}>
        Choose your healing journey
      </Text>

      <FlatList
        data={therapies}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TherapyCard
            therapy={item}
            onPress={() =>
              navigation.navigate("Details", { therapyDocId: item.id })
            }
          />
        )}
        contentContainerStyle={{ paddingBottom: 60 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 16,
  },
  error: {
    textAlign: "center",
    marginTop: 20,
  },
});
