import { ScrollView, StyleSheet } from "react-native";
import AnalyzedFoodCard from "../../components/AnalyzedFoodCard";

export default function HistoryDetailsScreen({ route }) {
  const { scanResult } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <AnalyzedFoodCard
        scanResult={scanResult}
        readOnly={true}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});