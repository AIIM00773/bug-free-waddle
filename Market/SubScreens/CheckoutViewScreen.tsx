import { LinearGradient } from 'expo-linear-gradient';
import {
    CheckCircle2,
    ChevronRight,
    CreditCard,
    Fingerprint,
    Lock,
    MapPin,
    ShieldCheck,
    Truck,
    X
} from "lucide-react-native";
import React, { useState } from "react";
import {
    ActivityIndicator, Alert,
    Modal,
    Platform,
    ScrollView, StatusBar,
    StyleSheet, Text, TouchableOpacity,
    View
} from "react-native";

// Hooks from your Providers
import { useCart } from "@/Providers/CartProvider";
import { ShippingAddress, useOrders } from "@/Providers/OrderProvider";
import { router } from 'expo-router';

const THEME = {
    primary: "#48cae4",
    dark: "#0F1113",
    surface: "#FFFFFF",
    background: "#F8FAFC",
    accent: "#E2E8F0",
    gray: "#64748B",
    visa: "#1A1F71",
    success: "#10B981",
    white: "aliceblue",
    border: "rgba(0,0,0,0.06)",
};

export default function CheckoutViewScreen({ onClose }: { onClose: () => void }) {
    const { items, summary, clearCart } = useCart();
    const { createOrder, loading: orderLoading } = useOrders();
    
    // Local state for the "Authorization" flow
    const [isAuthorizing, setIsAuthorizing] = useState(false);

    // Mock address (In a full app, these would be controlled inputs)
    const [address] = useState<ShippingAddress>({
        name: "Bob Harrison",
        phone: "+254 700 000 000",
        street: "123 AI Avenue, Silicon Savannah",
        city: "Nairobi",
        houseNumber: "A42"
    });

    const handleAuthorizePayment = async () => {
        setIsAuthorizing(true);
        try {
            // 1. Map CartItems to OrderItems (matching the OrderProvider interface)
            const orderItems = items.map(item => ({
                productId: item.productId,
                productName: item.product.name,
                productImage: item.product.image,
                quantity: item.quantity,
                price: item.product.price,
            }));

            // 2. Create the Order
            await createOrder(
                orderItems,
                address,
                "Visa ending in 4242",
                summary.total
            );

            // 3. Wipe the cart on success
            await clearCart();

            Alert.alert("Success", "Neural order processed successfully.", [
                { text: "Dismiss", onPress: () => {
                    onClose();
                    // Optionally, navigate to Orders screen or show order details
                    setTimeout(() => {
                        router.replace('/General/Orders');
                    }, 500);
                } }
            ]);


            
        } catch (err: any) {
            Alert.alert("Checkout Failed", err.message || "Something went wrong");
        } finally {
            setIsAuthorizing(false);
        }
    };

    return (
        <Modal visible animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
            <View style={styles.container}>
                <StatusBar barStyle="dark-content" />

                {/* --- STEALTH HEADER --- */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose} style={styles.iconBtn}>
                        <X size={20} color={THEME.dark} />
                    </TouchableOpacity>

                    <View style={styles.headerTitleGroup}>
                        <Lock size={12} color={THEME.success} strokeWidth={3} />
                        <Text style={styles.headerTitle}>SECURE ENCRYPTED CHECKOUT</Text>
                    </View>

                    <View style={styles.iconBtn}>
                        <Fingerprint size={20} color={THEME.primary} />
                    </View>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                    {/* --- PROGRESS PIPELINE --- */}
                    <View style={styles.progressPipeline}>
                        <ProgressNode active label="Logistics" />
                        <View style={styles.lineActive} />
                        <ProgressNode active label="Treasury" />
                        <View style={styles.lineActive} />
                        <ProgressNode active={isAuthorizing} label="Review" />
                    </View>

                    {/* STEP 1: LOGISTICS */}
                    <View style={styles.sectionCard}>
                        <View style={styles.sectionHeader}>
                            <View style={styles.labelGroup}>
                                <MapPin size={16} color={THEME.dark} />
                                <Text style={styles.sectionLabel}>SHIPPING DESTINATION</Text>
                            </View>
                            <TouchableOpacity><Text style={styles.editLink}>EDIT</Text></TouchableOpacity>
                        </View>

                        <View style={styles.addressBox}>
                            <Text style={styles.addressName}>{address.name}</Text>
                            <Text style={styles.addressText}>{address.street}</Text>
                            <Text style={styles.addressText}>{address.city}, Kenya</Text>
                            <View style={styles.shippingTag}>
                                <Truck size={12} color={THEME.primary} />
                                <Text style={styles.shippingTagText}>Express Juja Delivery</Text>
                            </View>
                        </View>
                    </View>

                    {/* STEP 2: PAYMENT */}
                    <TouchableOpacity activeOpacity={0.9} style={styles.sectionCard}>
                        <View style={styles.sectionHeader}>
                            <View style={styles.labelGroup}>
                                <CreditCard size={16} color={THEME.dark} />
                                <Text style={styles.sectionLabel}>PAYMENT ARCHITECTURE</Text>
                            </View>
                            <ChevronRight size={16} color={THEME.gray} />
                        </View>

                        <LinearGradient
                            colors={[THEME.visa, '#3B429F']}
                            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                            style={styles.visaCard}
                        >
                            <View style={styles.cardTop}>
                                <Text style={styles.visaLogo}>VISA</Text>
                                <CheckCircle2 size={16} color={THEME.primary} fill="white" />
                            </View>
                            <Text style={styles.cardNumber}>••••  ••••  ••••  4242</Text>
                            <View style={styles.cardBottom}>
                                <Text style={styles.cardHolder}>{address.name.toUpperCase()}</Text>
                                <Text style={styles.cardExpiry}>12 / 28</Text>
                            </View>
                        </LinearGradient>
                    </TouchableOpacity>

                    {/* STEP 3: FINANCIAL BREAKDOWN (Dynamic from Cart) */}
                    <View style={styles.summaryCard}>
                        <Text style={styles.sectionLabel}>ORDER FINALIZATION</Text>

                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Subtotal ({summary.itemCount} items)</Text>
                            <Text style={styles.summaryValue}>KES {summary.subtotal.toLocaleString()}</Text>
                        </View>

                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Priority Logistics</Text>
                            <Text style={[styles.summaryValue, { color: THEME.primary }]}>
                                {summary.shipping === 0 ? 'FREE' : `KES ${summary.shipping}`}
                            </Text>
                        </View>

                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Estimated VAT (16%)</Text>
                            <Text style={styles.summaryValue}>KES {summary.tax.toLocaleString()}</Text>
                        </View>

                        <View style={styles.dashDivider} />

                        <View style={styles.totalRow}>
                            <View>
                                <Text style={styles.totalLabel}>TOTAL AMOUNT</Text>
                                <Text style={styles.currencyNote}>Settled in KES</Text>
                            </View>
                            <Text style={styles.totalValue}>KES {summary.total.toLocaleString()}</Text>
                        </View>
                    </View>

                    <View style={styles.securitySeal}>
                        <ShieldCheck size={14} color={THEME.gray} />
                        <Text style={styles.securityText}>AES-256 BIT ENCRYPTED TRANSACTION</Text>
                    </View>
                </ScrollView>

                {/* --- AUTHORIZATION FOOTER --- */}
                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[styles.payBtn, (isAuthorizing || orderLoading) && { opacity: 0.7 }]}
                        activeOpacity={0.9}
                        disabled={isAuthorizing || orderLoading}
                        onPress={handleAuthorizePayment}
                    >
                        <LinearGradient
                            colors={[THEME.dark, '#2D3135']}
                            style={styles.payBtnGradient}
                        >
                            {isAuthorizing || orderLoading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <>
                                    <Text style={styles.payBtnText}>AUTHORIZE PAYMENT</Text>
                                    <View style={styles.priceBadge}>
                                        <Text style={styles.priceBadgeText}>
                                            {Math.round(summary.total).toLocaleString()}
                                        </Text>
                                    </View>
                                </>
                            )}
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const ProgressNode = ({ active, label }: any) => (
    <View style={styles.nodeWrapper}>
        <View style={[styles.nodeCircle, active && styles.nodeCircleActive]}>
            {active ? <CheckCircle2 size={12} color="white" /> : <View style={styles.nodeInner} />}
        </View>
        <Text style={[styles.nodeLabel, active && styles.nodeLabelActive]}>{label}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: THEME.background },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: THEME.white,
        borderBottomWidth: 1,
        borderBottomColor: THEME.accent,
    },
    headerTitleGroup: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    headerTitle: { fontSize: 10, fontWeight: '900', color: THEME.dark, letterSpacing: 1.5 },
    iconBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },

    scrollContent: { padding: 20, paddingBottom: 150 },

    progressPipeline: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 30, paddingHorizontal: 20 },
    nodeWrapper: { alignItems: 'center', gap: 6 },
    nodeCircle: { width: 24, height: 24, borderRadius: 12, backgroundColor: THEME.accent, justifyContent: 'center', alignItems: 'center' },
    nodeCircleActive: { backgroundColor: THEME.dark },
    nodeInner: { width: 6, height: 6, borderRadius: 3, backgroundColor: THEME.gray },
    nodeLabel: { fontSize: 9, fontWeight: '800', color: THEME.gray, textTransform: 'uppercase' },
    nodeLabelActive: { color: THEME.dark },
    lineActive: { flex: 1, height: 2, backgroundColor: THEME.dark, marginHorizontal: 10, marginTop: -15 },

    sectionCard: {
        backgroundColor: THEME.white,
        borderRadius: 24,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: THEME.border,
    },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    labelGroup: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    sectionLabel: { fontSize: 11, fontWeight: '900', color: THEME.gray, letterSpacing: 1 },
    editLink: { fontSize: 11, color: THEME.primary, fontWeight: '900' },

    addressBox: { gap: 4 },
    addressName: { fontSize: 16, fontWeight: '800', color: THEME.dark },
    addressText: { fontSize: 14, color: THEME.gray, fontWeight: '500', lineHeight: 20 },
    shippingTag: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: `${THEME.primary}10`, alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginTop: 8 },
    shippingTagText: { fontSize: 11, fontWeight: '800', color: THEME.primary },

    visaCard: { borderRadius: 16, padding: 20, height: 160, justifyContent: 'space-between', elevation: 10, shadowColor: THEME.visa, shadowOpacity: 0.3, shadowRadius: 15 },
    cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    visaLogo: { color: 'white', fontWeight: '900', fontStyle: 'italic', fontSize: 18 },
    cardNumber: { color: 'white', fontSize: 20, fontWeight: '600', letterSpacing: 2, textAlign: 'center' },
    cardBottom: { flexDirection: 'row', justifyContent: 'space-between' },
    cardHolder: { color: 'white', fontSize: 12, fontWeight: '700', letterSpacing: 1 },
    cardExpiry: { color: 'white', fontSize: 12, fontWeight: '700' },

    summaryCard: { backgroundColor: THEME.white, borderRadius: 24, padding: 24, borderWidth: 1, borderColor: THEME.dark },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
    summaryLabel: { fontSize: 14, color: THEME.gray, fontWeight: '500' },
    summaryValue: { fontSize: 14, fontWeight: '800', color: THEME.dark },
    dashDivider: { height: 1, borderStyle: 'dashed', borderWidth: 1, borderColor: THEME.accent, marginVertical: 20, borderRadius: 1 },
    totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    totalLabel: { fontSize: 12, fontWeight: '900', color: THEME.gray },
    currencyNote: { fontSize: 10, color: THEME.gray, fontWeight: '500' },
    totalValue: { fontSize: 24, fontWeight: '900', color: THEME.dark },

    securitySeal: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 20 },
    securityText: { fontSize: 9, color: THEME.gray, fontWeight: '800', letterSpacing: 0.5 },

    footer: {
        position: 'absolute', bottom: 0, width: '100%',
        padding: 20, paddingBottom: Platform.OS === 'ios' ? 40 : 20,
        backgroundColor: THEME.background,
    },
    payBtn: { height: 64, borderRadius: 24, overflow: 'hidden', elevation: 8, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 10 },
    payBtnGradient: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 12 },
    payBtnText: { fontSize: 15, fontWeight: '900', color: THEME.white, letterSpacing: 1 },
    priceBadge: { backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
    priceBadgeText: { color: THEME.white, fontWeight: '900', fontSize: 14 }
});