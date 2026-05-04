import { LinearGradient } from 'expo-linear-gradient';
import {
    ArrowRight,
    ChevronLeft,
    ChevronRight,
    Minus,
    Plus,
    ShieldCheck,
    ShoppingCart,
    Ticket,
    Trash2,
    Truck,
    User
} from "lucide-react-native";

import React, { useState } from "react";
import { Dimensions, Image, Platform, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useCart } from "@/Providers/CartProvider";
import CheckoutViewScreen from "@/SubScreens/CheckoutViewScreen";
import { router } from 'expo-router';

const { width } = Dimensions.get("window");

// Harmonized with your Nexus Design System
const THEME = { 
    primary: "#10B981",    // Emerald
    bg: "#022c2a",         // Deep Dark Green
    surface: "rgba(255, 255, 255, 0.05)",
    textMain: "#F3F4F6",
    textMuted: "#94A3B8",
    danger: "#FF4D4D",
    glass: "rgba(255, 255, 255, 0.1)",
    accentBorder: "rgba(16, 185, 129, 0.2)"
};

export default function CartViewScreen() {
    const { items, summary, updateQuantity, removeFromCart, loading } = useCart();
    const [openCheckout, setOpenCheckout] = useState(false);

    if (items.length === 0 && !loading) {
        return (
            <SafeAreaView style={styles.emptyContainer}>
                <View style={styles.emptyIconCircle}>
                    <ShoppingCart size={44} color={THEME.primary} />
                </View>
                <Text style={styles.emptyTitle}>BAG IS EMPTY</Text>
                <Text style={styles.emptySub}>Your Nexus inventory is currently at zero capacity.</Text>
                <TouchableOpacity 
                    style={styles.shopNowBtn} 
                    onPress={() => router.replace("/General/SearchAndResponse")}
                >
                    <Text style={styles.shopNowText}>RESTOCK NOW</Text>
                    <ArrowRight size={18} color="#000" />
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            
            {/* --- GLASS HEADER --- */}
            <LinearGradient colors={['#033e3b', '#022c2a']} style={styles.headerGradient}>
                <SafeAreaView edges={['top']}>
                    <View style={styles.header}>
                        <View style={styles.headerLeft}>
                            <TouchableOpacity onPress={() => router.back()} style={styles.glassIcon}>
                                <ChevronLeft size={20} color={THEME.textMain} />
                            </TouchableOpacity>
                            <View>
                                <Text style={styles.headerTitle}>MY INVENTORY</Text>
                                <Text style={styles.headerSub}>
                                    {summary.itemCount} {summary.itemCount === 1 ? 'UNIT' : 'UNITS'} SECURED
                                </Text>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.glassIcon}>
                            <User size={20} color={THEME.textMain} />
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </LinearGradient>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* --- RESERVATION TIMER --- */}
                <View style={styles.trustBanner}>
                    <ShieldCheck size={14} color={THEME.primary} />
                    <Text style={styles.trustText}>SECURE HOLD: 24:00 HOURS REMAINING</Text>
                </View>

                {/* --- CART ITEMS --- */}
                {items.map((item) => (
                    <View key={item.id} style={styles.cartCard}>
                        <View style={styles.imageSection}>
                            <Image
                                source={{ uri: item.product.image || "https://via.placeholder.com/150" }}
                                style={styles.productImg}
                            />
                        
                        </View>

                        <View style={styles.detailsSection}>
                            <View style={styles.cardHeader}>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.brandText}>{'NEXUS EXCLUSIVE'}</Text>
                                    <Text style={styles.productName} numberOfLines={1}>{item.product.name}</Text>
                                    <Text style={styles.variantText}>
                                        {item.selectedSize && `SZ: ${item.selectedSize}`} 
                                        {item.selectedColor && ` • CLR: ${item.selectedColor}`}
                                    </Text>
                                </View>
                                <TouchableOpacity 
                                    style={styles.removeBtn}
                                    onPress={() => removeFromCart(item.id)}
                                >
                                    <Trash2 size={16} color={THEME.danger} />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.cardFooter}>
                                <Text style={styles.itemPrice}>KES {item.product.price.toLocaleString()}</Text>

                                <View style={styles.qtyControl}>
                                    <TouchableOpacity
                                        style={styles.qtyAction}
                                        onPress={() => updateQuantity(item.id, item.quantity - 1)}
                                    >
                                        <Minus size={14} color={THEME.textMain} />
                                    </TouchableOpacity>
                                    <Text style={styles.qtyText}>{item.quantity}</Text>
                                    <TouchableOpacity
                                        style={styles.qtyAction}
                                        onPress={() => updateQuantity(item.id, item.quantity + 1)}
                                    >
                                        <Plus size={14} color={THEME.textMain} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                ))}

                {/* --- PROMO --- */}
                <TouchableOpacity style={styles.promoTrigger}>
                    <View style={styles.promoLeft}>
                        <Ticket size={18} color={THEME.primary} />
                        <Text style={styles.promoLabel}>ACTIVATE PROMO CODE</Text>
                    </View>
                    <ChevronRight size={18} color={THEME.textMuted} />
                </TouchableOpacity>

                {/* --- BILLING --- */}
                <View style={styles.summaryBox}>
                    <Text style={styles.summaryHeading}>TRANSACTION DETAILS</Text>

                    <SummaryRow label="Subtotal" value={`KES ${summary.subtotal.toLocaleString()}`} />
                    <SummaryRow
                        label="Logistics (Juja)"
                        value={summary.shipping === 0 ? "FREE" : `KES ${summary.shipping}`}
                        isFree={summary.shipping === 0}
                        icon={<Truck size={14} color={THEME.primary} />}
                    />
                    
                    <View style={styles.dotDivider} />

                    <View style={styles.totalRow}>
                        <View>
                            <Text style={styles.totalLabel}>TOTAL PAYABLE</Text>
                            <Text style={styles.taxNote}>VAT & NEXUS FEES INCLUDED</Text>
                        </View>
                        <Text style={styles.totalAmount}>KES {summary.total.toLocaleString()}</Text>
                    </View>
                </View>
            </ScrollView>

            {/* --- CHECKOUT BUTTON --- */}
            <View style={styles.footerContainer}>
                <LinearGradient
                    colors={['rgba(2,44,42,0)', 'rgba(2,44,42,1)']}
                    style={styles.footerGradient}
                />
                <TouchableOpacity
                    style={styles.checkoutBtn}
                    activeOpacity={0.9}
                    onPress={() => setOpenCheckout(true)}
                >
                    <Text style={styles.checkoutBtnText}>INITIALIZE CHECKOUT</Text>
                    <View style={styles.arrowCircle}>
                        <ArrowRight size={20} color="#000" />
                    </View>
                </TouchableOpacity>
            </View>

            {openCheckout && <CheckoutViewScreen onClose={() => setOpenCheckout(false)} />}
        </View>
    );
}

