import { router } from 'expo-router';
import {
    AlertTriangle,
    ChevronRight, Clock,
    CreditCard,
    MapPin,
    Package,
    User, X
} from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Dimensions, Image,
    Modal,
    Platform,
    ScrollView, StatusBar, StyleSheet, Text,
    TouchableOpacity, View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuth } from "@/Providers/AuthProvider";
import { Order, useOrders } from "@/Providers/OrderProvider";

const { width, height } = Dimensions.get('window');

const COLORS = {
    primary: "#3B82F6",
    accent: "#00F5FF",
    dark: "#050505",
    glass: "rgba(255, 255, 255, 0.8)",
    muted: "#8E8E93",
    danger: "#EF4444",
    border: "#E2E8F0"
};

export default function OrdersPage() {
    const { orders, loading, getStatusUI, cancelOrder } = useOrders();
    const [activeTab, setActiveTab] = useState('Active');
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const { user, isAuthenticated } = useAuth();

    // Find the current selected order object from the provider state
    // This ensures the modal updates if the order status changes (e.g., after cancellation)
    const selectedOrder = useMemo(() => 
        orders.find(o => o.id === selectedOrderId) || null, 
    [orders, selectedOrderId]);

    const filteredOrders = useMemo(() => {
        if (activeTab === 'Active') {
            return orders.filter(o => ['pending', 'processing', 'shipped'].includes(o.status));
        }
        if (activeTab === 'History') {
            return orders.filter(o => o.status === 'delivered');
        }
        if (activeTab === 'Returns') {
            return orders.filter(o => o.status === 'cancelled');
        }
        return [];
    }, [orders, activeTab]);

    useEffect(() => {
        if (!isAuthenticated || !user) {
            router.push("/AppForms/Signin");
        }
    }, [isAuthenticated, user]);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView style={styles.flex1} edges={['top']}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                        <View style={{ marginLeft: 12 }}>
                            <Text style={styles.headerTitle}>Orders</Text>
                            <Text style={styles.headerSubtitle}>Orders Management</Text>
                        </View>
                    </View>

                    {user && (
                        <TouchableOpacity onPress={() => router.push("/General/UserProfile")} style={styles.userBtn}>
                            <User size={20} color={COLORS.dark} />
                            <Text style={styles.userBtnText}>{user?.first_name}</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Segmented Control */}
                <View style={styles.tabsContainer}>
                    {['Active', 'History', 'Returns'].map((tab) => (
                        <TouchableOpacity
                            key={tab}
                            onPress={() => setActiveTab(tab)}
                            style={[styles.tab, activeTab === tab && styles.activeTab]}
                        >
                            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {loading && orders.length === 0 ? (
                    <View style={styles.loadingContainer}><ActivityIndicator color={COLORS.primary} /></View>
                ) : (
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                        {filteredOrders.length > 0 ? (
                            filteredOrders.map((order) => (
                                <OrderCard
                                    key={order.id}
                                    order={order}
                                    ui={getStatusUI(order.status)}
                                    onPress={() => setSelectedOrderId(order.id)}
                                />
                            ))
                        ) : (
                            <EmptyState tab={activeTab} />
                        )}
                    </ScrollView>
                )}
            </SafeAreaView>

            {/* Order Detail Modal */}
            <OrderDetailModal
                order={selectedOrder}
                visible={!!selectedOrderId}
                onClose={() => setSelectedOrderId(null)}
                ui={selectedOrder ? getStatusUI(selectedOrder.status) : { color: '', label: '' }}
                onCancel={cancelOrder}
            />
        </View>
    );
}

/* --- COMPONENTS --- */

const OrderCard = ({ order, ui, onPress }: { order: Order, ui: any, onPress: () => void }) => {
    const mainItem = order.items[0];
    return (
        <TouchableOpacity activeOpacity={0.8} style={styles.orderCard} onPress={onPress}>
            <View style={styles.cardHeader}>
                <View style={styles.idBadge}><Text style={styles.idText}>{order.orderNumber}</Text></View>
                <View style={[styles.statusTag, { backgroundColor: `${ui.color}15` }]}>
                    <View style={[styles.statusDot, { backgroundColor: ui.color }]} />
                    <Text style={[styles.statusText, { color: ui.color }]}>{ui.label.toUpperCase()}</Text>
                </View>
            </View>
            <View style={styles.cardBody}>
                <Image source={{ uri: mainItem.productImage }} style={styles.itemImage} />
                <View style={styles.itemInfo}>
                    <Text style={styles.itemName} numberOfLines={1}>{mainItem.productName}</Text>
                    <Text style={styles.itemMeta}>{order.items.length} items • KES {order.total.toLocaleString()}</Text>
                </View>
                <ChevronRight size={20} color="#CBD5E1" />
            </View>
        </TouchableOpacity>
    );
};

const OrderDetailModal = ({ order, onCancel, visible, onClose, ui }: { 
    order: Order | null, 
    visible: boolean, 
    onClose: () => void, 
    ui: any,
    onCancel: (id: string) => Promise<void> 
}) => {
    const [isCancelling, setIsCancelling] = useState(false);
    if (!order) return null;

    const handleCancelPress = () => {
        Alert.alert(
            "Terminate Request",
            "Are you sure you want to cancel this neural logistics request?",
            [
                { text: "Keep Order", style: "cancel" },
                {
                    text: "Yes, Cancel", 
                    style: "destructive", 
                    onPress: async () => {
                        setIsCancelling(true);
                        try {
                            await onCancel(order.id);
                            // We don't close immediately so the user sees the 'Cancelled' UI
                            setTimeout(() => {
                                onClose();
                            }, 800);

                        } catch (err) {
                            Alert.alert("Error", "Could not process cancellation.");
                        } finally {
                            setIsCancelling(false);
                        }
                    }
                }
            ]
        );
    };

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
            <View style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                    <TouchableOpacity onPress={onClose}><X size={24} color={COLORS.dark} /></TouchableOpacity>
                    <Text style={styles.modalTitle}>Order Details</Text>
                    <View style={{ width: 24 }} />
                </View>

                <ScrollView contentContainerStyle={styles.modalScroll}>
                    {/* Status Banner */}
                    <View style={[styles.statusBanner, { backgroundColor: `${ui.color}10`, borderColor: ui.color }]}>
                        <Clock size={18} color={ui.color} />
                        <View>
                            <Text style={[styles.bannerLabel, { color: ui.color }]}>{ui.label}</Text>
                            <Text style={styles.bannerDate}>Placed on {new Date(order.createdAt).toLocaleDateString()}</Text>
                        </View>
                    </View>

                    {/* Items List */}
                    <Text style={styles.sectionHeading}>ORDERED ITEMS</Text>
                    {order.items.map((item, idx) => (
                        <View key={idx} style={styles.detailItemRow}>
                            <Image source={{ uri: item.productImage }} style={styles.detailItemImg} />
                            <View style={{ flex: 1 }}>
                                <Text style={styles.detailItemName}>{item.productName}</Text>
                                <Text style={styles.detailItemQty}>Qty: {item.quantity}</Text>
                            </View>
                            <Text style={styles.detailItemPrice}>KES {item.price.toLocaleString()}</Text>
                        </View>
                    ))}

                    <View style={styles.divider} />

                    {/* Logistics & Payment */}
                    <View style={styles.infoGrid}>
                        <View style={styles.infoBlock}>
                            <View style={styles.infoTitleRow}><MapPin size={14} color={COLORS.muted} /><Text style={styles.infoTitle}>DELIVERY</Text></View>
                            <Text style={styles.infoContent}>{order.shippingAddress.street}</Text>
                            <Text style={styles.infoContent}>{order.shippingAddress.city}</Text>
                        </View>
                        <View style={styles.infoBlock}>
                            <View style={styles.infoTitleRow}><CreditCard size={14} color={COLORS.muted} /><Text style={styles.infoTitle}>PAYMENT</Text></View>
                            <Text style={styles.infoContent}>{order.paymentMethod}</Text>
                            <Text style={styles.infoContent}>KES {order.total.toLocaleString()}</Text>
                        </View>
                    </View>

                    {/* CTAs */}
                    <View style={styles.ctaContainer}>
                        {['pending', 'processing'].includes(order.status) && (
                            <TouchableOpacity 
                                style={[styles.cancelBtn, isCancelling && { opacity: 0.5 }]} 
                                onPress={handleCancelPress}
                                disabled={isCancelling}
                            >
                                {isCancelling ? (
                                    <ActivityIndicator size="small" color={COLORS.danger} />
                                ) : (
                                    <>
                                        <AlertTriangle size={18} color={COLORS.danger} />
                                        <Text style={styles.cancelBtnText}>CANCEL ORDER</Text>
                                    </>
                                )}
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity style={styles.supportBtn}>
                            <Text style={styles.supportBtnText}>NEED HELP WITH THIS ORDER?</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        </Modal>
    );
};

const EmptyState = ({ tab }: { tab: string }) => (
    <View style={styles.emptyState}>
        <Package size={48} color="#E2E8F0" strokeWidth={1} />
        <Text style={styles.emptyTitle}>No {tab} Orders</Text>
        <Text style={styles.emptySub}>When you initiate a neural purchase, it will appear here for tracking.</Text>
    </View>
);

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F8FAFC" },
    flex1: { flex: 1 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    scrollContent: { padding: 20, paddingBottom: 100 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 20 },
    headerSubtitle: { fontSize: 10, fontWeight: '800', color: '#94A3B8', letterSpacing: 2 },
    headerTitle: { fontSize: 18, fontWeight: '900', color: '#111827' },
    userBtn: { alignItems: 'center', justifyContent: 'center', borderBottomWidth: 1, borderBlockColor: "dodgerblue", paddingBottom: 4 },
    userBtnText: { fontSize: 12, color: COLORS.muted, marginTop: 2 },

    tabsContainer: { flexDirection: 'row', marginHorizontal: 15, borderRadius: 14, padding: 4, marginBottom: 10, borderBottomWidth: 1, borderColor: "#E2E8F0" },
    tab: { flex: 1, paddingVertical: 10, alignItems: 'center' },
    activeTab: { borderBottomWidth: 2, borderColor: COLORS.primary },
    tabText: { fontSize: 13, fontWeight: '600', color: '#64748B' },
    activeTabText: { color: 'dodgerblue', fontSize: 15, fontWeight: '700' },

    orderCard: { backgroundColor: '#FFF', borderRadius: 24, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: '#F1F5F9' },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
    idBadge: { backgroundColor: '#F8FAFC', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
    idText: { fontSize: 11, fontWeight: '700', color: '#64748B', fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' },
    statusTag: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, gap: 6 },
    statusDot: { width: 6, height: 6, borderRadius: 3 },
    statusText: { fontSize: 10, fontWeight: '900' },
    cardBody: { flexDirection: 'row', alignItems: 'center', gap: 15 },
    itemImage: { width: 64, height: 64, borderRadius: 14, backgroundColor: '#F1F5F9' },
    itemInfo: { flex: 1, gap: 2 },
    itemName: { fontSize: 16, fontWeight: '700', color: '#111827' },
    itemMeta: { fontSize: 12, color: '#94A3B8', fontWeight: '600' },

    modalContainer: { flex: 1, backgroundColor: '#FFF' },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
    modalTitle: { fontSize: 16, fontWeight: '800', color: COLORS.dark },
    modalScroll: { padding: 20 },
    statusBanner: { flexDirection: 'row', alignItems: 'center', gap: 15, padding: 20, borderRadius: 20, borderWidth: 1, marginBottom: 25 },
    bannerLabel: { fontSize: 16, fontWeight: '900' },
    bannerDate: { fontSize: 12, color: COLORS.muted, fontWeight: '600' },
    sectionHeading: { fontSize: 11, fontWeight: '900', color: COLORS.muted, letterSpacing: 1.5, marginBottom: 15 },
    detailItemRow: { flexDirection: 'row', alignItems: 'center', gap: 15, marginBottom: 15 },
    detailItemImg: { width: 50, height: 50, borderRadius: 10, backgroundColor: '#F8FAFC' },
    detailItemName: { fontSize: 14, fontWeight: '700', color: COLORS.dark },
    detailItemQty: { fontSize: 12, color: COLORS.muted },
    detailItemPrice: { fontSize: 14, fontWeight: '800', color: COLORS.dark },
    divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 20 },
    infoGrid: { flexDirection: 'row', gap: 20 },
    infoBlock: { flex: 1 },
    infoTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 8 },
    infoTitle: { fontSize: 10, fontWeight: '900', color: COLORS.muted },
    infoContent: { fontSize: 13, fontWeight: '600', color: COLORS.dark, lineHeight: 18 },

    ctaContainer: { marginTop: 40, gap: 12 },
    cancelBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 18, borderRadius: 18, borderWidth: 1, borderColor: COLORS.danger },
    cancelBtnText: { color: COLORS.danger, fontWeight: '900', fontSize: 13 },
    supportBtn: { padding: 18, alignItems: 'center' },
    supportBtnText: { color: COLORS.muted, fontWeight: '800', fontSize: 11, letterSpacing: 0.5 },

    emptyState: { alignItems: 'center', justifyContent: 'center', paddingTop: 80 },
    emptyTitle: { fontSize: 18, fontWeight: '800', color: '#111827', marginTop: 15 },
    emptySub: { fontSize: 14, color: '#94A3B8', textAlign: 'center', marginTop: 8, paddingHorizontal: 40, lineHeight: 20 }
});