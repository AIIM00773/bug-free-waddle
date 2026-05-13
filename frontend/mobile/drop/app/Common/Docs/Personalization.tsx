import { LinearGradient } from "expo-linear-gradient";

import {
    Brain,
    Clock3,
    Heart,
    Layers3,
    ShieldCheck,
    Sparkles,
    TrendingUp,
    UserRound,
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

export default function PersonalizationScreen() {
  return (
    <>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      <LinearGradient
        colors={["#050816", "#070B14", "#111827"]}
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
                <Sparkles size={14} color="#FFFFFF" />

                <Text style={styles.badgeText}>
                  Personalized AI Experience
                </Text>
              </View>

              <Text style={styles.title}>
                Shopping That{"\n"}
                <Text style={styles.titleAccent}>
                  Understands You
                </Text>
              </Text>

              <Text style={styles.description}>
                The platform continuously adapts to your
                interests, shopping habits, conversations,
                preferences, and interactions to create a
                smarter and more relevant experience over time.
              </Text>
            </View>

            {/* MAIN PERSONALIZATION */}
            <View style={styles.primaryCard}>
              <View style={styles.primaryIcon}>
                <Brain size={30} color="#FFFFFF" />
              </View>

              <Text style={styles.primaryTitle}>
                AI-Powered Preference Learning
              </Text>

              <Text style={styles.primaryDescription}>
                The system intelligently understands your
                preferences through interactions, helping
                surface products, merchants, and suggestions
                that align with your needs and shopping style.
              </Text>

              <View style={styles.primaryGrid}>
                <FeatureChip title="Style Preferences" />
                <FeatureChip title="Budget Awareness" />
                <FeatureChip title="Shopping Patterns" />
                <FeatureChip title="Search Behavior" />
              </View>
            </View>

            {/* PERSONALIZATION FEATURES */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Personalized Features
              </Text>

              <View style={styles.cardsContainer}>
                <InfoCard
                  icon={
                    <Heart
                      size={22}
                      color="#F87171"
                    />
                  }
                  title="Smart Recommendations"
                  description="Discover products and merchants based on your interests, previous interactions, and browsing behavior."
                />

                <InfoCard
                  icon={
                    <Clock3
                      size={22}
                      color="#38BDF8"
                    />
                  }
                  title="Adaptive Experience"
                  description="The platform evolves continuously to improve relevance, speed, and overall shopping experience."
                />

                <InfoCard
                  icon={
                    <TrendingUp
                      size={22}
                      color="#4ADE80"
                    />
                  }
                  title="Relevant Discovery"
                  description="Receive more accurate suggestions and trending products aligned with your preferences."
                />

                <InfoCard
                  icon={
                    <Layers3
                      size={22}
                      color="#A78BFA"
                    />
                  }
                  title="Context Awareness"
                  description="AI understands conversational context to refine search results and recommendations naturally."
                />
              </View>
            </View>

            {/* USER CONTROL */}
            <View style={styles.controlCard}>
              <View style={styles.controlHeader}>
                <View style={styles.controlIcon}>
                  <UserRound
                    size={22}
                    color="#FFFFFF"
                  />
                </View>

                <Text style={styles.controlTitle}>
                  You Stay In Control
                </Text>
              </View>

              <Text style={styles.controlDescription}>
                Personalization is designed to improve your
                experience while giving you control over your
                account, preferences, recommendations, and
                privacy settings.
              </Text>

              <View style={styles.controlList}>
                <ControlItem text="Manage personalization preferences" />

                <ControlItem text="Update interests and shopping preferences" />

                <ControlItem text="Control recommendation relevance" />

                <ControlItem text="Review and manage account activity" />
              </View>
            </View>

            {/* PRIVACY NOTE */}
            <View style={styles.privacyCard}>
              <View style={styles.privacyIcon}>
                <ShieldCheck
                  size={20}
                  color="#FFFFFF"
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.privacyTitle}>
                  Privacy-Conscious Personalization
                </Text>

                <Text style={styles.privacyText}>
                  Personalization systems are designed with
                  privacy and account protection in mind to
                  ensure a secure and trustworthy experience.
                </Text>
              </View>
            </View>

            {/* FOOTER */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Built to create a more intelligent, relevant,
                and seamless commerce experience.
              </Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </>
  );
}

function InfoCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <View style={styles.infoCard}>
      <View style={styles.infoIcon}>
        {icon}
      </View>

      <Text style={styles.infoTitle}>
        {title}
      </Text>

      <Text style={styles.infoDescription}>
        {description}
      </Text>
    </View>
  );
}

