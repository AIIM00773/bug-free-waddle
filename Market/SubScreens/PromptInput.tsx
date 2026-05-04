import { useConversation } from "@/Providers/ConversationProvider";
import { usePrompt } from "@/Providers/MainProptsProvider";
import * as Haptics from 'expo-haptics';
import { ArrowUp, Mic, Sparkles, X } from "lucide-react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    Keyboard,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { height } = Dimensions.get('window');

const CONFIG = {
    MAX_CHARS: 200,
    MIN_CHARS: 3,
};

const THEME = {
    primary: "#2ECC71",
    accent: "#48cae4",
    glass: "rgba(15, 23, 42, 0.95)", // Slightly more opaque for readability
    border: "rgba(255, 255, 255, 0.15)",
    text: "#FFFFFF",
    textMuted: "rgba(255, 255, 255, 0.5)",
    bgDark: "rgba(0,0,0,0.85)"
};

// --- Filter Configuration ---
const SEARCH_CATEGORIES = [
    // --- QUALITY & TRUST ---
    { id: 'top_rated', label: 'Highly Rated', icon: '⭐️' },
    { id: 'verified', label: 'Verified Sellers', icon: '✅' },
    { id: 'premium', label: 'Luxury & Premium', icon: '💎' },

    // --- VALUE & DEALS ---
    { id: 'on_sale', label: 'Best Deals', icon: '🔥' },
    { id: 'price_drop', label: 'Recent Price Drops', icon: '📉' },
    { id: 'clearance', label: 'Clearance', icon: '📦' },

    // --- LOGISTICS & LOCAL ---
    { id: 'near_me', label: 'Local to Me', icon: '📍' },
    { id: 'fast_shipping', label: 'Ships Fast', icon: '⚡️' },
    { id: 'free_shipping', label: 'Free Shipping', icon: '🚚' },

    // --- SOCIAL & TRENDS ---
    { id: 'popular', label: 'Popular Brands', icon: '🏆' },
    { id: 'trending', label: 'Trending Now', icon: '📈' },
    { id: 'most_liked', label: 'Most Wished For', icon: '❤️' },

    // --- ECO & ETHICAL ---
    { id: 'eco_friendly', label: 'Eco-Friendly', icon: '🌱' },
    { id: 'refurbished', label: 'Refurbished', icon: '♻️' },
    { id: 'new_arrivals', label: 'New Arrivals', icon: '✨' },
];



interface PromptInputBoxProps {
    visible: boolean;
    onClose: () => void;
    placeholder?: string;
    switchPage?: () => void;
}


