import {
    Bell,
    ChevronLeft,
    ChevronRight,
    CreditCard,
    Edit3, // Renamed from EditIcon for Lucide standard
    Heart,
    LogOut,
    MapPin,
    Package,
    Settings,
    ShieldCheck,
    User
} from "lucide-react-native";
import React from "react";
import {
    Dimensions,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuth } from "@/Providers/AuthProvider";
import EditProfileModal from "@/app/AppForms/EditProfileScreen";
import ProfileSettingsScreen from "@/app/AppForms/ProfileSettingsScreen";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

const { width } = Dimensions.get("window");

// Harmonized Palette
const THEME = {
    primary: "#10B981", // Emerald
    bg: "#022c2a",      // Deep Dark Green
    surface: "rgba(255, 255, 255, 0.05)",
    textMain: "#F3F4F6",
    textMuted: "#94A3B8",
    danger: "#FF4D4D",
    glass: "rgba(255, 255, 255, 0.1)",
};

export default function UserProfileView() {
    const { user, logout } = useAuth();
    const [openEditModal, setOpenEditModal] = React.useState(false);
    const [profileSettingsOpen, setProfileSettingsOpen] = React.useState<boolean>(false);

    const profile = user?.profile || {};
    const addresses = profile?.shipping_addresses || [];
    const defaultAddress = addresses.find((a: any) => a.defaultAddress) || addresses[0];

    return (
        <View style={styles.mainContainer}>
            <StatusBar barStyle="light-content" />

            {/* --- HERO SECTION --- */}
            {!openEditModal && !profileSettingsOpen && (
                <>
                    <LinearGradient 
                        colors={['#033e3b', '#022c2a']} 
                        style={styles.topHero}
                    >
                        <SafeAreaView style={styles.safeHeader}>
                            <View style={styles.navBar}>
                                <TouchableOpacity onPress={() => router.back()} style={styles.glassIcon}>
                                    <ChevronLeft size={22} color={THEME.textMain} />
                                </TouchableOpacity>

                                <View style={styles.navActions}>
                                    <TouchableOpacity 
                                        style={styles.glassIcon} 
                                        onPress={() => setProfileSettingsOpen(true)}
                                    >
                                        <Settings size={20} color={THEME.textMain} />
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        style={styles.glassIcon} 
                                        onPress={() => setOpenEditModal(true)}
                                    >
                                        <Edit3 size={20} color={THEME.textMain} />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={styles.profileInfo}>
                                <View style={styles.avatarCircle}>
                                    <User size={40} color={THEME.primary} />
                                </View>
                                <View style={styles.heroTextContainer}>
                                 
                                    <Text style={styles.userEmail}>{user?.email || "No email connected"}</Text>
                                    <View style={styles.statusBadge}>
                                        <View style={styles.statusDot} />
                                        <Text style={styles.statusText}>Active </Text>
                                    </View>
                                </View>
                            </View>
                        </SafeAreaView>
                    </LinearGradient>

                    <ScrollView 
                        showsVerticalScrollIndicator={false} 
                        contentContainerStyle={styles.scrollBody}
                    >
                        {/* --- COMMERCE SECTION --- */}
                        <Text style={styles.sectionLabel}>SHOPPING ACTIVITY</Text>
                        <View style={styles.cardGroup}>
                            <MenuLink 
                                icon={<Package size={18} color={THEME.primary} />} 
                                label="Order History" 
                                sub="Track your recent deliveries"
                            />
                            <MenuLink 
                                icon={<Heart size={18} color={THEME.primary} />} 
                                label="Saved Discoveries" 
                                sub="Items you loved"
                            />
                            <MenuLink
                                icon={<MapPin size={18} color={THEME.primary} />}
                                label="Shipping Map"
                                sub={defaultAddress ? `${defaultAddress.city}, ${defaultAddress.country}` : "Add a delivery address"}
                                count={addresses.length > 0 ? `${addresses.length}` : undefined}
                                onPress={() => router.push("/General/UserAddresses")}
                            />
                        </View>

                        {/* --- SETTINGS SECTION --- */}
                        <Text style={styles.sectionLabel}>PREFERENCES & SECURITY</Text>
                        <View style={styles.cardGroup}>
                            <MenuLink icon={<CreditCard size={18} color={THEME.textMuted} />} label="Nexus Pay" sub="Manage cards & wallets" />
                            <MenuLink icon={<Bell size={18} color={THEME.textMuted} />} label="Alert Settings" sub="Price drops & updates" />
                            <MenuLink icon={<ShieldCheck size={18} color={THEME.textMuted} />} label="Privacy Protocol" />
                        </View>

                        {/* --- LOGOUT --- */}
                        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                            <LogOut size={18} color={THEME.danger} />
                            <Text style={styles.logoutButtonText}>TERMINATE SESSION</Text>
                        </TouchableOpacity>

                        <Text style={styles.versionTag}>DROP NEXUS PROTOCOL v0.6 • 2026</Text>
                    </ScrollView>
                </>
            )}

            <EditProfileModal visible={openEditModal} onClose={() => setOpenEditModal(false)} />
            <ProfileSettingsScreen visible={profileSettingsOpen} onClose={() => setProfileSettingsOpen(false)} />
        </View>
    );
}

