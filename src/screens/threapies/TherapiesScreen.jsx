import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as therapiesService from "../../services/therapiesService";
import TherapyCard from "../../components/TherapyCard"
import { useTheme } from "../../contexts/theme/useTheme"; 

export default function TherapiesScreen({ navigation }) {
  const { theme } = useTheme();
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
  error: {
    textAlign: "center",
    marginTop: 20,
  },
});