function FeatureChip({
  title,
}: {
  title: string;
}) {
  return (
    <View style={styles.featureChip}>
      <Text style={styles.featureChipText}>
        {title}
      </Text>
    </View>
  );
}

function ControlItem({
  text,
}: {
  text: string;
}) {
  return (
    <View style={styles.controlItem}>
      <View style={styles.controlDot} />

      <Text style={styles.controlItemText}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050816",
  },

  safeArea: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
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
    paddingVertical: 9,

    borderRadius: 999,

    backgroundColor: "rgba(255,255,255,0.06)",

    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",

    marginBottom: 24,
  },

  badgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },

  title: {
    color: "#FFFFFF",

    fontSize: 40,
    fontWeight: "800",

    lineHeight: 48,
    letterSpacing: -2,
  },

  titleAccent: {
    color: "#D4D4D8",
  },

  description: {
    marginTop: 18,

    color: "#9CA3AF",

    fontSize: 15,
    lineHeight: 28,
  },

  primaryCard: {
    backgroundColor: "rgba(255,255,255,0.05)",

    borderRadius: 30,

    padding: 24,

    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",

    marginBottom: 26,
  },

  primaryIcon: {
    width: 64,
    height: 64,

    borderRadius: 22,

    justifyContent: "center",
    alignItems: "center",

    backgroundColor: "rgba(255,255,255,0.08)",

    marginBottom: 22,
  },

  primaryTitle: {
    color: "#FFFFFF",

    fontSize: 24,
    fontWeight: "800",

    marginBottom: 14,
  },

  primaryDescription: {
    color: "#A1A1AA",

    fontSize: 15,
    lineHeight: 26,
  },

  primaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,

    marginTop: 24,
  },

  featureChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,

    borderRadius: 999,

    backgroundColor: "rgba(255,255,255,0.06)",

    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  featureChipText: {
    color: "#FFFFFF",

    fontSize: 13,
    fontWeight: "600",
  },

  section: {
    marginBottom: 28,
  },

  sectionTitle: {
    color: "#FFFFFF",

    fontSize: 22,
    fontWeight: "800",

    marginBottom: 18,
  },

  cardsContainer: {
    gap: 16,
  },

  infoCard: {
    backgroundColor: "rgba(255,255,255,0.04)",

    borderRadius: 26,

    padding: 22,

    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },

  infoIcon: {
    width: 52,
    height: 52,

    borderRadius: 18,

    justifyContent: "center",
    alignItems: "center",

    backgroundColor: "rgba(255,255,255,0.06)",

    marginBottom: 18,
  },

  infoTitle: {
    color: "#FFFFFF",

    fontSize: 18,
    fontWeight: "700",

    marginBottom: 10,
  },

  infoDescription: {
    color: "#A1A1AA",

    fontSize: 14,
    lineHeight: 24,
  },

  controlCard: {
    backgroundColor: "rgba(255,255,255,0.05)",

    borderRadius: 28,

    padding: 24,

    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",

    marginBottom: 22,
  },

  controlHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,

    marginBottom: 18,
  },

  controlIcon: {
    width: 52,
    height: 52,

    borderRadius: 18,

    justifyContent: "center",
    alignItems: "center",

    backgroundColor: "rgba(255,255,255,0.08)",
  },

  controlTitle: {
    color: "#FFFFFF",

    fontSize: 20,
    fontWeight: "800",
  },

  controlDescription: {
    color: "#A1A1AA",

    fontSize: 15,
    lineHeight: 26,

    marginBottom: 20,
  },

  controlList: {
    gap: 16,
  },

  controlItem: {
    flexDirection: "row",
    alignItems: "center",
  },

  controlDot: {
    width: 8,
    height: 8,

    borderRadius: 999,

    backgroundColor: "#FFFFFF",

    marginRight: 12,
  },

  controlItemText: {
    flex: 1,

    color: "#E5E7EB",

    fontSize: 14,
    lineHeight: 24,
  },

  privacyCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,

    backgroundColor: "rgba(255,255,255,0.04)",

    borderRadius: 24,

    padding: 20,

    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },

  privacyIcon: {
    width: 48,
    height: 48,

    borderRadius: 16,

    justifyContent: "center",
    alignItems: "center",

    backgroundColor: "rgba(255,255,255,0.08)",
  },

  privacyTitle: {
    color: "#FFFFFF",

    fontSize: 16,
    fontWeight: "700",

    marginBottom: 8,
  },

  privacyText: {
    color: "#A1A1AA",

    fontSize: 14,
    lineHeight: 24,
  },

  footer: {
    marginTop: 30,
    alignItems: "center",
  },

  footerText: {
    color: "#6B7280",

    fontSize: 12,
    textAlign: "center",
    lineHeight: 22,
  },
});