const MenuLink = ({ icon, label, count, sub, onPress }: any) => (
    <TouchableOpacity style={styles.menuRow} activeOpacity={0.7} onPress={onPress}>
        <View style={styles.iconBox}>{icon}</View>
        <View style={styles.rowContent}>
            <Text style={styles.rowLabel}>{label}</Text>
            {sub && <Text style={styles.rowSub}>{sub}</Text>}
        </View>
        <View style={styles.rowRight}>
            {count && (
                <View style={styles.countBadge}>
                    <Text style={styles.countText}>{count}</Text>
                </View>
            )}
            <ChevronRight size={16} color="rgba(255,255,255,0.2)" />
        </View>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: THEME.bg },
    topHero: { paddingBottom: 30, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 },
    safeHeader: { paddingHorizontal: 24 },
    navBar: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: Platform.OS === "android" ? 10 : 0,
        marginBottom: 25,
    },
    glassIcon: {
        width: 42,
        height: 42,
        borderRadius: 14,
        backgroundColor: THEME.glass,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.05)",
    },
    navActions: { flexDirection: "row", gap: 12 },
    profileInfo: { flexDirection: "row", alignItems: "center", gap: 18 },
    avatarCircle: {
        width: 80,
        height: 80,
        borderRadius: 50,
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: THEME.primary,
    },
    heroTextContainer: { flex: 1 },
    userName: { fontSize: 26, fontWeight: "900", color: THEME.textMain, letterSpacing: -0.5 },
    userEmail: { fontSize: 14, color: THEME.textMuted, marginTop: 2 },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(16, 185, 129, 0.15)',
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        marginTop: 8,
    },
    statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: THEME.primary, marginRight: 6 },
    statusText: { fontSize: 10, fontWeight: "800", color: THEME.primary },

    scrollBody: { padding: 24, paddingBottom: 60 },
    sectionLabel: {
        fontSize: 12,
        fontWeight: "800",
        color: THEME.textMuted,
        letterSpacing: 1.5,
        marginBottom: 16,
        marginLeft: 4,
    },
    cardGroup: {
        backgroundColor: THEME.surface,
        borderRadius: 24,
        padding: 8,
        marginBottom: 32,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.05)",
    },
    menuRow: {
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        borderRadius: 18,
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: "rgba(255,255,255,0.03)",
        justifyContent: "center",
        alignItems: "center",
    },
    rowContent: { flex: 1, marginLeft: 16 },
    rowLabel: { fontSize: 16, fontWeight: "600", color: THEME.textMain },
    rowSub: { fontSize: 12, color: THEME.textMuted, marginTop: 2 },
    rowRight: { flexDirection: "row", alignItems: "center", gap: 12 },
    countBadge: {
        backgroundColor: THEME.primary,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
    },
    countText: { fontSize: 10, fontWeight: "900", color: "#000" },

    logoutButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 18,
        borderRadius: 20,
        backgroundColor: "rgba(255, 77, 77, 0.08)",
        borderWidth: 1,
        borderColor: "rgba(255, 77, 77, 0.2)",
        gap: 12,
        marginTop: 10,
    },
    logoutButtonText: { color: THEME.danger, fontWeight: "800", fontSize: 14, letterSpacing: 1 },
    versionTag: { 
        textAlign: "center", 
        fontSize: 10, 
        color: THEME.textMuted, 
        marginTop: 40, 
        fontWeight: '600' 
    },
});