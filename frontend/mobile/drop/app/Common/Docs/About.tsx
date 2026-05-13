import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

import {
  ArrowRight,
  BrainCircuit,
  Camera,
  MessageSquareText,
  ShieldCheck,
  ShoppingBag,
  Store,
  Wallet,
} from "lucide-react-native";

import React from "react";

import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

export default function AboutScreen() {
  return (
    <>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      <LinearGradient
        colors={["#050505", "#09090B", "#111827"]}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* HERO */}
            <View style={styles.hero}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  AI Powered Commerce
                </Text>
              </View>

              <Text style={styles.title}>
                Shopping{"\n"}Redesigned
              </Text>

              <Text style={styles.description}>
                A conversational commerce platform
                designed to help people discover,
                compare, and purchase products
                naturally through AI.
              </Text>
            </View>

            {/* SECTION 1 */}
            <View style={styles.card}>
              <View style={styles.cardIcon}>
                <BrainCircuit
                  size={24}
                  color="#FFFFFF"
                />
              </View>

              <Text style={styles.cardTitle}>
                Conversational Discovery
              </Text>

              <Text style={styles.cardDescription}>
                Users describe products naturally
                instead of relying on traditional
                keyword search.
              </Text>

              <View style={styles.featureContainer}>
                <Feature text="Natural AI conversations" />
                <Feature text="Budget-aware recommendations" />
                <Feature text="Intelligent comparisons" />
                <Feature text="Personalized discovery" />
              </View>
            </View>

            {/* SECTION 2 */}
            <View style={styles.card}>
              <View style={styles.cardIcon}>
                <Camera
                  size={24}
                  color="#FFFFFF"
                />
              </View>

              <Text style={styles.cardTitle}>
                AI Merchant Tools
              </Text>

              <Text style={styles.cardDescription}>
                Merchants can create listings
                rapidly using AI-assisted product
                understanding.
              </Text>

              <View style={styles.featureContainer}>
                <Feature text="Image-based listing generation" />
                <Feature text="Automatic categorization" />
                <Feature text="AI product descriptions" />
                <Feature text="Faster inventory publishing" />
              </View>
            </View>

            {/* SECTION 3 */}
            <View style={styles.card}>
              <View style={styles.cardIcon}>
                <ShoppingBag
                  size={24}
                  color="#FFFFFF"
                />
              </View>

              <Text style={styles.cardTitle}>
                Unified Commerce Experience
              </Text>

              <Text style={styles.cardDescription}>
                Discovery, communication, payment,
                and order management happen within
                one ecosystem.
              </Text>

              <View style={styles.grid}>
                <MiniFeature
                  icon={
                    <Wallet
                      size={18}
                      color="#FFFFFF"
                    />
                  }
                  title="Payments"
                />

                <MiniFeature
                  icon={
                    <Store
                      size={18}
                      color="#FFFFFF"
                    />
                  }
                  title="Merchants"
                />

                <MiniFeature
                  icon={
                    <MessageSquareText
                      size={18}
                      color="#FFFFFF"
                    />
                  }
                  title="Negotiation"
                />

                <MiniFeature
                  icon={
                    <ShieldCheck
                      size={18}
                      color="#FFFFFF"
                    />
                  }
                  title="Trust"
                />
              </View>
            </View>

            {/* CTA */}
            <View style={styles.ctaContainer}>
              <TouchableOpacity
                activeOpacity={0.9}
                style={styles.primaryButton}
                onPress={() =>
                  router.push("/Forms/register")
                }
              >
                <Text style={styles.primaryButtonText}>
                  Create Account
                </Text>

                <ArrowRight
                  size={18}
                  color="#050505"
                />
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.9}
                style={styles.secondaryButton}
                onPress={() =>
                  router.push("/Forms/login")
                }
              >
                <Text
                  style={
                    styles.secondaryButtonText
                  }
                >
                  Login
                </Text>
              </TouchableOpacity>
            </View>

            {/* FOOTER */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Built for scalable AI-powered
                commerce experiences.
              </Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </>
  );
}