const PromptInputBox: React.FC<PromptInputBoxProps> = ({
    visible,
    onClose,
    placeholder = "What are you looking for?",
    switchPage
}) => {
    const { setPrompt } = usePrompt();
    const { performNewSearch, performFollowupSearch, currentConversation } = useConversation();
    const insets = useSafeAreaInsets();

    const [localValue, setLocalValue] = useState("");
    const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

    const inputRef = useRef<TextInput>(null);
    const slideAnim = useRef(new Animated.Value(height)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
                Animated.spring(slideAnim, {
                    toValue: 0,
                    friction: 9,
                    tension: 40,
                    useNativeDriver: true
                })
            ]).start();

            // UX: Slight delay ensures the modal is ready before keyboard pops
            const timer = setTimeout(() => {
                inputRef.current?.focus();
            }, 150);
            return () => clearTimeout(timer);
        } else {
            Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start();
            slideAnim.setValue(height);
            setLocalValue("");
            setSelectedFilters([]);
        }
    }, [visible]);

    const toggleFilter = (id: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setSelectedFilters(prev =>
            prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
        );
    };

    const handleConfirm = useCallback(async () => {
        const cleanText = localValue.trim();
        if (cleanText.length < CONFIG.MIN_CHARS) return;

        // Visual/Tactile Feedback
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Keyboard.dismiss();

        // 1. Update Global UI State
        setPrompt(cleanText);

        // 2. Build Query with Filters
        const query = {
            text: cleanText,
            filters: selectedFilters
        };

        // 3. Logic Bridge
        if (currentConversation?.conversationId) {
            performFollowupSearch(query, currentConversation.conversationId);
        } else {
            performNewSearch(query);
        }

        // 4. Clean exit
        onClose();
        if (switchPage) {
            // Delay navigation slightly so the modal closure feels smooth
            setTimeout(() => switchPage(), 100);
        }
    }, [localValue, selectedFilters, currentConversation, setPrompt, performNewSearch, performFollowupSearch, onClose, switchPage]);

    return (
        <Modal visible={visible} transparent statusBarTranslucent animationType="none">
            <View style={styles.fullscreen}>
                <TouchableWithoutFeedback onPress={onClose}>
                    <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]} />
                </TouchableWithoutFeedback>

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardAvoidingView}
                >
                    <Animated.View style={[
                        styles.sheet,
                        {
                            transform: [{ translateY: slideAnim }],
                            marginBottom: Math.max(insets.bottom, 16)
                        }
                    ]}>
                        <View style={styles.pullBar} />

                        <View style={styles.header}>
                            <View style={styles.badge}>
                                <Sparkles size={14} color={THEME.accent} />
                            </View>
                            <TouchableOpacity onPress={() => {
                                if(localValue.length>0){
                                    setLocalValue('')
                                                                }else{
                                    null
                                }
                            }} >

                                {
                                    localValue.length > 0 ? (
                                        <X color={"white"} />
                                    ) : (
                                        <Text style={styles.charCountText}>
                                            {localValue.length} <Text style={{ opacity: 0.3 }}>/</Text> {CONFIG.MAX_CHARS}
                                        </Text>
                                    )

                                }

                            </TouchableOpacity>

                        </View>

                        <TextInput
                            ref={inputRef}
                            multiline
                            placeholder={placeholder}
                            placeholderTextColor={THEME.textMuted}
                            style={styles.input}
                            value={localValue}
                            onChangeText={setLocalValue}
                            selectionColor={THEME.accent}
                            keyboardAppearance="dark"
                            scrollEnabled
                            maxLength={CONFIG.MAX_CHARS}
                        />

                        {/* --- FILTER ROW --- */}
                        <View style={styles.filterContainer}>
                            <Text style={styles.sectionLabel}>Optimize results With these Filters: </Text>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.filterScroll}
                            >
                                {SEARCH_CATEGORIES.map((cat) => (
                                    <TouchableOpacity
                                        key={cat.id}
                                        onPress={() => toggleFilter(cat.id)}
                                        style={[
                                            styles.filterChip,
                                            selectedFilters.includes(cat.id) && styles.filterChipActive
                                        ]}
                                    >
                                        <Text style={styles.filterEmoji}>{cat.icon}</Text>
                                        <Text style={[
                                            styles.filterText,
                                            selectedFilters.includes(cat.id) && styles.filterTextActive
                                        ]}>
                                            {cat.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>

                        <View style={styles.actionRow}>
                            <TouchableOpacity
                                activeOpacity={0.7}
                                style={styles.iconBtn}
                                onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
                            >
                                <Mic size={20} color={THEME.text} />
                            </TouchableOpacity>

                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={handleConfirm}
                                disabled={localValue.length < CONFIG.MIN_CHARS}
                                style={[
                                    styles.sendBtn,
                                    localValue.length >= CONFIG.MIN_CHARS && styles.sendBtnActive
                                ]}
                            >
                                <ArrowUp
                                    size={24}
                                    color={localValue.length >= CONFIG.MIN_CHARS ? "#000" : THEME.textMuted}
                                    strokeWidth={3}
                                />
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    fullscreen: { flex: 1 },
    backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: THEME.bgDark },
    keyboardAvoidingView: { flex: 1, justifyContent: 'flex-end', paddingHorizontal: 12 },
    sheet: {
        backgroundColor: THEME.glass,
        borderRadius: 32,
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderWidth: 1,
        borderColor: THEME.border,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.4,
        shadowRadius: 20,
    },
    pullBar: {
        width: 36,
        height: 4,
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 16
    },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(72, 202, 228, 0.12)',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 12
    },
    badgeText: { color: THEME.accent, fontSize: 10, fontWeight: '900', letterSpacing: 1 },
    input: {
        fontSize: 18,
        color: THEME.text,
        minHeight: 80,
        maxHeight: 180,
        textAlignVertical: 'top',
        lineHeight: 24
    },
    sectionLabel: {
        color: THEME.textMuted,
        fontSize: 8,
        fontWeight: '600',
        marginBottom: 8,
        textTransform: 'uppercase'
    },
    filterContainer: { marginTop: 25 },
    filterScroll: { gap: 14, paddingRight: 20 },
    filterChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)'
    },
    filterChipActive: {
        backgroundColor: THEME.primary + '20', // 20% opacity
        borderColor: THEME.primary,
    },
    filterEmoji: { marginRight: 4, fontSize: 10 },
    filterText: { color: THEME.textMuted, fontSize: 9, fontWeight: '500' },
    filterTextActive: { color: THEME.primary, fontWeight: '700' },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 15,
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.05)'
    },
    charCountText: { color: THEME.textMuted, fontSize: 11, fontWeight: '600' },
    iconBtn: {
        width: 42,
        height: 42,
        borderRadius: 21,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)'
    },
    sendBtn: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: 'rgba(255,255,255,0.05)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    sendBtnActive: {
        backgroundColor: THEME.primary,
    },
});

export default React.memo(PromptInputBox);