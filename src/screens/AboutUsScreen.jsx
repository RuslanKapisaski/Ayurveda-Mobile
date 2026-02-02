import { View, Text, StyleSheet, ScrollView, Image } from "react-native";

export default function AboutUsScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* Header Image */}
      <Image
        source={{
          uri: "https://lighthousegolfresort.com/wp-content/uploads/ayurveda-massage-alternative-healing-therapy-beaut-2022-05-31-18-03-35-utc-scaled.jpg",
        }}
        style={styles.image}
      />

      {/* Title */}
      <Text style={styles.title}>About Us</Text>

      {/* Content */}
      <Text style={styles.text}>
        We are a holistic Ayurveda center dedicated to restoring balance between
        body, mind, and spirit through time-tested natural therapies and modern
        medical care.
      </Text>

      <Text style={styles.text}>
        Rooted in the ancient science of Ayurveda, our mission is not just to
        treat symptoms, but to understand the root cause of imbalance and guide
        each person toward lasting health and vitality.
      </Text>

      <Text style={styles.text}>
        Every client is unique. That is why we create personalized programs
        based on your body type, lifestyle, and individual needs. Our
        experienced therapists and doctors combine traditional Ayurvedic wisdom
        with professional medical standards.
      </Text>

      <Text style={styles.text}>
        This application is your digital companion on that journey — helping you
        track your therapies, medicines, and progress wherever you are.
      </Text>

      <Text style={styles.signature}>🌿 Ayurveda Journey</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F5FAF6",
  },
  image: {
    width: "100%",
    height: 240,
    resizeMode: "cover",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#2F5D50",
    marginTop: 24,
    marginHorizontal: 20,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: "#4F7F6D",
    marginTop: 16,
    marginHorizontal: 20,
  },
  signature: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2F5D50",
    textAlign: "center",
    marginVertical: 30,
  },
});
