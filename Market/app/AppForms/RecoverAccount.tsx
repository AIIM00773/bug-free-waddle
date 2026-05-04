import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import {
    ActivityIndicator,
    Animated,
    Easing,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import {
    Feather,
    MaterialCommunityIcons,
} from "@expo/vector-icons";

/* -------------------------------------------------------------------------- */
/*                                   CONFIG                                   */
/* -------------------------------------------------------------------------- */

const COLORS = {
    background: "#020A02",

    card: "rgba(255,255,255,0.06)",
    cardBorder: "rgba(255,255,255,0.08)",

    input: "rgba(255,255,255,0.06)",
    inputBorder: "rgba(255,255,255,0.10)",

    white: "#FFFFFF",
    muted: "rgba(255,255,255,0.68)",
    placeholder: "rgba(255,255,255,0.38)",

    primary: "#FFFFFF",
    textDark: "#021002",

    success: "#10B981",

    infoBackground:
        "rgba(16,185,129,0.10)",

    infoBorder:
        "rgba(16,185,129,0.18)",

    glow:
        "rgba(16,185,129,0.08)",
};

/* -------------------------------------------------------------------------- */
/*                         RECOVER ACCOUNT SCREEN                             */
/* -------------------------------------------------------------------------- */

export default function RecoverAccountScreen() {
    /* ---------------------------------------------------------------------- */
    /*                                 STATES                                 */
    /* ---------------------------------------------------------------------- */

    const [email, setEmail] = useState("");

    const [isSubmitting, setIsSubmitting] =
        useState(false);

    const [isSubmitted, setIsSubmitted] =
        useState(false);

    const [error, setError] = useState("");

    /* ---------------------------------------------------------------------- */
    /*                               ANIMATIONS                               */
    /* ---------------------------------------------------------------------- */

    const fadeAnimation = useRef(
        new Animated.Value(0)
    ).current;

    const translateAnimation = useRef(
        new Animated.Value(24)
    ).current;

    /* ---------------------------------------------------------------------- */
    /*                               SIDE EFFECTS                             */
    /* ---------------------------------------------------------------------- */

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnimation, {
                toValue: 1,
                duration: 700,
                easing: Easing.out(Easing.exp),
                useNativeDriver: true,
            }),

            Animated.timing(translateAnimation, {
                toValue: 0,
                duration: 700,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }),
        ]).start();
    }, [fadeAnimation, translateAnimation]);

    /* ---------------------------------------------------------------------- */
    /*                              DERIVED STATE                             */
    /* ---------------------------------------------------------------------- */

    const isEmailValid = useMemo(() => {
        return /^\S+@\S+\.\S+$/.test(
            email.trim()
        );
    }, [email]);

    /* ---------------------------------------------------------------------- */
    /*                                HANDLERS                                */
    /* ---------------------------------------------------------------------- */

    const handleRecovery =
        useCallback(async () => {
            setError("");

            if (!isEmailValid) {
                setError(
                    "Please enter a valid email address."
                );

                return;
            }

            setIsSubmitting(true);

            try {
                /* ---------------------------------------------------------- */
                /*                 YOUR RESET PASSWORD API                    */
                /* ---------------------------------------------------------- */

                await new Promise((resolve) =>
                    setTimeout(resolve, 2000)
                );

                setIsSubmitted(true);
            } catch (err) {
                console.error(
                    "[RECOVERY_ERROR]:",
                    err
                );

                setError(
                    "Something went wrong. Please try again."
                );
            } finally {
                setIsSubmitting(false);
            }
        }, [isEmailValid]);

    const resetFlow = useCallback(() => {
        setIsSubmitted(false);
        setError("");
    }, []);

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

            {/* BACKGROUND */}
            <LinearGradient
                colors={[
                    "#021002",
                    "#041808",
                    "#05210A",
                    "#021002",
                ]}
                locations={[0, 0.35, 0.7, 1]}
                style={StyleSheet.absoluteFillObject}
            />


            <SafeAreaView style={styles.safeArea}>
                <KeyboardAvoidingView
                    style={styles.keyboardContainer}
                    behavior={
                        Platform.OS === "ios"
                            ? "padding"
                            : undefined
                    }
                >
                    <ScrollView
                        bounces={false}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={
                            false
                        }
                        contentContainerStyle={
                            styles.scrollContent
                        }
                    >
                        {/* HEADER */}
                        <Animated.View
                            style={[
                                styles.header,
                                {
                                    opacity:
                                        fadeAnimation,

                                    transform: [
                                        {
                                            translateY:
                                                translateAnimation,
                                        },
                                    ],
                                },
                            ]}
                        >
                            {/* BACK BUTTON */}
                            <Pressable
                                style={
                                    styles.backButton
                                }
                                onPress={() =>
                                    router.back()
                                }
                            >
                                <Feather
                                    name="chevron-left"
                                    size={22}
                                    color={
                                        COLORS.white
                                    }
                                />
                            </Pressable>

                            <View
                                style={
                                    styles.headerContent
                                }
                            >
                              

                                <Text
                                    style={
                                        styles.title
                                    }
                                >
                                    Account{"\n"}
                                    <Text
                                        style={
                                            styles.titleLight
                                        }
                                    >
                                        Recovery.
                                    </Text>
                                </Text>

                                <Text
                                    style={
                                        styles.subtitle
                                    }
                                >
                                    Securely regain
                                    access to your
                                    DropAI account in
                                    just a few steps.
                                </Text>
                            </View>
                        </Animated.View>

                        {/* FORM / SUCCESS */}
                        <Animated.View
                            style={[
                                styles.card,
                                {
                                    opacity:
                                        fadeAnimation,

                                    transform: [
                                        {
                                            translateY:
                                                translateAnimation,
                                        },
                                    ],
                                },
                            ]}
                        >
                            {!isSubmitted ? (
                                <>
                                    {/* INFO */}
                                    <View
                                        style={
                                            styles.infoBox
                                        }
                                    >
                                        <View
                                            style={
                                                styles.infoIcon
                                            }
                                        >
                                            <Feather
                                                name="mail"
                                                size={
                                                    18
                                                }
                                                color={
                                                    COLORS.success
                                                }
                                            />
                                        </View>

                                        <Text
                                            style={
                                                styles.infoText
                                            }
                                        >
                                            Enter your
                                            registered
                                            email address
                                            and we’ll send
                                            you a secure
                                            recovery link.
                                        </Text>
                                    </View>

                                    {/* ERROR */}
                                    {!!error && (
                                        <View
                                            style={
                                                styles.errorContainer
                                            }
                                        >
                                            <Feather
                                                name="alert-circle"
                                                size={
                                                    16
                                                }
                                                color="#FCA5A5"
                                            />

                                            <Text
                                                style={
                                                    styles.errorText
                                                }
                                            >
                                                {
                                                    error
                                                }
                                            </Text>
                                        </View>
                                    )}

                                    {/* EMAIL */}
                                    <View
                                        style={
                                            styles.fieldWrapper
                                        }
                                    >
                                        <Text
                                            style={
                                                styles.fieldLabel
                                            }
                                        >
                                            Registered
                                            Email
                                        </Text>

                                        <View
                                            style={
                                                styles.inputContainer
                                            }
                                        >
                                            <Feather
                                                name="at-sign"
                                                size={
                                                    18
                                                }
                                                color={
                                                    COLORS.muted
                                                }
                                                style={
                                                    styles.inputIcon
                                                }
                                            />

                                            <TextInput
                                                style={
                                                    styles.input
                                                }
                                                placeholder="john@example.com"
                                                placeholderTextColor={
                                                    COLORS.placeholder
                                                }
                                                keyboardType="email-address"
                                                autoCapitalize="none"
                                                autoCorrect={
                                                    false
                                                }
                                                value={
                                                    email
                                                }
                                                onChangeText={(
                                                    value
                                                ) => {
                                                    setEmail(
                                                        value
                                                    );

                                                    if (
                                                        error
                                                    ) {
                                                        setError(
                                                            ""
                                                        );
                                                    }
                                                }}
                                            />
                                        </View>
                                    </View>

                                    {/* BUTTON */}
                                    <Pressable
                                        disabled={
                                            isSubmitting
                                        }
                                        onPress={
                                            handleRecovery
                                        }
                                        style={({
                                            pressed,
                                        }) => [
                                            styles.button,

                                            pressed &&
                                                styles.buttonPressed,

                                            isSubmitting &&
                                                styles.buttonDisabled,
                                        ]}
                                    >
                                        {isSubmitting ? (
                                            <ActivityIndicator
                                                color={
                                                    COLORS.textDark
                                                }
                                                size="small"
                                            />
                                        ) : (
                                            <View
                                                style={
                                                    styles.buttonContent
                                                }
                                            >
                                                <Text
                                                    style={
                                                        styles.buttonText
                                                    }
                                                >
                                                    Send
                                                    Reset
                                                    Link
                                                </Text>

                                                <View
                                                    style={
                                                        styles.buttonIcon
                                                    }
                                                >
                                                    <Feather
                                                        name="send"
                                                        size={
                                                            14
                                                        }
                                                        color={
                                                            COLORS.white
                                                        }
                                                    />
                                                </View>
                                            </View>
                                        )}
                                    </Pressable>
                                </>
                            ) : (
                                /* SUCCESS STATE */
                                <View
                                    style={
                                        styles.successWrapper
                                    }
                                >
                                    <View
                                        style={
                                            styles.successIconContainer
                                        }
                                    >
                                        <MaterialCommunityIcons
                                            name="check-decagram"
                                            size={
                                                60
                                            }
                                            color={
                                                COLORS.success
                                            }
                                        />
                                    </View>

                                    <Text
                                        style={
                                            styles.successTitle
                                        }
                                    >
                                        Check your
                                        inbox
                                    </Text>

                                    <Text
                                        style={
                                            styles.successSubtitle
                                        }
                                    >
                                        If an account
                                        exists for{" "}
                                        <Text
                                            style={
                                                styles.highlightText
                                            }
                                        >
                                            {
                                                email
                                            }
                                        </Text>
                                        , a secure reset
                                        link will arrive
                                        shortly.
                                    </Text>

                                    <Pressable
                                        style={
                                            styles.secondaryButton
                                        }
                                        onPress={
                                            resetFlow
                                        }
                                    >
                                        <Text
                                            style={
                                                styles.secondaryButtonText
                                            }
                                        >
                                            Try another
                                            email
                                        </Text>
                                    </Pressable>
                                </View>
                            )}
                        </Animated.View>

                  
                    </ScrollView>
                </KeyboardAvoidingView>
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
        backgroundColor:
            COLORS.background,
    },

    safeArea: {
        flex: 1,
    },

    keyboardContainer: {
        flex: 1,
    },

    scrollContent: {
        flexGrow: 1,

        justifyContent: "center",

        paddingHorizontal: 24,
        paddingVertical: 40,
    },

    glowTop: {
        position: "absolute",

        top: -120,
        right: -100,

        width: 260,
        height: 260,

        borderRadius: 260,

        backgroundColor:
            COLORS.glow,
    },

    glowBottom: {
        position: "absolute",

        bottom: -140,
        left: -100,

        width: 280,
        height: 280,

        borderRadius: 280,

        backgroundColor:
            "rgba(255,255,255,0.03)",
    },

    header: {
        marginBottom: 32,
    },

    backButton: {
        width: 48,
        height: 48,

        borderRadius: 16,

        justifyContent: "center",
        alignItems: "center",

        backgroundColor:
            "rgba(255,255,255,0.08)",

        borderWidth: 1,
        borderColor:
            "rgba(255,255,255,0.08)",

        marginBottom: 26,
    },

    headerContent: {},

    headerBadge: {
        width: 60,
        height: 60,

        borderRadius: 20,

        justifyContent: "center",
        alignItems: "center",

        backgroundColor:
            "rgba(255,255,255,0.08)",

        borderWidth: 1,
        borderColor:
            "rgba(255,255,255,0.08)",

        marginBottom: 24,
    },

    title: {
        fontSize: 44,
        lineHeight: 48,

        fontWeight: "800",

        letterSpacing: -2,

        color: COLORS.white,
    },

    titleLight: {
        fontWeight: "300",
    },

    subtitle: {
        marginTop: 18,

        fontSize: 15,
        lineHeight: 24,

        color: COLORS.muted,

        maxWidth: "92%",
    },

    card: {
        backgroundColor: COLORS.card,

        borderRadius: 30,

        padding: 24,

        borderWidth: 1,
        borderColor:
            COLORS.cardBorder,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 20,
        },
        shadowOpacity: 0.25,
        shadowRadius: 30,

        elevation: 16,

        overflow: "hidden",
    },

    infoBox: {
        flexDirection: "row",

        alignItems: "center",

        backgroundColor:
            COLORS.infoBackground,

        borderWidth: 1,
        borderColor:
            COLORS.infoBorder,

        borderRadius: 18,

        padding: 16,

        marginBottom: 24,
    },

    infoIcon: {
        width: 38,
        height: 38,

        borderRadius: 19,

        justifyContent: "center",
        alignItems: "center",

        backgroundColor:
            "rgba(255,255,255,0.08)",

        marginRight: 14,
    },

    infoText: {
        flex: 1,

        color: COLORS.white,

        fontSize: 13,
        lineHeight: 20,

        opacity: 0.88,
    },

    errorContainer: {
        flexDirection: "row",
        alignItems: "center",

        backgroundColor:
            "rgba(239,68,68,0.12)",

        borderWidth: 1,
        borderColor:
            "rgba(239,68,68,0.22)",

        borderRadius: 16,

        padding: 14,

        marginBottom: 20,
    },

    errorText: {
        flex: 1,

        marginLeft: 10,

        color: "#FCA5A5",

        fontSize: 13,
        fontWeight: "600",

        lineHeight: 18,
    },

    fieldWrapper: {
        marginBottom: 24,
    },

    fieldLabel: {
        marginBottom: 10,
        marginLeft: 4,

        color: COLORS.white,

        fontSize: 12,
        fontWeight: "700",

        textTransform: "uppercase",

        letterSpacing: 1,
    },

    inputContainer: {
        flexDirection: "row",
        alignItems: "center",

        height: 60,

        borderRadius: 18,

        paddingHorizontal: 16,

        backgroundColor:
            COLORS.input,

        borderWidth: 1,
        borderColor:
            COLORS.inputBorder,
    },

    inputIcon: {
        marginRight: 12,
    },

    input: {
        flex: 1,

        color: COLORS.white,

        fontSize: 15,
        fontWeight: "500",
    },

    button: {
        height: 60,

        borderRadius: 999,

        justifyContent: "center",
        alignItems: "center",

        backgroundColor:
            COLORS.primary,
    },

    buttonPressed: {
        opacity: 0.92,

        transform: [
            {
                scale: 0.995,
            },
        ],
    },

    buttonDisabled: {
        opacity: 0.45,
    },

    buttonContent: {
        flexDirection: "row",
        alignItems: "center",

        gap: 10,
    },

    buttonText: {
        color: COLORS.textDark,

        fontSize: 16,
        fontWeight: "800",

        letterSpacing: 0.2,
    },

    buttonIcon: {
        width: 24,
        height: 24,

        borderRadius: 12,

        justifyContent: "center",
        alignItems: "center",

        backgroundColor:
            COLORS.textDark,
    },

    successWrapper: {
        alignItems: "center",

        paddingVertical: 18,
    },

    successIconContainer: {
        marginBottom: 22,
    },

    successTitle: {
        color: COLORS.white,

        fontSize: 24,
        fontWeight: "800",

        letterSpacing: -0.5,
    },

    successSubtitle: {
        marginTop: 14,

        color: COLORS.muted,

        fontSize: 15,
        lineHeight: 24,

        textAlign: "center",
    },

    highlightText: {
        color: COLORS.white,
        fontWeight: "700",
    },

    secondaryButton: {
        marginTop: 28,

        paddingHorizontal: 18,
        paddingVertical: 12,

        borderRadius: 999,

        backgroundColor:
            "rgba(255,255,255,0.08)",

        borderWidth: 1,
        borderColor:
            "rgba(255,255,255,0.08)",
    },

    secondaryButtonText: {
        color: COLORS.white,

        fontSize: 14,
        fontWeight: "700",
    },

    footer: {
        marginTop: 28,

        alignItems: "center",
    },

    footerText: {
        color: COLORS.muted,

        fontSize: 14,
        fontWeight: "500",
    },

    footerLink: {
        marginTop: 6,

        color: COLORS.white,

        fontSize: 14,
        fontWeight: "800",
    },
});