const SummaryRow = ({ label, value, isFree, icon }: any) => (
    <View style={styles.sRow}>
        <View style={styles.sLabelGroup}>
            {icon && icon}
            <Text style={styles.sLabel}>{label}</Text>
        </View>
        <Text style={[styles.sValue, isFree && { color: THEME.primary }]}>{value}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: THEME.bg },
    headerGradient: { borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 15 },
    glassIcon: {
        width: 42,
        height: 42,
        borderRadius: 14,
        backgroundColor: THEME.glass,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.05)",
    },
    headerTitle: { fontSize: 16, fontWeight: '900', color: THEME.textMain, letterSpacing: 1 },
    headerSub: { fontSize: 11, color: THEME.primary, fontWeight: '800', marginTop: 2 },

    scrollContent: { padding: 20, paddingBottom: 140 },

    trustBanner: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: 10, 
        backgroundColor: 'rgba(16, 185, 129, 0.1)', 
        padding: 14, 
        borderRadius: 16, 
        marginBottom: 25,
        borderWidth: 1,
        borderColor: THEME.accentBorder
    },
    trustText: { fontSize: 11, color: THEME.primary, fontWeight: '800', letterSpacing: 0.5 },

    cartCard: { 
        flexDirection: 'column', 
        backgroundColor: THEME.surface, 
        borderRadius: 10, 
        padding: 12, 
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.05)"
    },

    imageSection: { minWidth: 90, minHeight: 110, maxHeight:200, marginBottom:2, borderRadius: 10, overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.03)' },
    productImg: { width: '100%', height: '100%' },
    stockBadge: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: THEME.danger, paddingVertical: 4, alignItems: 'center' },
    stockText: { fontSize: 8, fontWeight: '900', color: '#FFF' },

    detailsSection: { flex: 1, marginLeft: 16, justifyContent: 'space-between' },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between' },
    brandText: { fontSize: 10, fontWeight: '800', color: THEME.primary, letterSpacing: 1 },
    productName: { fontSize: 16, fontWeight: '700', color: THEME.textMain, marginTop: 2 },
    variantText: { fontSize: 11, color: THEME.textMuted, marginTop: 2 },
    removeBtn: { width: 32, height: 32, borderRadius: 10, backgroundColor: 'rgba(255, 77, 77, 0.1)', justifyContent: 'center', alignItems: 'center' },

    cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    itemPrice: { fontSize: 18, fontWeight: '900', color: THEME.textMain },
    qtyControl: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        backgroundColor: 'rgba(255,255,255,0.05)', 
        borderRadius: 12, 
        padding: 4,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.1)"
    },
    qtyAction: { width: 28, height: 28, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
    qtyText: { paddingHorizontal: 12, fontSize: 14, fontWeight: '800', color: THEME.textMain },

    promoTrigger: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        backgroundColor: THEME.surface, 
        padding: 18, 
        borderRadius: 20, 
        marginVertical: 10, 
        borderStyle: 'dashed', 
        borderWidth: 1, 
        borderColor: THEME.accentBorder 
    },
    promoLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    promoLabel: { fontSize: 13, fontWeight: '800', color: THEME.textMain },

    summaryBox: { 
        backgroundColor: THEME.surface, 
        borderRadius: 24, 
        padding: 20, 
        marginTop: 10,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.05)"
    },
    summaryHeading: { fontSize: 10, fontWeight: '900', color: THEME.textMuted, letterSpacing: 2, marginBottom: 20 },
    sRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 },
    sLabelGroup: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    sLabel: { fontSize: 14, color: THEME.textMuted },
    sValue: { fontSize: 14, fontWeight: '800', color: THEME.textMain },
    dotDivider: { height: 1, borderStyle: 'dashed', borderWidth: 1, borderColor: "rgba(255,255,255,0.1)", marginVertical: 15 },
    totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
    totalLabel: { fontSize: 12, fontWeight: '900', color: THEME.textMuted },
    taxNote: { fontSize: 10, color: THEME.textMuted, marginTop: 2 },
    totalAmount: { fontSize: 26, fontWeight: '900', color: THEME.primary },

    footerContainer: { position: 'absolute', bottom: 0, width: width, padding: 24, paddingBottom: Platform.OS === 'ios' ? 40 : 30 },
    footerGradient: { position: 'absolute', top: -60, width: width, height: 60 },
    checkoutBtn: { 
        height: 68, 
        backgroundColor: THEME.primary, 
        borderRadius: 24, 
        flexDirection: 'row', 
        justifyContent: 'center', 
        alignItems: 'center', 
        gap: 15,
        shadowColor: THEME.primary,
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 10
    },
    checkoutBtnText: { fontSize: 16, fontWeight: '900', color: '#000', letterSpacing: 1 },
    arrowCircle: { width: 38, height: 38, borderRadius: 12, backgroundColor: 'rgba(0,0,0,0.15)', justifyContent: 'center', alignItems: 'center' },

    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: THEME.bg, padding: 40 },
    emptyIconCircle: { 
        width: 120, 
        height: 120, 
        borderRadius: 40, 
        backgroundColor: 'rgba(16, 185, 129, 0.05)', 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginBottom: 24,
        borderWidth: 1,
        borderColor: THEME.accentBorder
    },
    emptyTitle: { fontSize: 24, fontWeight: '900', color: THEME.textMain, letterSpacing: 1 },
    emptySub: { fontSize: 14, color: THEME.textMuted, textAlign: 'center', marginTop: 12, lineHeight: 22 },
    shopNowBtn: { 
        marginTop: 35, 
        backgroundColor: THEME.primary, 
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: 12, 
        paddingHorizontal: 30, 
        paddingVertical: 18, 
        borderRadius: 20 
    },
    shopNowText: { color: '#000', fontWeight: '900', letterSpacing: 1 }
});