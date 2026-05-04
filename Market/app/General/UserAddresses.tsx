import AddShippingAddress from "@/app/AppForms/AddShippingAddress";
import EditShippingAddress from "@/app/AppForms/EditShippingAddress";
import { useAuth } from "@/Providers/AuthProvider";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Check, ChevronLeft, Edit, MapPin, Plus, ShieldCheck, Trash2 } from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Address {
    id: string | number;
    full_name: string | null;
    phone_number: string | null;
    country: string | null;
    city: string | null;
    postal_code: string | null;
    street: string | null;
    description: string | null;
    is_default: string | boolean | null;
}

const COLORS = {
    primary: "#10B981",    // Emerald
    bgDark: "#022c2a",     // Nexus Deep Teal
    surface: "#FFFFFF",
    textMain: "#0D1B1E",
    textMuted: "#64748B",
    danger: "#EF4444",
    glass: "rgba(255, 255, 255, 0.1)",
};

export default function UserShippingAddresses() {
    const { user } = useAuth();
    const [addresses, setAddresses] = useState<Address[]>(user?.profile?.shipping_addresses || []);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);

    useEffect(() => {
        if (user?.profile?.shipping_addresses) {
            setAddresses(user.profile.shipping_addresses);
        }
    }, [user]);

    const sortedAddresses = useMemo(() => {
        return [...addresses].sort((a, b) => {
            const aDef = a.is_default === "true" || a.is_default === true;
            const bDef = b.is_default === "true" || b.is_default === true;
            return bDef ? 1 : aDef ? -1 : 0;
        });
    }, [addresses]);

    return (
        <View style={styles.mainContainer}>
            <StatusBar barStyle="light-content" />

            {/* Header Section */}
            <LinearGradient colors={[COLORS.bgDark, "#023332"]} style={styles.topSection}>
                <SafeAreaView edges={['top']}>
                    <View style={styles.headerContent}>
                        <View style={styles.navBar}>
                            <TouchableOpacity onPress={() => router.back()} style={styles.iconCircle}>
                                <ChevronLeft size={22} color={COLORS.primary} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.addBtnHeader} onPress={() => setIsAddModalVisible(true)}>
                                <Plus size={20} color="#000" strokeWidth={3} />
                                <Text style={styles.addBtnText}>NEW</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.heroTextContainer}>
                            <View style={styles.secureRow}>
                                <ShieldCheck size={12} color={COLORS.primary} />
                                <Text style={styles.userSubText}>YOUR SET  DELIVERY NODES</Text>
                            </View>
                        </View>
                    </View>
                </SafeAreaView>
            </LinearGradient>

            {/* Content Section */}
            <View style={styles.contentSheet}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollBody}
                >
                    {sortedAddresses.length > 0 ? (
                        sortedAddresses.map((addr) => (
                            <AddressItem
                                key={addr.id}
                                addr={addr}
                                onEdit={() => setEditingAddress(addr)}
                                onDelete={() => console.log("Delete", addr.id)}
                            />
                        ))
                    ) : (
                        <View style={styles.emptyContainer}>
                            <MapPin size={40} color={COLORS.glass} />
                            <Text style={styles.emptyText}>NO NODES REGISTERED</Text>
                        </View>
                    )}
                </ScrollView>
            </View>

            <AddShippingAddress
                visible={isAddModalVisible}
                onClose={() => setIsAddModalVisible(false)}
                onSave={() => setIsAddModalVisible(false)}
            />

            {editingAddress && (
                <EditShippingAddress
                    visible={!!editingAddress}
                    address={editingAddress}
                    onClose={() => setEditingAddress(null)}
                    onSave={() => setEditingAddress(null)}
                />
            )}
        </View>
    );
}

