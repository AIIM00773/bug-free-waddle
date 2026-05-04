import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import {
    BadgeCheck,
    ChevronRight,
    MapPin, MessageCircle,
    Plus,
    ShoppingBag,
    Star,
    X
} from "lucide-react-native";

import React, { useState } from "react";
import {
    Dimensions,
    Image,
    Modal, ScrollView,
    StatusBar,
    StyleSheet, Text, TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const THEME = {
    primary: "#48cae4",
    accent: "#00B4D8",
    dark: "#111827",
    gray: "#64748B",
    softBg: "#F8FAFC",
    white: "#FFFFFF"
};

export default function MerchantProfileView({ onClose }: any) {
    const [openChat, setOpenChat] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);

    const StatItem = ({ label, value, icon: Icon }: any) => (
        <View style={styles.statContainer}>
            <View style={styles.statIconCircle}><Icon size={14} color={THEME.dark} /></View>
            <View>
                <Text style={styles.statValue}>{value}</Text>
                <Text style={styles.statLabel}>{label}</Text>
            </View>
        </View>
    );

    return (
        <Modal visible animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
            <View style={styles.mainContainer}>
                <StatusBar barStyle="light-content" />

                <ScrollView showsVerticalScrollIndicator={false} stickyHeaderIndices={[1]}>
                    {/* --- PARALLAX BANNER --- */}
                    <View style={styles.bannerContainer}>
                        <Image
                            source={{ uri: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1000" }}
                            style={styles.bannerImg}
                        />
                        <LinearGradient colors={['rgba(0,0,0,0.4)', 'transparent']} style={styles.bannerOverlay} />
                        <TouchableOpacity style={styles.closeFloat} onPress={onClose}>
                            <X size={20} color="#FFF" />
                        </TouchableOpacity>
                    </View>

                    {/* --- PROFILE HEADER CARD --- */}
                    <View style={styles.profileCard}>
                        <View style={styles.avatarOverlap}>
                            <Image source={{ uri: "https://via.placeholder.com/150" }} style={styles.avatarImg} />
                            <View style={styles.activeIndicator} />
                        </View>

                        <View style={styles.topRow}>
                            <View style={{ flex: 1 }}>
                                <View style={styles.nameContainer}>
                                    <Text style={styles.merchantName}>Doe-Drips</Text>
                                    <BadgeCheck size={20} color={THEME.primary} fill={THEME.primary + "20"} />
                                </View>
                                <View style={styles.locRow}>
                                    <MapPin size={12} color={THEME.gray} />
                                    <Text style={styles.locText}>Nairobi · Trusted Seller</Text>
                                </View>
                            </View>
                            <TouchableOpacity
                                style={[styles.followAction, isFollowing && styles.followingAction]}
                                onPress={() => setIsFollowing(!isFollowing)}
                            >
                                <Text style={[styles.followText, isFollowing && styles.followingText]}>
                                    {isFollowing ? "Following" : "Follow"}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.bio}>
                            Curating the future of African streetwear. Exclusive drops only.
                            Authenticity guaranteed by Drop AI. 🇰🇪✨
                        </Text>

                        <View style={styles.statsStrip}>
                            <StatItem label="Followers" value="1.2k" icon={Plus} />
                            <StatItem label="Rating" value="4.9" icon={Star} />
                            <StatItem label="Active Drops" value="42" icon={ShoppingBag} />
                        </View>
                    </View>

                    {/* --- PRODUCT GRID --- */}
                    <View style={styles.contentBody}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>LATEST DROPS</Text>
                            <TouchableOpacity style={styles.viewAllBtn}>
                                <Text style={styles.viewAllText}>View All</Text>
                                <ChevronRight size={14} color={THEME.primary} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.productGrid}>
                            {[1, 2, 3, 4].map((i) => (
                                <View key={i} style={styles.gridCard}>
                                    <View style={styles.imagePlaceholder}>
                                        <LinearGradient colors={['#F1F5F9', '#E2E8F0']} style={styles.flex1} />
                                        <View style={styles.priceFloating}>
                                            <Text style={styles.priceText}>$120</Text>
                                        </View>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>
                </ScrollView>

                {/* --- PERSISTENT CHAT TRIGGER --- */}
                <SafeAreaView edges={['bottom']} style={styles.footerSticky}>
                    <TouchableOpacity style={styles.mainMsgBtn} onPress={() => router.push("/General/Inbox")}>
                        <MessageCircle size={20} color={THEME.white} strokeWidth={2.5} />
                        <Text style={styles.mainMsgText}>Inquire with Merchant</Text>
                    </TouchableOpacity>
                </SafeAreaView>

             
            </View>
        </Modal>
    );
}



const styles = StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: THEME.softBg },
    flex1: { flex: 1 },
    bannerContainer: { height: 200 },
    bannerImg: { width: '100%', height: '100%' },
    bannerOverlay: { ...StyleSheet.absoluteFillObject },
    closeFloat: { position: 'absolute', top: 20, right: 20, backgroundColor: 'rgba(0,0,0,0.5)', padding: 8, borderRadius: 20 },

    profileCard: { backgroundColor: THEME.white, marginTop: -30, borderTopLeftRadius: 32, borderTopRightRadius: 32, paddingHorizontal: 24, paddingBottom: 24 },
    avatarOverlap: { marginTop: 25, width: 90, height: 90, borderRadius: 30, borderWidth: 5, borderColor: THEME.white, backgroundColor: THEME.softBg, elevation: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
    avatarImg: { width: '100%', height: '100%', borderRadius: 25 },
    activeIndicator: { position: 'absolute', bottom: 5, right: 5, width: 14, height: 14, borderRadius: 7, backgroundColor: '#22C55E', borderWidth: 2, borderColor: THEME.white },

    topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: 15 },
    nameContainer: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    merchantName: { fontSize: 24, fontWeight: '900', color: THEME.dark, letterSpacing: -0.5 },
    locRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
    locText: { fontSize: 13, color: THEME.gray, fontWeight: '600' },

    followAction: { backgroundColor: THEME.dark, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12 },
    followingAction: { backgroundColor: THEME.softBg, borderWidth: 1,},
    followText: { color: THEME.white, fontWeight: '800', fontSize: 13 },
    followingText: { color: THEME.dark },

    bio: { fontSize: 15, color: '#475569', lineHeight: 22, marginTop: 15, fontWeight: '500' },
    statsStrip: { flexDirection: 'row', marginTop: 25, backgroundColor: THEME.softBg, borderRadius: 20, padding: 15 },
    statContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
    statIconCircle: { width: 28, height: 28, borderRadius: 14, backgroundColor: THEME.white, justifyContent: 'center', alignItems: 'center' },
    statValue: { fontSize: 16, fontWeight: '800', color: THEME.dark },
    statLabel: { fontSize: 10, color: THEME.gray, fontWeight: '700', textTransform: 'uppercase' },

    contentBody: { padding: 24 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    sectionTitle: { fontSize: 12, fontWeight: '900', color: THEME.gray, letterSpacing: 1 },
    viewAllBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    viewAllText: { fontSize: 13, fontWeight: '800', color: THEME.primary },

    productGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 15 },
    gridCard: { width: (width - 63) / 2, height: 220, borderRadius: 24, overflow: 'hidden' },
    imagePlaceholder: { flex: 1, backgroundColor: '#E2E8F0' },
    priceFloating: { position: 'absolute', bottom: 12, left: 12, backgroundColor: 'rgba(255,255,255,0.9)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
    priceText: { fontWeight: '900', fontSize: 13, color: THEME.dark },

    footerSticky: { position: 'absolute', bottom: 0, width: '100%', padding: 20, backgroundColor: 'rgba(255,255,255,0.9)', borderTopWidth: 1, borderTopColor: '#F1F5F9' },
    mainMsgBtn: { height: 60, backgroundColor: THEME.dark, borderRadius: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10 },
    mainMsgText: { color: THEME.white, fontSize: 16, fontWeight: '800' }
});

