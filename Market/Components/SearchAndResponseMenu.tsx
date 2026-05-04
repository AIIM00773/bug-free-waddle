import { useConversation } from "@/Providers/ConversationProvider";
import { COLORS as THEME_COLORS } from "@/constants";
import { router } from "expo-router";
import {
    ArrowRight,
    LayoutDashboard,
    MessageSquare,
    Plus,
    Trash2,
    User,
    X
} from "lucide-react-native";
import React, { useEffect, useMemo, useRef } from "react";
import {
    Animated,
    Dimensions,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

const COLORS = {
    panelBg: "#032d2b",
    surface: "rgba(255, 255, 255, 0.06)",
    surfaceActive: "rgba(255, 255, 255, 0.12)",
    border: "rgba(255, 255, 255, 0.1)",
    textMain: "#FFFFFF",
    textMuted: "rgba(255, 255, 255, 0.5)",
    accent: THEME_COLORS.accent || "#00FFCC",
};

export default function SearchAndResponseMenuView({ user, visible, onClose, onNewSearchTopicSet }: any) {
    const { conversations, switchConversation, deleteConversation, closeConversation } = useConversation();

    // Animation Refs
    const slideAnim = useRef(new Animated.Value(-width)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            // Slide In
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 350,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                })
            ]).start();
        } else {
            // Slide Out
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: -width,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 0,
                    duration: 250,
                    useNativeDriver: true,
                })
            ]).start();
        }
    }, [visible]);

    const historyItems = useMemo(() => {
        return [...conversations].sort((a, b) =>
            new Date(b.last_update).getTime() - new Date(a.last_update).getTime()
        );
    }, [conversations]);

    const handleStartNew = () => {
        closeConversation();
        onNewSearchTopicSet();
        onClose();
    };

    // If not visible and animation finished, we can return null to save memory
    // but usually, it's better to keep it rendered for smooth re-entry

    return (
        <View style={StyleSheet.absoluteFill} pointerEvents={visible ? "auto" : "none"}>
            {/* Backdrop */}
            <Animated.View style={[styles.backdrop, { opacity: opacityAnim }]}>
                <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
            </Animated.View>

            {/* Sidebar Panel */}
            <Animated.View style={[styles.sidePanel, { transform: [{ translateX: slideAnim }] }]}>
                <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>

                    <View style={styles.header}>

                        <TouchableOpacity style={[styles.newThreadBtn,{display:"flex", flexDirection:"row", alignItems:"center" , paddingHorizontal:10,}]} onPress={handleStartNew} activeOpacity={0.8}>
                            <Plus size={18} color={"aliceblue"} />
                            <Text style={{fontSize:13, color:"aliceblue"}}>  New Search </Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                            <X size={20} color={COLORS.textMain} />
                        </TouchableOpacity>

                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                        <View style={styles.sectionHeader}>
                            <LayoutDashboard size={12} color={COLORS.accent} />
                            <Text style={styles.sectionTitle}>History</Text>
                        </View>

                        {historyItems.length > 0 ? (
                            historyItems.map((item: any) => (
                                <View key={item.conversationId} style={styles.historyRow}>
                                    <TouchableOpacity
                                        style={styles.historyClickArea}
                                        onPress={() => {
                                            closeConversation();
                                            switchConversation(item.conversationId);
                                            onClose();
                                        }}
                                    >
                                        <MessageSquare size={16} color={COLORS.textMuted} />
                                        <Text style={styles.historyLabel} numberOfLines={1}>
                                            {item.title || "Search Inquiry"}
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => deleteConversation(item.conversationId)} style={styles.deleteBtn}>
                                        <Trash2 size={14} color={"rgba(255, 70, 70, 0.5)"} />
                                    </TouchableOpacity>
                                </View>
                            ))
                        ) : (
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>No recent activity</Text>
                            </View>
                        )}
                    </ScrollView>

                    <View style={styles.footer}>

                        <TouchableOpacity
                            style={styles.profileCard}
                            onPress={() => { onClose(); router.push("/General/UserProfile"); }}
                        >
                            <View style={styles.avatarContainer}>
                                <User size={18} color={COLORS.accent} />
                            </View>
                            <View style={styles.userInfo}>
                                <Text style={styles.userDisplayName}>{user?.first_name || 'Explorer'}</Text>
                                <Text style={styles.userStatus}>Verified Profile</Text>
                            </View>
                            <ArrowRight size={14} color={COLORS.textMuted} />
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </Animated.View>
        </View>
    );
}

const FooterLink = ({ icon, label }: any) => (
    <TouchableOpacity style={styles.linkRow}>
        <View style={styles.linkIconWrapper}>{icon}</View>
        <Text style={styles.linkLabel}>{label}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    sidePanel: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        width: width * 0.8,
        backgroundColor: COLORS.panelBg,
        borderRightWidth: 1,
        borderColor: COLORS.border,
        // Using shadow for depth
        shadowColor: "#000",
        shadowOffset: { width: 10, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 24,
    },
    safeArea: { flex: 1 },
    header: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 24,
        gap: 12,
        justifyContent: "space-between"

    },
    newThreadBtn: {
             minWidth: 48,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.border
    },
    closeBtn: {
        width: 48,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.border
    },
    scrollContent: { paddingHorizontal: 20 },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
    sectionTitle: { fontSize: 11, fontWeight: '800', color: COLORS.accent, textTransform: 'uppercase', letterSpacing: 1.2 },
    historyRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        backgroundColor: COLORS.surface,
        borderRadius: 12,
    },
    historyClickArea: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
    historyLabel: { color: COLORS.textMain, fontSize: 14, fontWeight: '500', flex: 1 },
    deleteBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
    emptyContainer: { paddingVertical: 20, alignItems: 'center', opacity: 0.5 },
    emptyText: { color: COLORS.textMuted, fontSize: 13 },
    footer: { padding: 20, borderTopWidth: 1, borderTopColor: COLORS.border },
    linkRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
    linkIconWrapper: { width: 32, height: 32, backgroundColor: COLORS.surface, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
    linkLabel: { color: COLORS.textMain, fontSize: 14, fontWeight: '600' },
    profileCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        backgroundColor: COLORS.surfaceActive,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: COLORS.border,
        gap: 12,
        marginTop: 10
    },
    avatarContainer: { width: 40, height: 40, borderRadius: 12, backgroundColor: COLORS.panelBg, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.accent },
    userInfo: { flex: 1 },
    userDisplayName: { color: COLORS.textMain, fontSize: 15, fontWeight: '700' },
    userStatus: { color: COLORS.accent, fontSize: 10, fontWeight: '800', textTransform: 'uppercase' }
});