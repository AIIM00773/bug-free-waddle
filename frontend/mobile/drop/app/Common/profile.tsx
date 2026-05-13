import { LinearGradient } from "expo-linear-gradient";
import { CreditCard, Heart, Settings, ShoppingBag } from "lucide-react-native";
import React from "react";
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function ProfileScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* HEADER */}
      <LinearGradient colors={["#111827", "#1f2937"]} style={styles.header}>
        <Image
          source={{ uri: "https://i.pravatar.cc/150?img=12" }}
          style={styles.avatar}
        />
        <Text style={styles.name}>John Doe</Text>
        <Text style={styles.email}>johndoe@email.com</Text>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>Active Shopper</Text>
        </View>
      </LinearGradient>

      {/* AI PROFILE SECTION */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>AI Shopping Profile</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Preferred Categories</Text>
          <Text style={styles.value}>Phones • Fashion • Electronics</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Budget Range</Text>
          <Text style={styles.value}>KSh 1,000 – 50,000</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Style</Text>
          <Text style={styles.value}>Minimal • Affordable • Trendy</Text>
        </View>
      </View>

      {/* ACTIVITY */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>

        <View style={styles.row}>
          <ShoppingBag size={18} color="#9CA3AF" />
          <Text style={styles.rowText}>Viewed: iPhone 14 Pro</Text>
        </View>

        <View style={styles.row}>
          <Heart size={18} color="#9CA3AF" />
          <Text style={styles.rowText}>Saved: Nike Air Force 1</Text>
        </View>
      </View>

      {/* SETTINGS */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>

        <TouchableOpacity style={styles.row}>
          <CreditCard size={18} color="#9CA3AF" />
          <Text style={styles.rowText}>Payment Methods</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.row}>
          <Settings size={18} color="#9CA3AF" />
          <Text style={styles.rowText}>Account Settings</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#0B0F19",
    flex: 1,
  },

  header: {
    padding: 24,
    alignItems: "center",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 10,
  },

  name: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },

  email: {
    color: "#9CA3AF",
    fontSize: 13,
    marginTop: 4,
  },

  badge: {
    marginTop: 10,
    backgroundColor: "#2563EB",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },

  badgeText: {
    color: "#fff",
    fontSize: 12,
  },

  section: {
    padding: 16,
  },

  sectionTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },

  card: {
    backgroundColor: "#111827",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },

  label: {
    color: "#9CA3AF",
    fontSize: 12,
  },

  value: {
    color: "#fff",
    fontSize: 14,
    marginTop: 4,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
  },

  rowText: {
    color: "#E5E7EB",
    fontSize: 14,
  },
});