const AddressItem = ({ addr, onEdit, onDelete }: { addr: Address; onEdit: () => void; onDelete: () => void }) => {
    const isDefault = addr.is_default === "true" || addr.is_default === true;

    return (
        <View style={[styles.addressCard, isDefault && styles.defaultCard]}>
            {/* Header: Street & Actions */}
            <View style={styles.cardHeader}>
                <View style={styles.addressTitleContainer}>
                    <Text style={styles.addressLine}>{addr.street || "Unknown Street"}</Text>
                    {isDefault && (
                        <View style={styles.defaultBadge}>
                            <Check size={10} color={COLORS.primary} strokeWidth={4} />
                            <Text style={styles.defaultText}>PRIMARY NODE</Text>
                        </View>
                    )}
                </View>
                <View style={styles.rightActions}>
                    <TouchableOpacity style={styles.iconBtn} onPress={onEdit}>
                        <Edit size={16} color={COLORS.textMain} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconBtn} onPress={onDelete}>
                        <Trash2 size={16} color={COLORS.danger} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Info Body */}
            <View style={styles.addressInfo}>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>LOCATION</Text>
                    <Text style={styles.subLine}>{addr.city}, {addr.country} {addr.postal_code}</Text>
                </View>
                
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>CONTACT</Text>
                    <Text style={styles.phoneLine}>{addr.phone_number}</Text>
                </View>

                {addr.description && (
                    <View style={styles.descriptionBox}>
                        <Text style={styles.description}>{addr.description}</Text>
                    </View>
                )}
            </View>

            {/* Activation Action */}
            {!isDefault && (
                <TouchableOpacity style={styles.setAsDefaultBtn}>
                    <Text style={styles.makeDefaultText}>ACTIVATE AS PRIMARY</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};



const styles = StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: COLORS.bgDark },
    topSection: { paddingBottom: 10 },
    headerContent: { paddingHorizontal: 25 },
    navBar: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 10,
        marginBottom: 30,
    },
    iconCircle: {
        width: 42,
        height: 42,
        borderRadius: 14,
        backgroundColor: COLORS.glass,
        justifyContent: "center",
        alignItems: "center",
    },
    addBtnHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.primary,
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 12,
        gap: 6
    },
    addBtnText: { fontWeight: '900', fontSize: 12, color: "#000" },
    heroTextContainer: { marginLeft: 5 },
    userName: { fontSize: 28, fontWeight: "900", color: "#FFF", letterSpacing: 1 },
    secureRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
    userSubText: { fontSize: 11, color: COLORS.primary, fontWeight: '800', letterSpacing: 1 },

    contentSheet: {
        flex: 1,
        backgroundColor: "#025150", // Darker floor for the cards
      
        marginTop: 0,
    },
    scrollBody: { padding: 25, paddingBottom: 100 },

    // Card Styles
    addressCard: {
        backgroundColor: COLORS.surface,
        borderRadius: 24,
        padding: 20,
        marginBottom: 18,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 10 },
        shadowRadius: 20,
        elevation: 5,
    },
    defaultCard: {
        borderWidth: 2,
        borderColor: COLORS.primary,
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 15,
    },
    addressTitleContainer: { flex: 1, gap: 6 },
    addressLine: { fontSize: 18, fontWeight: "900", color: COLORS.textMain, letterSpacing: -0.5 },
    defaultBadge: {
        alignSelf: 'flex-start',
        backgroundColor: COLORS.bgDark,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 6,
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    defaultText: { color: COLORS.primary, fontWeight: "900", fontSize: 9, letterSpacing: 1 },
    
    addressInfo: { gap: 14 },
    detailRow: { gap: 3 },
    detailLabel: { fontSize: 9, fontWeight: "800", color: COLORS.textMuted, letterSpacing: 1 },
    subLine: { fontSize: 14, color: COLORS.textMain, fontWeight: "500" },
    phoneLine: { fontSize: 14, color: COLORS.textMain, fontWeight: "600" },
    
    descriptionBox: {
        backgroundColor: "#F8FAFC",
        padding: 12,
        borderRadius: 12,
        borderLeftWidth: 4,
        borderLeftColor: COLORS.primary,
    },
    description: { fontSize: 12, color: COLORS.textMuted, fontStyle: "italic", lineHeight: 18 },

    rightActions: { flexDirection: "row", gap: 8 },
    iconBtn: { 
        width: 36, 
        height: 36, 
        borderRadius: 10, 
        backgroundColor: "#F1F5F9", 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    
    setAsDefaultBtn: {
        marginTop: 20,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: COLORS.primary,
        borderRadius: 12,
        alignItems: 'center',
        borderStyle: 'dashed',
    },
    makeDefaultText: { color: COLORS.primary, fontWeight: "800", fontSize: 11, letterSpacing: 1 },

    emptyContainer: { alignItems: "center", paddingVertical: 80, gap: 15 },
    emptyText: { color: COLORS.glass, fontSize: 12, fontWeight: '800', letterSpacing: 2 },
});