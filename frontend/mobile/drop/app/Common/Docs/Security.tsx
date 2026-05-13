


import { LinearGradient } from "expo-linear-gradient";

import {
    BadgeCheck,
    Fingerprint,
    KeyRound,
    Lock,
    ShieldCheck,
    Smartphone,
    TriangleAlert,
    Wallet,
} from "lucide-react-native";

import React from "react";

import {
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

export default function SecurityScreen() {
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
                <ShieldCheck
                  size={14}
                  color="#FFFFFF"
                />

                <Text style={styles.badgeText}>
                  Security & Privacy
                </Text>
              </View>

              <Text style={styles.title}>
                Built With{"\n"}Security First
              </Text>

              <Text style={styles.description}>
                Security is integrated into every
                layer of the platform — from account
                authentication to payments and data
                protection.
              </Text>
            </View>

            {/* AUTHENTICATION */}
            <View style={styles.card}>
              <View style={styles.iconContainer}>
                <Fingerprint
                  size={24}
                  color="#FFFFFF"
                />
              </View>

              <Text style={styles.cardTitle}>
                Secure Authentication
              </Text>

              <Text style={styles.cardDescription}>
                Multi-step authentication flows help
                reduce unauthorized access and improve
                account verification accuracy.
              </Text>

              <View style={styles.featureContainer}>
                <Feature text="Step-based login verification" />
                <Feature text="Encrypted authentication tokens" />
                <Feature text="Secure session management" />
                <Feature text="Optional biometric support" />
              </View>
            </View>

            {/* DATA SECURITY */}
            <View style={styles.card}>
              <View style={styles.iconContainer}>
                <Lock
                  size={24}
                  color="#FFFFFF"
                />
              </View>

              <Text style={styles.cardTitle}>
                Data Protection
              </Text>

              <Text style={styles.cardDescription}>
                Sensitive account and transactional
                information is handled using secure
                industry-standard protection practices.
              </Text>

              <View style={styles.featureContainer}>
                <Feature text="Encrypted network communication" />
                <Feature text="Protected account credentials" />
                <Feature text="Secure backend infrastructure" />
                <Feature text="Continuous security monitoring" />
              </View>
            </View>

            {/* PAYMENTS */}
            <View style={styles.card}>
              <View style={styles.iconContainer}>
                <Wallet
                  size={24}
                  color="#FFFFFF"
                />
              </View>

              <Text style={styles.cardTitle}>
                Payment Safety
              </Text>

              <Text style={styles.cardDescription}>
                Payment systems are designed to support
                safer digital transactions between users
                and merchants.
              </Text>

              <View style={styles.featureContainer}>
                <Feature text="Transaction verification flows" />
                <Feature text="Merchant trust systems" />
                <Feature text="Fraud risk monitoring" />
                <Feature text="Protected payment processing" />
              </View>
            </View>

            {/* DEVICE & ACCOUNT */}
            <View style={styles.card}>
              <View style={styles.iconContainer}>
                <Smartphone
                  size={24}
                  color="#FFFFFF"
                />
              </View>

              <Text style={styles.cardTitle}>
                Device & Account Controls
              </Text>

              <Text style={styles.cardDescription}>
                Users maintain visibility and control
                over account activity and device access.
              </Text>

              <View style={styles.featureContainer}>
                <Feature text="Device session awareness" />
                <Feature text="Login activity tracking" />
                <Feature text="Suspicious access detection" />
                <Feature text="Secure account recovery flows" />
              </View>
            </View>

            {/* SECURITY PRACTICES */}
            <View style={styles.alertCard}>
              <View style={styles.alertHeader}>
                <TriangleAlert
                  size={18}
                  color="#FFFFFF"
                />

                <Text style={styles.alertTitle}>
                  Security Recommendations
                </Text>
              </View>

              <View style={styles.alertFeatures}>
                <Feature text="Use a strong unique password" />
                <Feature text="Avoid sharing verification codes" />
                <Feature text="Keep your device protected" />
                <Feature text="Review account activity regularly" />
              </View>
            </View>

            {/* TRUST */}
            <View style={styles.trustContainer}>
              <View style={styles.trustItem}>
                <BadgeCheck
                  size={18}
                  color="#FFFFFF"
                />

                <Text style={styles.trustText}>
                  Security-focused architecture
                </Text>
              </View>

              <View style={styles.trustItem}>
                <KeyRound
                  size={18}
                  color="#FFFFFF"
                />

                <Text style={styles.trustText}>
                  Protected authentication systems
                </Text>
              </View>
            </View>

            {/* FOOTER */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Security systems continuously evolve
                to improve platform protection and
                user safety.
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

    flexDirection: "row",
    alignItems: "center",

    gap: 8,

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

    fontSize: 42,
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

  iconContainer: {
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

    fontSize: 21,
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

  alertCard: {
    marginTop: 8,

    padding: 22,

    borderRadius: 26,

    backgroundColor: "#111111",

    borderWidth: 1,
    borderColor: "#1F1F1F",
  },

  alertHeader: {
    flexDirection: "row",
    alignItems: "center",

    gap: 10,

    marginBottom: 18,
  },

  alertTitle: {
    color: "#FFFFFF",

    fontSize: 17,
    fontWeight: "700",
  },

  alertFeatures: {
    gap: 14,
  },

  trustContainer: {
    marginTop: 24,
    gap: 14,
  },

  trustItem: {
    flexDirection: "row",
    alignItems: "center",

    gap: 12,

    paddingVertical: 18,
    paddingHorizontal: 18,

    borderRadius: 20,

    backgroundColor: "#0E0E0F",

    borderWidth: 1,
    borderColor: "#1A1A1A",
  },

  trustText: {
    color: "#FFFFFF",

    fontSize: 14,
    fontWeight: "600",
  },

  footer: {
    marginTop: 30,
    alignItems: "center",
  },

  footerText: {
    color: "#52525B",

    fontSize: 12,
    textAlign: "center",

    lineHeight: 22,
  },
});