function Feature({
  text,
}: {
  text: string;
}) {
  return (
    <View style={styles.feature}>
      <View style={styles.featureDot} />

      <Text style={styles.featureText}>
        {text}
      </Text>
    </View>
  );
}

function MiniFeature({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <View style={styles.miniCard}>
      <View style={styles.miniIcon}>
        {icon}
      </View>

      <Text style={styles.miniTitle}>
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050505",
  },

  safeArea: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 10,
    paddingBottom: 40,
  },

  hero: {
    marginBottom: 34,
  },

  badge: {
    alignSelf: "flex-start",

    paddingHorizontal: 14,
    paddingVertical: 8,

    borderRadius: 999,

    backgroundColor: "#111111",

    borderWidth: 1,
    borderColor: "#1B1B1B",

    marginBottom: 24,
  },

  badgeText: {
    color: "#FFFFFF",

    fontSize: 12,
    fontWeight: "600",

    letterSpacing: 0.3,
  },

  title: {
    color: "#FFFFFF",

    fontSize: 44,
    fontWeight: "800",

    lineHeight: 48,
    letterSpacing: -2.2,
  },

  description: {
    marginTop: 18,

    color: "#71717A",

    fontSize: 15,
    lineHeight: 28,

    maxWidth: "96%",
  },

  card: {
    marginBottom: 18,

    padding: 22,

    borderRadius: 28,

    backgroundColor: "#0B0B0C",

    borderWidth: 1,
    borderColor: "#18181B",
  },

  cardIcon: {
    width: 54,
    height: 54,

    borderRadius: 18,

    backgroundColor: "#111111",

    justifyContent: "center",
    alignItems: "center",

    marginBottom: 18,
  },

  cardTitle: {
    color: "#FFFFFF",

    fontSize: 22,
    fontWeight: "700",

    marginBottom: 10,
  },

  cardDescription: {
    color: "#71717A",

    fontSize: 15,
    lineHeight: 26,

    marginBottom: 22,
  },

  featureContainer: {
    gap: 14,
  },

  feature: {
    flexDirection: "row",
    alignItems: "center",
  },

  featureDot: {
    width: 7,
    height: 7,

    borderRadius: 999,

    backgroundColor: "#FFFFFF",

    marginRight: 12,
  },

  featureText: {
    color: "#E4E4E7",

    fontSize: 14,
    fontWeight: "500",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },

  miniCard: {
    width: "47%",

    borderRadius: 20,

    paddingVertical: 18,

    alignItems: "center",

    backgroundColor: "#111111",

    borderWidth: 1,
    borderColor: "#1A1A1A",
  },

  miniIcon: {
    width: 44,
    height: 44,

    borderRadius: 14,

    justifyContent: "center",
    alignItems: "center",

    backgroundColor: "#181818",

    marginBottom: 12,
  },

  miniTitle: {
    color: "#FFFFFF",

    fontSize: 14,
    fontWeight: "700",
  },

  ctaContainer: {
    marginTop: 12,
  },

  primaryButton: {
    height: 58,

    borderRadius: 22,

    backgroundColor: "#FFFFFF",

    justifyContent: "center",
    alignItems: "center",

    flexDirection: "row",

    gap: 10,
  },

  primaryButtonText: {
    color: "#050505",

    fontSize: 15,
    fontWeight: "800",
  },

  secondaryButton: {
    height: 58,

    borderRadius: 22,

    marginTop: 14,

    justifyContent: "center",
    alignItems: "center",

    backgroundColor: "#111111",

    borderWidth: 1,
    borderColor: "#1A1A1A",
  },

  secondaryButtonText: {
    color: "#FFFFFF",

    fontSize: 15,
    fontWeight: "700",
  },

  footer: {
    marginTop: 28,
    alignItems: "center",
  },

  footerText: {
    color: "#52525B",

    fontSize: 12,
    textAlign: "center",

    lineHeight: 22,
  },
});