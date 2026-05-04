import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    ActivityIndicator,
    Animated,
    Dimensions,
    Easing,
    Platform,
    Pressable,
    StatusBar,
    StyleSheet,
    Text,
    View
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { MoveRight } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// @ts-ignore
import LANDING_IMAGE from "@/assets/Gemini_Generated_Image_dn4rjmdn4rjmdn4r.png";

const { width, height } = Dimensions.get("window");


/* -------------------------------------------------------------------------- */
/*                                   CONFIG                                   */
/* -------------------------------------------------------------------------- */

const COLORS = {
    background: "#020A02",
    white: "#FFFFFF",
    muted: "rgba(255,255,255,0.72)",
    border: "rgba(255,255,255,0.14)",
    glass: "rgba(255,255,255,0.08)",
    overlayTop: "rgba(39, 77, 43, 0.71)",
    overlayMiddle: "rgba(12, 23, 12, 0.8)",
    overlayBottom: "rgba(1,17,1,0.96)",
};

const STORAGE_KEYS = {
    signature: "DropAI_Signature",
};

const ROUTES = {
    signIn: "/AppForms/Signin",
    signUp: "/AppForms/Signup",
} as const;

/* -------------------------------------------------------------------------- */
/*                              LANDING COMPONENT                             */
/* -------------------------------------------------------------------------- */

interface DropAILandingGateProps {
    isLoading?: boolean;
}

export default function DropAILandingGate({
    isLoading = false,
}: DropAILandingGateProps) {
    /* ---------------------------------------------------------------------- */
    /*                                 STATES                                 */
    /* ---------------------------------------------------------------------- */

    const [isRouting, setIsRouting] = useState(false);

    /* ---------------------------------------------------------------------- */
    /*                               ANIMATIONS                               */
    /* ---------------------------------------------------------------------- */

    const fadeAnimation = useRef(new Animated.Value(0)).current;
    const translateAnimation = useRef(new Animated.Value(28)).current;
    const scaleAnimation = useRef(new Animated.Value(1.05)).current;

    /* ---------------------------------------------------------------------- */
    /*                               MEMOIZED                                 */
    /* ---------------------------------------------------------------------- */

    const isButtonDisabled = useMemo(
        () => isRouting || isLoading,
        [isRouting, isLoading]
    );

    /* ---------------------------------------------------------------------- */
    /*                               SIDE EFFECTS                             */
    /* ---------------------------------------------------------------------- */

    useEffect(() => {
        if (isLoading) return;

        Animated.parallel([
            Animated.timing(fadeAnimation, {
                toValue: 1,
                duration: 900,
                easing: Easing.out(Easing.exp),
                useNativeDriver: true,
            }),

            Animated.timing(translateAnimation, {
                toValue: 0,
                duration: 900,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }),

            Animated.timing(scaleAnimation, {
                toValue: 1,
                duration: 1400,
                easing: Easing.out(Easing.exp),
                useNativeDriver: true,
            }),
        ]).start();
    }, [fadeAnimation, isLoading, scaleAnimation, translateAnimation]);

    /* ---------------------------------------------------------------------- */
    /*                                HANDLERS                                */
    /* ---------------------------------------------------------------------- */

    const handleContinue = useCallback(async () => {
        if (isRouting) return;

        setIsRouting(true);

        try {
            const signature = await SecureStore.getItemAsync(
                STORAGE_KEYS.signature
            );

            const targetRoute = signature
                ? ROUTES.signIn
                : ROUTES.signUp;

            router.replace(targetRoute);
        } catch (error) {
            console.error(
                "[DropAI Landing Gate] Failed to read secure signature:",
                error
            );

            router.replace(ROUTES.signUp);
        } finally {
            setIsRouting(false);
        }
    }, [isRouting]);

    /* ---------------------------------------------------------------------- */
    /*                            INITIAL LOADER                              */
    /* ---------------------------------------------------------------------- */

    if (isLoading) {
        return (
            <View style={styles.loaderContainer}>
                <StatusBar barStyle="light-content" />

                <ActivityIndicator
                    size="small"
                    color={COLORS.white}
                />
            </View>
        );
    }

    /* ---------------------------------------------------------------------- */
    /*                                  VIEW                                  */
    /* ---------------------------------------------------------------------- */

    return (
        <View style={styles.container}>
            <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle="light-content"
            />

            {/* Background Image */}
            <Animated.Image
                source={LANDING_IMAGE}
                resizeMode="cover"
                style={[
                    styles.backgroundImage,
                    {
                        transform: [{ scale: scaleAnimation }],
                    },
                ]}
            />

            {/* Overlay */}
            <LinearGradient
                colors={[
                    COLORS.overlayTop,
                    COLORS.overlayMiddle,
                    COLORS.overlayBottom,
                ]}
                locations={[0, 0.45, 1]}
                style={StyleSheet.absoluteFillObject}
            />

            {/* Main Content */}
            <SafeAreaView style={styles.safeArea}>
                {/* Top Branding */}
                <Animated.View
                    style={[
                        styles.header,
                        {
                            opacity: fadeAnimation,
                        },
                    ]}
                >
                    <Text style={styles.logo}>
                        Drop
                        <Text style={styles.logoLight}>AI</Text>
                    </Text>
                </Animated.View>

                {/* Bottom Content */}
                <Animated.View
                    style={[
                        styles.bottomSection,
                        {
                            opacity: fadeAnimation,
                            transform: [
                                {
                                    translateY: translateAnimation,
                                },
                            ],
                        },
                    ]}
                >
                    {/* Headline */}
                    <Text style={styles.title}>
                        Smart{"\n"}
                        <Text style={styles.titleLight}>
                            Shopping.
                        </Text>
                    </Text>

                    {/* Subtitle */}
                    <Text style={styles.subtitle}>
                        Discover products faster with intelligent,
                        conversational commerce powered by DropAI.
                    </Text>

                    {/* CTA */}
                    <Pressable
                        disabled={isButtonDisabled}
                        onPress={handleContinue}
                        android_ripple={{
                            color: "rgba(255,255,255,0.08)",
                            borderless: false,
                        }}
                        style={({ pressed }) => [
                            styles.button,
                            pressed && styles.buttonPressed,
                            isButtonDisabled && styles.buttonDisabled,
                        ]}
                    >
                        <View style={styles.buttonContent}>
                            {isRouting ? (
                                <>
                                    <ActivityIndicator
                                        size="small"
                                        color={COLORS.white}
                                    />

                                    <Text style={styles.buttonText}>
                                        Preparing...
                                    </Text>
                                </>
                            ) : (
                                <>
                                    <Text style={styles.buttonText}>
                                        Get Started
                                    </Text>

                                    <View style={styles.iconContainer}>
                                        <MoveRight
                                            size={18}
                                            strokeWidth={2}
                                            color={COLORS.background}
                                        />
                                    </View>
                                </>
                            )}
                        </View>
                    </Pressable>
                </Animated.View>
            </SafeAreaView>
        </View>
    );
}

