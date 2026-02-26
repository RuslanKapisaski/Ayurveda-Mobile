import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";

import * as programsService from "../../services/programsService";
import ProgramCard from "../../components/ProgramCard";

export default function ProgramsScreen({ navigation }) {
  const [programs, setPrograms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPrograms = async () => {
      try {
        const result = await programsService.getAll();
        setPrograms(result);
      } catch (err) {
        setError("Failed to load programs.");
      } finally {
        setIsLoading(false);
      }
    };

    loadPrograms();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loader}>
        <Text style={{ color: "red" }}>{error}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={programs}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ProgramCard
          program={item}
          onPress={() =>
            navigation.navigate("ProgramDetails", { programId: item.id })
          }
        />
      )}
      contentContainerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
