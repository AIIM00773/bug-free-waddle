import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ArrowRight, ChevronLeft, Heart, Share2, Sparkles, Star } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    Image,
    Modal,
    NativeScrollEvent,
    NativeSyntheticEvent,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Context & Providers
import { useCart } from "@/Providers/CartProvider";
import { useProducts } from "@/Providers/ProductProvider";
import { COLORS } from "@/constants";

const { width, height } = Dimensions.get("window");

export default function ProductDetailsView({ onClose, onViewMerchant }: any) {
    const { selectedProduct, setSelectedProductById } = useProducts();
    const { addToCart, items } = useCart();

    const [activeIndex, setActiveIndex] = useState(0);
    const [isAdding, setIsAdding] = useState(false);
    
    const productImages = useMemo(() => {
        if (!selectedProduct) return [];
        return selectedProduct?.images?.length > 0 ? selectedProduct.images : [selectedProduct.image];
    }, [selectedProduct]);

    const itemIntoCart = useMemo(() => {
        return items.some(item => String(item.productId) === String(selectedProduct?.id));
    }, [items, selectedProduct]);

    if (!selectedProduct) return null;

    const handleAddToCart = async () => {
        setIsAdding(true);
        try {
            await addToCart(selectedProduct, { size: "Standard", quantity: 1 });
        } finally {
            setIsAdding(false);
        }
    };

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const index = Math.round(event.nativeEvent.contentOffset.x / width);
        setActiveIndex(index);
    };

    return (
        <Modal 
            visible={!!selectedProduct} 
            animationType="slide" 
            presentationStyle="fullScreen" 
            statusBarTranslucent 
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                <StatusBar barStyle="light-content" />

                {/* --- FLOATING HEADER --- */}
                <SafeAreaView style={styles.navOverlay}>
                    <View style={styles.navContent}>
                        <TouchableOpacity style={styles.glassBtn} onPress={onClose}>
                            <BlurView intensity={60} tint="dark" style={StyleSheet.absoluteFill} />
                            <ChevronLeft size={22} color="#FFF" />
                        </TouchableOpacity>
                        
                        <View style={styles.navRight}>
                            <TouchableOpacity style={styles.glassBtn}>
                                <BlurView intensity={60} tint="dark" style={StyleSheet.absoluteFill} />
                                <Heart size={20} color="#FFF" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.glassBtn}>
                                <BlurView intensity={60} tint="dark" style={StyleSheet.absoluteFill} />
                                <Share2 size={20} color="#FFF" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </SafeAreaView>

                <ScrollView showsVerticalScrollIndicator={false} bounces={true} scrollEventThrottle={16}>
                    {/* --- HERO SLIDER --- */}
                    <View style={styles.heroWrapper}>
                        <ScrollView
                            horizontal
                            pagingEnabled
                            showsHorizontalScrollIndicator={false}
                            onScroll={handleScroll}
                            scrollEventThrottle={16}
                        >
                            {productImages?.map((img: string, i: number) => (
                                <Image key={i} source={{ uri: img }} style={styles.heroImage} />
                            ))}
                        </ScrollView>

                        <LinearGradient 
                            colors={['rgba(0,0,0,0.4)', 'transparent', 'transparent', 'rgba(0,0,0,0.2)']} 
                            style={StyleSheet.absoluteFill} 
                        />

                        {/* Pagination Dots */}
                        <View style={styles.indicatorContainer}>
                            {productImages?.map((_: any, i: number) => (
                                <View key={i} style={[styles.dot, activeIndex === i && styles.dotActive]} />
                            ))}
                        </View>
                    </View>

                    {/* --- CONTENT CARD --- */}
                    <View style={styles.detailsBox}>
                        <View style={styles.pullBar} />

                        <View style={styles.headerRow}>
                            <View style={styles.ratingBadge}>
                                <Star size={14} color={COLORS.accent} fill={COLORS.accent} />
                                <Text style={styles.ratingText}>{selectedProduct.rating || '4.8'}</Text>
                            </View>
                            <Text style={styles.productPrice}>KES {selectedProduct.price.toLocaleString()}</Text>
                        </View>

                        <Text style={styles.productTitle}>{selectedProduct.name}</Text>

                        {/* AI INSIGHT - Harmonized with Discovery Styling */}
                        <LinearGradient 
                            colors={['#e6fffa', '#f0fff4']} 
                            start={{x:0, y:0}} end={{x:1, y:1}}
                            style={styles.aiInsightBox}
                        >
                            <View style={[styles.sparkleIcon, { backgroundColor: COLORS.accent }]}>
                                <Sparkles size={16} color="#000" />
                            </View>
                            <Text style={styles.aiInsightText}>
                                <Text style={{ fontWeight: '800', color: '#033e3b' }}>AI ANALYSIS: </Text>
                                Highly rated for durability. Matches your preference for premium materials.
                            </Text>
                        </LinearGradient>

                        <View style={styles.section}>
                            <Text style={styles.sectionLabel}>THE DETAILS</Text>
                            <Text style={styles.descText}>{selectedProduct.description}</Text>
                        </View>

                        {/* MERCHANT SECTION */}
                        <TouchableOpacity style={styles.merchantCard} onPress={onViewMerchant}>
                            <View style={styles.merchantInfo}>
                                <View style={styles.merchantAvatar}>
                                    <Text style={styles.merchantInitial}>{selectedProduct.merchantName?.charAt(0)}</Text>
                                </View>
                                <View>
                                    <Text style={styles.merchantName}>{selectedProduct.merchantName || "Official Merchant"}</Text>
                                    <Text style={styles.merchantLoc}>Verified Store • Nairobi, KE</Text>
                                </View>
                            </View>
                            <ArrowRight size={18} color="#64748B" />
                        </TouchableOpacity>

                        <View style={{ height: 140 }} />
                    </View>
                </ScrollView>

                {/* --- FLOATING ACTION BAR --- */}
                <View style={styles.footerContainer}>
                    <BlurView intensity={90} tint="light" style={styles.blurFooter}>
                        <View style={styles.footerContent}>
                            {itemIntoCart ? (
                                <TouchableOpacity
                                    style={styles.viewCartBtn}
                                    onPress={() => { onClose(); router.push("/General/UserCart"); }}
                                >
                                    <Text style={styles.viewCartText}>VIEW SHOPPING BAG</Text>
                                    <ArrowRight size={18} color="white" />
                                </TouchableOpacity>
                            ) : (
                                <>
                                    <TouchableOpacity
                                        style={styles.addBtn}
                                        onPress={handleAddToCart}
                                        disabled={isAdding}
                                    >
                                        {isAdding ? <ActivityIndicator color="#0F172A" /> : <Text style={styles.addBtnText}>ADD TO BAG</Text>}
                                    </TouchableOpacity>
                                    
                                    <TouchableOpacity style={styles.buyBtn} activeOpacity={0.8}>
                                        <LinearGradient
                                            colors={['#033e3b', '#06622c']}
                                            style={StyleSheet.absoluteFill}
                                            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                                        />
                                        <Text style={styles.buyBtnText}>RESERVE NOW</Text>
                                    </TouchableOpacity>
                                </>
                            )}
                        </View>
                    </BlurView>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFF' },
    navOverlay: { position: 'absolute', top: 0, width: '100%', zIndex: 100 },
    navContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 8,
        paddingTop: Platform.OS === 'android' ? 1 : 10
    },
    glassBtn: {
        width: 42, height: 42, borderRadius: 14,
        overflow: 'hidden',
        justifyContent: 'center', alignItems: 'center',
    },
    navRight: { flexDirection: 'row', gap: 10 },
    
    heroWrapper: { height: height * 0.52 },
    heroImage: { width: width, height: "100%", resizeMode: 'cover' },
    
    indicatorContainer: {
        position: 'absolute', bottom: 50, width: '100%',
        flexDirection: 'row', justifyContent: 'center', gap: 6
    },
    dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.4)' },
    dotActive: { width: 20, height: 6, borderRadius: 3, backgroundColor: '#FFF' },

    detailsBox: {
        backgroundColor: '#FFF',
        borderTopLeftRadius: 32, borderTopRightRadius: 32,
        marginTop: -35, padding: 24,
        shadowColor: "#000", shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.05, shadowRadius: 20,
    },
    pullBar: {
        width: 36, height: 4, backgroundColor: '#E2E8F0',
        borderRadius: 2, alignSelf: 'center', marginBottom: 24
    },
    headerRow: {
        flexDirection: 'row', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 8
    },
    ratingBadge: {
        flexDirection: 'row', alignItems: 'center', gap: 5,
        backgroundColor: '#F8FAFC', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12
    },
    ratingText: { fontSize: 14, fontWeight: '700', color: '#0F172A' },
    productPrice: { fontSize: 22, fontWeight: '800', color: '#0F172A' },
    productTitle: { fontSize: 26, fontWeight: '700', color: '#0F172A', lineHeight: 32, marginBottom: 20 },

    aiInsightBox: {
        flexDirection: 'row', alignItems: 'center', gap: 12,
        padding: 16, borderRadius: 18,
        borderWidth: 1, borderColor: '#cdfbe1'
    },
    sparkleIcon: { width: 30, height: 30, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
    aiInsightText: { flex: 1, fontSize: 13, color: '#2D3748', lineHeight: 18 },

    section: { marginTop: 30 },
    sectionLabel: { fontSize: 11, fontWeight: '800', color: '#94A3B8', letterSpacing: 1.5, marginBottom: 12 },
    descText: { fontSize: 15, color: '#475569', lineHeight: 24 },

    merchantCard: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        backgroundColor: '#F8FAFC', padding: 14, borderRadius: 16, marginTop: 30,
        borderWidth: 1, borderColor: '#F1F5F9'
    },
    merchantInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    merchantAvatar: {
        width: 44, height: 44, borderRadius: 12,
        backgroundColor: '#033e3b', justifyContent: 'center', alignItems: 'center'
    },
    merchantInitial: { fontWeight: '800', fontSize: 16, color: '#FFF' },
    merchantName: { fontSize: 15, fontWeight: '700', color: '#0F172A' },
    merchantLoc: { fontSize: 12, color: '#64748B' },

    footerContainer: {
        position: 'absolute', bottom: 0, width: width,
        height: 150, paddingBottom: Platform.OS === 'ios' ? 20 : 0,
        backgroundColor:"aliceblue",

    },
    blurFooter: { flex: 1, paddingHorizontal: 20, justifyContent: 'center' },
    footerContent: { flexDirection: 'row', gap: 12, alignItems: 'center' },
    addBtn: {
        flex: 1, height: 54, borderRadius: 16,
        borderWidth: 1.5, borderColor: '#0F172A',
        justifyContent: 'center', alignItems: 'center'
    },
    addBtnText: { fontSize: 14, fontWeight: '700', color: '#0F172A', letterSpacing: 0.5 },
    buyBtn: {
        flex: 1.3, height: 54, borderRadius: 16,
        overflow: 'hidden',
        justifyContent: 'center', alignItems: 'center'
    },
    buyBtnText: { fontSize: 14, fontWeight: '700', color: '#FFF', letterSpacing: 0.5 },
    viewCartBtn: {
        flex: 1, height: 54, borderRadius: 16, backgroundColor: '#0F172A',
        flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10
    },
    viewCartText: { color: 'white', fontSize: 14, fontWeight: '800', letterSpacing: 0.5 }
});