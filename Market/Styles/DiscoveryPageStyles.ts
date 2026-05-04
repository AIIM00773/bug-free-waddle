import { COLORS } from "@/constants";
import { Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 40) / 2;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#022c29',
    },
    flex1: {
        flex: 1,
    },
    safeAreaHeader: {
        backgroundColor: 'transparent',
    },
    scrollContent: {
        paddingBottom: 140,
        paddingHorizontal: 14,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingVertical: 12,
        height: 64,
    },
    headerIconBtn: {
        width: 42,
        height: 42,
        borderRadius: 14,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    headerTitleContainer: {
        flex: 1,
        alignItems: 'center',
    },
    headerTitleText: {
        fontSize: 14,
        fontWeight: '900',
        color: '#FFFFFF',
        letterSpacing: 1.5,
        textTransform: 'uppercase',
    },
    heroContent: {
        flex: 1,
        height: height * 0.7,
        justifyContent: 'center',
        alignItems: 'center',
    },
    heroSubtitle: {
        fontSize: 25,
        fontWeight: '800',
        color: '#FFFFFF',
        textAlign: 'center',
        paddingHorizontal: 20,
        lineHeight: 40,
    },
    minimalDivider: {
        width: 50,
        height: 4,
        backgroundColor: COLORS.accent,
        marginVertical: 24,
        borderRadius: 2,
    },
    heroSubtext: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.5)',
        fontWeight: '500',
    },
    initialSearchBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.accent,
        paddingHorizontal: 28,
        paddingVertical: 18,
        borderRadius: 35,
        shadowColor: COLORS.accent,
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 8,
    },
    initialSearchBtnText: {
        color: COLORS.dark,
        fontWeight: '700',
        fontSize: 13,
        marginLeft: 12,
    },
    chatContainer: {
        paddingTop: 20,
    },
    historyItemWrapper: {
        marginBottom: 40,
    },
    userBubble: {
        alignSelf: 'flex-end',
        maxWidth: '85%',
        marginBottom: 20,
    },
    userBubbleGradient: {
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderRadius: 24,
        borderBottomRightRadius: 4,
    },
    userText: {
        color: '#121212',
        fontSize: 16,
        fontWeight: '500',
        lineHeight: 24,
    },
    aiHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    aiIcon: {
        width: 28,
        height: 28,
        borderRadius: 10,
        backgroundColor: COLORS.accent,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    aiName: {
        color: COLORS.accent,
        fontSize: 12,
        fontWeight: '800',
        letterSpacing: 1.2,
        textTransform: 'uppercase',
    },
    aiLargeText: {
        color: '#F0F0F0',
        fontSize: 18,
        lineHeight: 30,
        fontWeight: '400',
        marginBottom: 20,
        paddingLeft: 4,
    },
    gridContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        backgroundColor: "aliceblue",
        padding: 2,
        borderRadius: 20,
        flexGrow:1,
        flexShrink:1,
        flexBasis:1,
        
    },
    gridColumn: {
        width: COLUMN_WIDTH,
        gap: 12,
    },
    card: {
        width: '100%',
        borderRadius: 22, // Slightly rounder feels more modern
        overflow: 'hidden',
        backgroundColor: 'rgba(255,255,255,0.05)', // Slightly more visible
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)', // Subtle edge
        marginBottom: 12,
    },

    cardGradient: {
        flex: 1,
        padding: 16,
        justifyContent: 'flex-end',
    },
    tagBadge: {
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        marginBottom: 8,
    },
    tagText: {
        color: COLORS.accent,
        fontSize: 10,
        fontWeight: '300',
        textTransform: 'lowercase',
    },
    cardTitle: {
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: '700',
        lineHeight: 20,
    },
    cardPrice: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '800',
        marginTop: 6,
    },
    suggestionScroll: {
        marginTop: 20,
    },
    suggestionChip: {
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 30,
        marginRight: 10,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    suggestionText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
    followupContainer: {
        marginTop: 20,
        borderRadius: 10,
        overflow: 'hidden',
    },
    followupGradient: {
        padding: 20,
        borderStyle: "solid",
        borderColor: "orange",
        borderLeftWidth: 4,
        borderLeftColor: COLORS.accent,
        borderRightWidth: 4,
        borderRightColor: "orange",
    },
    followupText: {
        color: '#FFF',
        fontSize: 15,
        fontStyle: 'italic',
        lineHeight: 22,
        opacity: 0.9,
    },
    floatingActionContainer: {
        position: 'absolute',
        bottom: 40,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    floatingSearchBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.accent,
        paddingHorizontal: 32,
        paddingVertical: 18,
        borderRadius: 40,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 12,
    },
    floatingBtnText: {
        color: COLORS.dark,
        fontWeight: '800',
        fontSize: 16,
        marginLeft: 12,
    },
    loadingContainer: {
        paddingVertical: 50,
        alignItems: 'center',
    },
    loadingText: {
        color: 'rgba(255, 255, 255, 0.4)',
        fontSize: 14,
        marginTop: 16,
        fontWeight: '500',
    }
});

export default styles;