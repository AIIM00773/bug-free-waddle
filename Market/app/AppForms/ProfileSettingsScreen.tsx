import React, { useState } from "react";
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    ScrollView,
    Switch,
    StatusBar,
    Modal,
} from "react-native";
import {
    ChevronLeft,
    Bell,
    Lock,
    Eye,
    Smartphone,
    Globe,
    ShieldCheck,
    ChevronRight,
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const COLORS = {
    primary: "#22C55E",
    primaryGhost: "#F0FDF4",
    dark: "#0D1B1E",
    bg: "#F9FAFB",
    surface: "#FFFFFF",
    textMuted: "#6B7280",
    border: "#F3F4F6",
};

interface SettingItemProps {
    icon: React.ReactNode;
    label: string;
    sub?: string;
    hasSwitch?: boolean;
    switchValue?: boolean;
    onSwitchChange?: (val: boolean) => void;
    onPress?: () => void;
    isLast?: boolean;
}

export default function ProfileSettingsScreen({ visible, onClose }: { visible: boolean; onClose: () => void }) {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [pushEnabled, setPushEnabled] = useState(true);
    const [faceIdEnabled, setFaceIdEnabled] = useState(true);

    return (
        <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
            <View style={styles.modalOverlay}>
                <StatusBar barStyle="light-content" />

                <SafeAreaView style={styles.modalContent} edges={['top']}>
                    {/* --- DRAG HANDLE --- */}
                    <View style={styles.handleContainer}>
                        <View style={styles.handleBar} />
                    </View>

                    {/* --- HEADER --- */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={onClose} style={styles.backButton}>
                            <ChevronLeft size={24} color={COLORS.dark} />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>SETTINGS</Text>
                        <View style={{ width: 40 }} />
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>

                        {/* --- NOTIFICATIONS --- */}
                        <Text style={styles.sectionLabel}>NOTIFICATIONS & SOUNDS</Text>
                        <View style={styles.card}>
                            <SettingItem
                                icon={<Bell size={20} color={COLORS.primary} />}
                                label="Push Notifications"
                                hasSwitch
                                switchValue={pushEnabled}
                                onSwitchChange={setPushEnabled}
                            />
                            <SettingItem
                                icon={<Smartphone size={20} color={COLORS.primary} />}
                                label="In-App Vibrations"
                                hasSwitch
                                switchValue={true}
                                isLast
                            />
                        </View>

                        {/* --- SECURITY --- */}
                        <Text style={styles.sectionLabel}>SECURITY & PRIVACY</Text>
                        <View style={styles.card}>
                            <SettingItem
                                icon={<Lock size={20} color={COLORS.primary} />}
                                label="Change Password"
                            />
                            <SettingItem
                                icon={<ShieldCheck size={20} color={COLORS.primary} />}
                                label="Two-Factor Auth"
                                sub="Highly Recommended"
                            />
                            <SettingItem
                                icon={<Eye size={20} color={COLORS.primary} />}
                                label="Biometric Login"
                                hasSwitch
                                switchValue={faceIdEnabled}
                                onSwitchChange={setFaceIdEnabled}
                                isLast
                            />
                        </View>

                        {/* --- PREFERENCES --- */}
                        <Text style={styles.sectionLabel}>PREFERENCES</Text>
                        <View style={styles.card}>
                            <SettingItem
                                icon={<Globe size={20} color={COLORS.primary} />}
                                label="Language"
                                sub="English (US)"
                            />
                            <SettingItem
                                icon={<Smartphone size={20} color={COLORS.primary} />}
                                label="Dark Mode"
                                hasSwitch
                                switchValue={isDarkMode}
                                onSwitchChange={setIsDarkMode}
                                isLast
                            />
                        </View>

                        <Text style={styles.versionText}>DropAI v2.4.1 (Stable Build)</Text>
                    </ScrollView>
                </SafeAreaView>
            </View>
        </Modal>
    );
}

const SettingItem = ({
                         icon,
                         label,
                         sub,
                         hasSwitch,
                         switchValue,
                         onSwitchChange,
                         onPress,
                         isLast
                     }: SettingItemProps) => (
    <TouchableOpacity
        style={[styles.itemRow, !isLast && styles.itemBorder]}
        activeOpacity={hasSwitch ? 1 : 0.7}
        onPress={onPress}
        disabled={hasSwitch}
    >
        <View style={styles.iconBox}>{icon}</View>

        <View style={styles.textContainer}>
            <Text style={styles.itemLabel}>{label}</Text>
            {sub && <Text style={styles.itemSubText}>{sub}</Text>}
        </View>

        {hasSwitch ? (
            <Switch
                trackColor={{ false: "#E5E7EB", true: COLORS.primary }}
                thumbColor={"#FFF"}
                ios_backgroundColor="#E5E7EB"
                onValueChange={onSwitchChange}
                value={switchValue}
            />
        ) : (
            <ChevronRight size={18} color="#D1D5DB" />
        )}
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.2)",
        justifyContent: "flex-end",
    },
    modalContent: {
        backgroundColor: COLORS.bg,
        height: "98%",
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 20,
        marginHorizontal:8,
    },
    handleContainer: {
        alignItems: "center",
        paddingVertical: 12,
    },
    handleBar: {
        width: 40,
        height: 5,
        borderRadius: 3,
        backgroundColor: "#E5E7EB",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingBottom: 15,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.surface,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    headerTitle: {
        fontSize: 13,
        fontWeight: "900",
        letterSpacing: 1.5,
        color: COLORS.dark,
    },
    scrollBody: {
        padding: 20,
    },
    sectionLabel: {
        fontSize: 11,
        fontWeight: "800",
        color: COLORS.textMuted,
        letterSpacing: 1.2,
        marginBottom: 10,
        marginLeft: 4,
        textTransform: "uppercase",
    },
    card: {
        backgroundColor: COLORS.surface,
        borderRadius: 20,
        paddingHorizontal: 16,
        marginBottom: 25,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    itemRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 16,
    },
    itemBorder: {
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: COLORS.primaryGhost,
        justifyContent: "center",
        alignItems: "center",
    },
    textContainer: {
        flex: 1,
        marginLeft: 15,
    },
    itemLabel: {
        fontSize: 15,
        fontWeight: "700",
        color: COLORS.dark,
    },
    itemSubText: {
        fontSize: 12,
        color: COLORS.textMuted,
        marginTop: 2,
    },
    versionText: {
        textAlign: "center",
        fontSize: 11,
        color: "#9CA3AF",
        fontWeight: "600",
        marginTop: 10,
        marginBottom: 40,
    },
});