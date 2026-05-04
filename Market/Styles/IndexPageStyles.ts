

import { Dimensions, StyleSheet } from "react-native";

import {
    COLORS
} from "@/constants";


const { width, height } = Dimensions.get("screen");




const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.dark,
    },

    flex1: {
        flex: 1

    },


    backgroundImage: {
        ...StyleSheet.absoluteFillObject,
        width: width,
        height: height,
        opacity: 0.25, // Keep it subtle
    },
    backgroundOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(4, 13, 56, 0.4)', // Tint to match your primary dark blue
    },
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingVertical: 16,
        alignItems: 'center',
    },
    brand: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    versionBadge: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    versionText: {
        color: COLORS.light,
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    headerActions: {
        flexDirection: 'row',
        gap: 12
    },
    glassIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    heroContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 120,
        paddingHorizontal: 24,
    },
    titleWrapper: {
        alignItems: 'center',
        marginBottom: 60,
    },
    subtitle: {
        fontSize: 28, // reduced from 36 (more professional)
        color: 'rgba(255,255,255,0.9)',
        textAlign: 'center',
        fontWeight: '600', // less aggressive than 700
        letterSpacing: 0.3,
        lineHeight: 36,
    },

    subtext: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.6)',
        textAlign: 'center',
        marginTop: 8,
        fontWeight: '400',
        letterSpacing: 0.2,
    },

    explorePill: {
        width: '100%',
        alignItems: 'center',
    },


    pillGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 14,
        gap: 15,

    },




    // --- FLOATING ACTION BUTTON ---
    floatingActionContainer: {
        position: 'absolute',
        bottom: 40,
        alignSelf: 'center',
        borderRadius: 30,
        elevation: 16,
        shadowColor: '#000',
        shadowOpacity: 0.4,
        shadowRadius: 16,
    },
    floatingSearchBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.dark,
        paddingHorizontal: 25,
        paddingVertical: 14,
        borderRadius: 28,
        gap: 10,
    },
    floatingBtnText: {
        color: COLORS.light,
        fontWeight: '700',
        fontSize: 13
    },



    quickAction: {
        alignItems: 'center',
        minWidth: 80,
    },
    quickActionIcon: {
        width: 52,
        height: 52,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    quickActionText: {
        fontSize: 11,
        fontWeight: '600',
        color: COLORS.light,
    },



    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    imageModal: {
        width: '100%',
        borderRadius: 24,
        overflow: 'hidden',
    },
    modalGradient: {
        padding: 24,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: COLORS.light,
    },
    closeButton: {
        padding: 8,
    },
    modalSubtitle: {
        fontSize: 15,
        color: 'rgba(255, 255, 255, 0.7)',
        marginBottom: 32,
    },
    imageOptions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 32,
        gap: 12,
    },
    imageOption: {
        flex: 1,
        alignItems: 'center',
        padding: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    optionIcon: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    optionTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: COLORS.light,
        marginBottom: 4,
    },
    optionDesc: {
        fontSize: 11,
        color: 'rgba(255, 255, 255, 0.5)',
        textAlign: 'center',
    },
    cancelButton: {
        alignSelf: 'center',
        paddingVertical: 10,
    },
    cancelText: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.5)',
        fontWeight: '600',
    },


    // -----------------surgestion cards


    suggestionCardHorizontal: {
    width: 140, // Fixed width for horizontal scrolling
    height: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    // Adds a subtle glow effect
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  suggestionIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  suggestionTitle: {
    color: COLORS.light,
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },



});

// -------------



export {
    styles
};

