import { LinearGradient } from "expo-linear-gradient";

import {
    Bot,
    BrainCircuit,
    Layers3,
    MessageSquareText,
    ScanSearch,
    SearchCheck,
    Sparkles,
    TrendingUp,
    Wand2,
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

export default function IntelligenceScreen() {
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
                  AI Intelligence Engine
                </Text>
              </View>

              <Text style={styles.title}>
                Commerce Powered{"\n"}
                <Text style={styles.titleAccent}>
                  By Intelligence
                </Text>
              </Text>

              <Text style={styles.description}>
                The platform is built around an advanced AI
                intelligence layer capable of understanding
                natural conversations, interpreting shopping
                intent, refining discovery, and delivering
                highly relevant product experiences.
              </Text>
            </View>

            {/* MAIN AI ENGINE */}
            <View style={styles.primaryCard}>
              <View style={styles.primaryIcon}>
                <BrainCircuit
                  size={30}
                  color="#FFFFFF"
                />
              </View>

              <Text style={styles.primaryTitle}>
                Conversational Commerce Intelligence
              </Text>

              <Text style={styles.primaryDescription}>
                Instead of relying on traditional keyword
                searches, the system understands context,
                intent, preferences, budget, product details,
                and conversational refinement to create a more
                natural shopping experience.
              </Text>

              <View style={styles.capabilitiesGrid}>
                <CapabilityChip title="Natural Understanding" />
                <CapabilityChip title="Intent Recognition" />
                <CapabilityChip title="Context Awareness" />
                <CapabilityChip title="Smart Refinement" />
              </View>
            </View>

            {/* CORE INTELLIGENCE */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Core Intelligence Capabilities
              </Text>

              <View style={styles.cardsContainer}>
                <InfoCard
                  icon={
                    <MessageSquareText
                      size={22}
                      color="#60A5FA"
                    />
                  }
                  title="Natural Conversations"
                  description="Users interact naturally with the platform instead of relying on rigid search structures and exact product keywords."
                />

                <InfoCard
                  icon={
                    <SearchCheck
                      size={22}
                      color="#4ADE80"
                    />
                  }
                  title="Intent-Based Discovery"
                  description="The system interprets what the user actually wants, even when requests are incomplete or conversational."
                />

                <InfoCard
                  icon={
                    <TrendingUp
                      size={22}
                      color="#F59E0B"
                    />
                  }
                  title="Adaptive Ranking"
                  description="Results dynamically improve using behavioral understanding, product relevance, interaction quality, and contextual signals."
                />

                <InfoCard
                  icon={
                    <Layers3
                      size={22}
                      color="#A78BFA"
                    />
                  }
                  title="Multi-Layer Reasoning"
                  description="The AI combines filters, semantic understanding, preferences, pricing, and product similarity simultaneously."
                />
              </View>
            </View>

            {/* SYSTEM FLOW */}
            <View style={styles.systemCard}>
              <View style={styles.systemHeader}>
                <View style={styles.systemIcon}>
                  <Bot
                    size={24}
                    color="#FFFFFF"
                  />
                </View>

                <Text style={styles.systemTitle}>
                  Intelligent Decision Flow
                </Text>
              </View>

              <Text style={styles.systemDescription}>
                The intelligence system continuously evaluates
                user input, marketplace data, conversational
                context, and behavioral signals to produce more
                accurate and refined shopping outcomes.
              </Text>

              <View style={styles.flowContainer}>
                <FlowItem title="Conversation Understanding" />

                <FlowLine />

                <FlowItem title="Intent Analysis" />

                <FlowLine />

                <FlowItem title="Contextual Retrieval" />

                <FlowLine />

                <FlowItem title="Smart Ranking" />

                <FlowLine />

                <FlowItem title="Adaptive Results" />
              </View>
            </View>

            {/* AI FEATURES */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                AI-Driven Experiences
              </Text>

              <View style={styles.aiGrid}>
                <MiniCard
                  icon={
                    <ScanSearch
                      size={20}
                      color="#FFFFFF"
                    />
                  }
                  title="Semantic Search"
                />

                <MiniCard
                  icon={
                    <Wand2
                      size={20}
                      color="#FFFFFF"
                    />
                  }
                  title="Smart Refinement"
                />

                <MiniCard
                  icon={
                    <Bot
                      size={20}
                      color="#FFFFFF"
                    />
                  }
                  title="AI Assistance"
                />

                <MiniCard
                  icon={
                    <BrainCircuit
                      size={20}
                      color="#FFFFFF"
                    />
                  }
                  title="Preference Learning"
                />
              </View>
            </View>

            {/* FOOTER */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Designed to make commerce faster, smarter,
                more adaptive, and deeply conversational.
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

function CapabilityChip({
  title,
}: {
  title: string;
}) {
  return (
    <View style={styles.capabilityChip}>
      <Text style={styles.capabilityText}>
        {title}
      </Text>
    </View>
  );
}

function FlowItem({
  title,
}: {
  title: string;
}) {
  return (
    <View style={styles.flowItem}>
      <Text style={styles.flowText}>
        {title}
      </Text>
    </View>
  );
}

function FlowLine() {
  return <View style={styles.flowLine} />;
}

function MiniCard({
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

      <Text style={styles.miniText}>
        {title}
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

    marginBottom: 28,
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

  capabilitiesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,

    marginTop: 24,
  },

  capabilityChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,

    borderRadius: 999,

    backgroundColor: "rgba(255,255,255,0.06)",

    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  capabilityText: {
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

  systemCard: {
    backgroundColor: "rgba(255,255,255,0.05)",

    borderRadius: 30,

    padding: 24,

    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",

    marginBottom: 28,
  },

  systemHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,

    marginBottom: 18,
  },

  systemIcon: {
    width: 56,
    height: 56,

    borderRadius: 18,

    justifyContent: "center",
    alignItems: "center",

    backgroundColor: "rgba(255,255,255,0.08)",
  },

  systemTitle: {
    color: "#FFFFFF",

    fontSize: 22,
    fontWeight: "800",
  },

  systemDescription: {
    color: "#A1A1AA",

    fontSize: 15,
    lineHeight: 26,

    marginBottom: 24,
  },

  flowContainer: {
    gap: 10,
  },

  flowItem: {
    paddingVertical: 16,
    paddingHorizontal: 18,

    borderRadius: 18,

    backgroundColor: "rgba(255,255,255,0.04)",

    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },

  flowText: {
    color: "#FFFFFF",

    fontSize: 14,
    fontWeight: "600",
  },

  flowLine: {
    width: 1,
    height: 16,

    backgroundColor: "rgba(255,255,255,0.12)",

    alignSelf: "center",
  },

  aiGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",

    gap: 14,
  },

  miniCard: {
    width: "47%",

    backgroundColor: "rgba(255,255,255,0.05)",

    borderRadius: 22,

    paddingVertical: 22,

    justifyContent: "center",
    alignItems: "center",

    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },

  miniIcon: {
    width: 50,
    height: 50,

    borderRadius: 18,

    justifyContent: "center",
    alignItems: "center",

    backgroundColor: "rgba(255,255,255,0.08)",

    marginBottom: 14,
  },

  miniText: {
    color: "#FFFFFF",

    fontSize: 14,
    fontWeight: "700",
  },

  footer: {
    marginTop: 10,
    alignItems: "center",
  },

  footerText: {
    color: "#6B7280",

    fontSize: 12,
    lineHeight: 22,

    textAlign: "center",
  },
});