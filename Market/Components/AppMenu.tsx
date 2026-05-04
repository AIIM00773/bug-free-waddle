import { useAuth } from "@/Providers/AuthProvider";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  ChevronRight,
  Grid2X2Check,
  HelpCircle,
  LogOut,
  MapPin,
  MessageCircle,
  Package,
  Settings,
  ShoppingBag,
  Sparkles,
  UserPlus,
  X
} from "lucide-react-native";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

// Harmonized with your InitScreen Green/Emerald palette
const THEME = {
  bg: "#033e3b",
  panel: "#022c2a",
  border: "rgba(255, 255, 255, 0.1)",
  text: "#F3F4F6",
  subtext: "#94A3B8",
  accent: "#10B981", // Emerald Green
  danger: "#FF4D4D",
};

interface MenuProps {
  visible: boolean;
  onClose: () => void;
}

export default function MenuView({ visible, onClose }: MenuProps) {
  const { logout, user, isAuthenticated } = useAuth();
  const slideAnim = useRef(new Animated.Value(-width)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: 0, duration: 350, useNativeDriver: true }),
        Animated.timing(opacityAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: -width, duration: 300, useNativeDriver: true }),
        Animated.timing(opacityAnim, { toValue: 0, duration: 250, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);


  const handleNavigation = (path: string) => {
    onClose();
    router.push(path as any);
  };

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents={visible ? "auto" : "none"}>
      {/* BACKDROP */}
      <Animated.View style={[styles.backdrop, { opacity: opacityAnim }]}>
        <TouchableOpacity style={styles.flex1} activeOpacity={1} onPress={onClose} />
      </Animated.View>

      {/* SIDE PANEL */}
      <Animated.View style={[styles.sidePanel, { transform: [{ translateX: slideAnim }] }]}>
        <LinearGradient colors={[THEME.panel, "#011a19"]} style={styles.flex1}>
          <SafeAreaView style={styles.flex1}>

            {/* HEADER */}
            <View style={styles.header}>
              <View>
                <Text style={styles.brandText}>Drop AI</Text>
                <Text style={styles.versionText}> v0.6</Text>
              </View>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <X size={20} color={THEME.text} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

              {/* AI ASSISTANT PROMO */}
              <TouchableOpacity style={styles.aiBanner} activeOpacity={0.8}>
                <BlurView intensity={20} tint="light" style={StyleSheet.absoluteFill} />
                <View style={styles.aiIconWrap}>
                  <Sparkles size={20} color={THEME.accent} />
                </View>
                <View style={styles.flex1}>
                  <Text style={styles.aiTitle}>Drop Assistant</Text>
                  <Text style={styles.aiSub}>AI-Powered Commerce</Text>
                </View>
              </TouchableOpacity>

              {/* COMMERCE SECTION */}
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>COMMERCE</Text>
                <MenuRow
                  icon={<UserPlus size={18} color={THEME.accent} />}
                  label="Account Profile"
                  onPress={() => handleNavigation("/General/UserProfile")}
                />
                <MenuRow
                  icon={<ShoppingBag size={18} color={THEME.accent} />}
                  label="Shopping Bag"
                  badge="3"
                  onPress={() => handleNavigation("/General/UserCart")}
                />
                <MenuRow
                  icon={<Grid2X2Check size={18} color={THEME.accent} />}
                  label="Discoveries"
                  onPress={() => handleNavigation("/General/SearchAndResponse")}
                />
                <MenuRow
                  icon={<MessageCircle size={18} color={THEME.accent} />}
                  label="In-App Chats"
                  onPress={() => handleNavigation("/General/Inbox")}
                />
                <MenuRow
                  icon={<Package size={18} color={THEME.accent} />}
                  label="Track Orders"
                  onPress={() => handleNavigation("/General/Orders")}
                />
              </View>

              {/* PREFERENCES */}
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>PREFERENCES</Text>
                <MenuRow icon={<MapPin size={18} color={THEME.subtext} />} label="Location" sub="Nairobi, KE" />
                <MenuRow icon={<Settings size={18} color={THEME.subtext} />} label="Settings" />
                <MenuRow icon={<HelpCircle size={18} color={THEME.subtext} />} label="Support Center" />
              </View>
            </ScrollView>

            {/* FOOTER */}
            <View style={styles.footer}>
              {user && isAuthenticated ? (
                <TouchableOpacity
                  style={styles.logoutBtn}
                  onPress={() => { logout(); onClose(); }}
                >
                  <LogOut size={18} color={THEME.danger} />
                  <Text style={styles.logoutText}>End Session</Text>
                </TouchableOpacity>
              ) : (
                <View style={undefined}>
                  <TouchableOpacity
                    style={styles.loginBtn}
                    onPress={() => handleNavigation("/AppForms/Signup")}
                  >
                    <Text style={styles.loginBtnText}>Get Started</Text>
                  </TouchableOpacity>
                </View>
              )}

          </View>
          </SafeAreaView>
        </LinearGradient>
      </Animated.View>
    </View>
  );
}




const MenuRow = ({ icon, label, badge, sub, onPress }: any) => (
  <TouchableOpacity style={styles.menuRow} onPress={onPress} activeOpacity={0.7}>
    <View style={styles.rowIconWrap}>{icon}</View>
    <View style={styles.flex1}>
      <Text style={styles.rowLabel}>{label}</Text>
      {sub && <Text style={styles.rowSub}>{sub}</Text>}
    </View>
    {badge ? (
      <View style={styles.badge}><Text style={styles.badgeText}>{badge}</Text></View>
    ) : (
      <ChevronRight size={14} color="rgba(255,255,255,0.15)" />
    )}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  sidePanel: {
    width: width * 0.8,
    height: '100%',
    borderRightWidth: 1,
    borderColor: THEME.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 30,
  },
  brandText: {
    fontSize: 22,
    fontWeight: '900',
    color: THEME.text,
    letterSpacing: -0.5,
  },
  versionText: {
    fontSize: 10,
    fontWeight: '700',
    color: THEME.accent,
    textTransform: 'uppercase',
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: { paddingHorizontal: 20 },
  aiBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    gap: 12,
    marginBottom: 30,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  aiIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiTitle: { color: THEME.text, fontSize: 15, fontWeight: '700' },
  aiSub: { color: THEME.subtext, fontSize: 11 },
  section: { marginBottom: 30 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: THEME.subtext,
    letterSpacing: 1.5,
    marginBottom: 15,
    opacity: 0.5,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    gap: 15,
  },
  rowIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.03)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowLabel: { fontSize: 16, fontWeight: '500', color: THEME.text },
  rowSub: { fontSize: 12, color: THEME.subtext, marginTop: 2 },
  badge: { backgroundColor: THEME.accent, paddingHorizontal: 8, borderRadius: 10 },
  badgeText: { fontSize: 10, fontWeight: '900', color: '#000' },
  footer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: THEME.border,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 15,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 77, 77, 0.05)',
  },
  logoutText: { color: THEME.danger, fontWeight: '700', fontSize: 15 },
  loginBtn: {
    backgroundColor: THEME.accent,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  loginBtnText: { color: '#000', fontWeight: '800', fontSize: 15 },
  secureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 20,
  },
  secureText: { fontSize: 10, color: THEME.subtext, fontWeight: '600' },
});