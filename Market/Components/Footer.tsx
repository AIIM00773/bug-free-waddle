import { LinearGradient } from 'expo-linear-gradient';
import { router } from "expo-router";
import { Grid2X2Plus, Package, ShoppingBag, Sparkles, User } from "lucide-react-native";
import React from 'react';
import { Dimensions, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const { width } = Dimensions.get('window');

// Modern Palette - Matches New Design
const THEME = {
    primary: "#3B82F6",      // Blue
    accent: "#00F5FF",       // Cyan
    secondary: "#8B5CF6",    // Purple
    tertiary: "#F5576C",     // Pink
    light: "#FFFFFF",
    textLight: "rgba(255, 255, 255, 0.9)",
    textMuted: "rgba(255, 255, 255, 0.6)",
    glass: "rgba(255, 255, 255, 0.15)",
    glassBorder: "rgba(255, 255, 255, 0.2)",
};

interface NavProps {
    activeTab?: 'Find' | 'History' | 'Cart' | 'Orders' | 'Profile';
    onSearchClick?: () => void;
}

export default function BottomNav({ activeTab = 'Find', onSearchClick }: NavProps) {

    const NavItem = ({ name, Icon, label, onPress }: any) => {
        const isActive = activeTab === name;
        const isAI = name === 'Find';

        return (
            <TouchableOpacity
                style={styles.tabItem}
                activeOpacity={0.7}
                onPress={onPress}
            >
                {isAI ? (
                    <View style={styles.aiWrapper}>
                        <LinearGradient
                            colors={[THEME.primary, THEME.accent, THEME.secondary]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.aiCircle}
                        >
                            <Sparkles size={22} color={THEME.light} fill={THEME.light} />
                        </LinearGradient>
                        {isActive && <View style={styles.activeDot} />}
                    </View>
                ) : (
                    <View style={styles.iconWrapper}>
                        <Icon
                            size={22}
                            color={isActive ? THEME.accent : THEME.textMuted}
                            strokeWidth={isActive ? 2.5 : 2}
                        />
                        {isActive && <View style={styles.activeDot} />}
                    </View>
                )}

                <Text style={[
                    styles.tabLabel,
                    {
                        color: isActive ? THEME.light : THEME.textMuted,
                        fontWeight: isActive ? "700" : "500",
                    }
                ]}>
                    {label}
                </Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.outerContainer}>
            <LinearGradient
                colors={['rgba(255,255,255,0)', THEME.glass]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.gradientOverlay}
            />
            <View style={styles.navBar}>
                <NavItem
                    name="Discoveries"
                    Icon={Grid2X2Plus}
                    label="Discoveries"
                    onPress={() => router.push("/General/SearchAndResponse")}
                />
                <NavItem
                    name="Orders"
                    Icon={Package}
                    label="Orders"
                    onPress={() => router.push("/General/Orders")}
                />


                <NavItem
                    name="Cart"
                    Icon={ShoppingBag}
                    label="Cart"
                    onPress={() => router.push("/General/UserCart")}
                />
                <NavItem
                    name="Profile"
                    Icon={User}
                    label="Account"
                    onPress={() => router.push("/General/UserProfile")}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    outerContainer: {
        position: "absolute",
        bottom: Platform.OS === 'ios' ? 35 : 45,
        width: width,
        alignItems: "center",
        paddingHorizontal: 12,
    },
    gradientOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: 24,
    },

    navBar: {
        width: "100%",
        height: 88,
        display:"flex",
        flexDirection:"row",
        alignItems:"center"
  
    },
    tabItem: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
    },
    iconWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 28,
    },
    aiWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: -35, // Floating effect
    },
    aiCircle: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 3,
        borderColor: THEME.light,
        shadowColor: THEME.primary,
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.6,
        shadowRadius: 16,
        elevation: 12,
    },
    activeDot: {
        width: 5,
        height: 5,
        borderRadius: 2.5,
        backgroundColor: THEME.accent,
        position: 'absolute',
        bottom: -12,
        shadowColor: THEME.accent,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 4,
    },
    tabLabel: {
        fontSize: 11,
        marginTop: 8,
        letterSpacing: -0.1,
        fontWeight: '600',
    }
});