/* -------------------------------------------------------------------------- */
/*                                   STYLES                                   */
/* -------------------------------------------------------------------------- */

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },

    loaderContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.background,
    },

    backgroundImage: {
        ...StyleSheet.absoluteFillObject,
        width,
        height,
    },

    safeArea: {
        flex: 1,
        paddingHorizontal: 28,
        justifyContent: "space-between",
    },

    header: {
        alignItems: "center",
        paddingTop: Platform.OS === "android" ? 8 : 0,
    },

    logo: {
        color: COLORS.white,
        fontSize: 22,
        fontWeight: "800",
        letterSpacing: -1,
    },

    logoLight: {
        fontWeight: "300",
    },

    bottomSection: {
        paddingBottom: Platform.OS === "ios" ? 36 : 44,
    },

    title: {
        color: COLORS.white,
        fontSize: width > 400 ? 56 : 48,
        fontWeight: "800",
        lineHeight: width > 400 ? 60 : 54,
        letterSpacing: -2.2,
    },

    titleLight: {
        fontWeight: "300",
    },

    subtitle: {
        marginTop: 18,
        color: COLORS.muted,
        fontSize: 15,
        lineHeight: 24,
        maxWidth: "88%",
        fontWeight: "400",
    },

    button: {
        marginTop: 38,
        height: 64,
        borderRadius: 999,
        overflow: "hidden",

        backgroundColor: COLORS.glass,
        borderWidth: 1,
        borderColor: COLORS.border,

        justifyContent: "center",
        paddingHorizontal: 10,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.2,
        shadowRadius: 20,

        elevation: 10,
    },

    buttonPressed: {
        opacity: 0.92,
        transform: [{ scale: 0.995 }],
    },

    buttonDisabled: {
        opacity: 0.8,
    },

    buttonContent: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingLeft: 18,
    },

    buttonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: "700",
        letterSpacing: 0.2,
    },

    iconContainer: {
        width: 46,
        height: 46,
        borderRadius: 23,
        backgroundColor: COLORS.white,
        justifyContent: "center",
        alignItems: "center",
    },
});