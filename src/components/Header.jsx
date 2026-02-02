import { View, Text, StyleSheet } from "react-native";

export default function Header({ username }) {
  return (
    <View style={styles.header}>
      <Text style={styles.greeting}>Hello, {username}🌿</Text>
      <Text style={styles.balance}>Balance: Good</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "600",
    color: "#2F5D50",
  },
  balance: {
    fontSize: 14,
    color: "#5E8C7A",
    marginTop: 4,
  },
});
