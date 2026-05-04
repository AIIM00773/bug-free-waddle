import React, {
    memo,
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

import { Feather, Ionicons } from "@expo/vector-icons";

import { useAuth } from "@/Providers/AuthProvider";

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

    errorBg: "rgba(239,68,68,0.12)",
    errorBorder: "rgba(239,68,68,0.22)",
    errorText: "#FCA5A5",
};

const ROUTES = {
    home: "/",
    signup: "/AppForms/Signup",
    recover: "/AppForms/RecoverAccount",
} as const;

/* -------------------------------------------------------------------------- */
/*                               LOGIN SCREEN                                 */
/* -------------------------------------------------------------------------- */

export default function LoginScreen() {
    /* ---------------------------------------------------------------------- */
    /*                                  AUTH                                  */
    /* ---------------------------------------------------------------------- */

    const { login, loginError, user, isAuthenticated } = useAuth();

    /* ---------------------------------------------------------------------- */
    /*                                 STATES                                 */
    /* ---------------------------------------------------------------------- */

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    /* ---------------------------------------------------------------------- */
    /*                               ANIMATIONS                               */
    /* ---------------------------------------------------------------------- */

    const fadeAnimation = useRef(new Animated.Value(0)).current;
    const translateAnimation = useRef(new Animated.Value(24)).current;

    /* ---------------------------------------------------------------------- */
    /*                              DERIVED STATE                             */
    /* ---------------------------------------------------------------------- */

    const isFormValid = useMemo(() => {
        return (
            form.email.trim().length > 0 &&
            form.password.trim().length > 0
        );
    }, [form.email, form.password]);

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

    useEffect(() => {
        if (loginError) {
            setIsSubmitting(false);
        }

        if (user && isAuthenticated) {
            setIsSubmitting(false);

            router.replace(ROUTES.home);
        }
    }, [user, isAuthenticated, loginError]);

    /* ---------------------------------------------------------------------- */
    /*                                HANDLERS                                */
    /* ---------------------------------------------------------------------- */

    const updateField = useCallback(
        (field: "email" | "password", value: string) => {
            setForm((prev) => ({
                ...prev,
                [field]: value,
            }));
        },
        []
    );

    const handleLogin = useCallback(async () => {
        if (!isFormValid || isSubmitting) return;

        setIsSubmitting(true);

        try {
            await login(
                form.email.trim().toLowerCase(),
                form.password
            );
        } catch (error) {
            console.error("[LOGIN_ERROR]:", error);

            setIsSubmitting(false);
        }
    }, [form.email, form.password, isFormValid, isSubmitting, login]);

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
                    "#031706",
                    "#041F08",
                    "#021002",
                ]}
                locations={[0, 0.3, 0.7, 1]}
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
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                    >
                        {/* HEADER */}
                        <Animated.View
                            style={[
                                styles.header,
                                {
                                    opacity: fadeAnimation,
                                    transform: [
                                        {
                                            translateY:
                                                translateAnimation,
                                        },
                                    ],
                                },
                            ]}
                        >
                           

                            <Text style={styles.title}>
                              Login
                            </Text>

                            <Text style={styles.subtitle}>
                                Sign in to continue with DropAI.
                            </Text>
                        </Animated.View>

                        {/* FORM CARD */}
                        <Animated.View
                            style={[
                                styles.card,
                                {
                                    opacity: fadeAnimation,
                                    transform: [
                                        {
                                            translateY:
                                                translateAnimation,
                                        },
                                    ],
                                },
                            ]}
                        >
                            {/* ERROR */}
                            {!!loginError && (
                                <View style={styles.errorContainer}>
                                    <Feather
                                        name="alert-circle"
                                        size={16}
                                        color="#FCA5A5"
                                    />

                                    <Text style={styles.errorText}>
                                        {loginError}
                                    </Text>
                                </View>
                            )}

                            {/* EMAIL */}
                            <InputField
                                label="Email Address"
                                icon="mail"
                                placeholder="your@email.com"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                                value={form.email}
                                onChangeText={(value: string) =>
                                    updateField("email", value)
                                }
                            />

                            {/* PASSWORD */}
                            <View style={styles.fieldWrapper}>
                                <Text style={styles.fieldLabel}>
                                    Password
                                </Text>

                                <View style={styles.inputContainer}>
                                    <Feather
                                        name="lock"
                                        size={18}
                                        color={COLORS.muted}
                                        style={styles.inputIcon}
                                    />

                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter password"
                                        placeholderTextColor={
                                            COLORS.placeholder
                                        }
                                        secureTextEntry={
                                            !showPassword
                                        }
                                        value={form.password}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        onChangeText={(
                                            value: string
                                        ) =>
                                            updateField(
                                                "password",
                                                value
                                            )
                                        }
                                    />

                                    <Pressable
                                        hitSlop={12}
                                        onPress={() =>
                                            setShowPassword(
                                                (prev) => !prev
                                            )
                                        }
                                    >
                                        <Ionicons
                                            name={
                                                showPassword
                                                    ? "eye-off-outline"
                                                    : "eye-outline"
                                            }
                                            size={20}
                                            color={COLORS.muted}
                                        />
                                    </Pressable>
                                </View>
                            </View>

                            {/* LOGIN BUTTON */}
                            <Pressable
                                disabled={
                                    !isFormValid || isSubmitting
                                }
                                onPress={handleLogin}
                                style={({ pressed }) => [
                                    styles.button,
                                    pressed &&
                                        styles.buttonPressed,

                                    (!isFormValid ||
                                        isSubmitting) &&
                                        styles.buttonDisabled,
                                ]}
                            >
                                {isSubmitting ? (
                                    <ActivityIndicator
                                        color={COLORS.textDark}
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
                                            Sign In
                                        </Text>

                                        <View
                                            style={
                                                styles.buttonIcon
                                            }
                                        >
                                            <Feather
                                                name="arrow-right"
                                                size={16}
                                                color={
                                                    COLORS.white
                                                }
                                            />
                                        </View>
                                    </View>
                                )}
                            </Pressable>

                            {/* RECOVER */}
                            <Pressable
                                style={styles.recoverButton}
                                onPress={() =>
                                    router.push(
                                        ROUTES.recover
                                    )
                                }
                            >
                                <Text style={styles.recoverText}>
                                    Forgot Password?
                                </Text>
                            </Pressable>
                        </Animated.View>

                        {/* FOOTER */}
                        <Animated.View
                            style={[
                                styles.footer,
                                {
                                    opacity: fadeAnimation,
                                },
                            ]}
                        >
                            <Text style={styles.footerText}>
                                New to DropAI?
                            </Text>

                            <Pressable
                                onPress={() =>
                                    router.push(
                                        ROUTES.signup
                                    )
                                }
                            >
                                <Text style={styles.footerLink}>
                                    Create Account
                                </Text>
                            </Pressable>
                        </Animated.View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
}

/* -------------------------------------------------------------------------- */
/*                              REUSABLE INPUT                                */
/* -------------------------------------------------------------------------- */

interface InputFieldProps {
    label: string;
    icon: keyof typeof Feather.glyphMap;
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;

    keyboardType?:
        | "default"
        | "email-address"
        | "numeric"
        | "phone-pad";

    autoCapitalize?:
        | "none"
        | "sentences"
        | "words"
        | "characters";

    autoCorrect?: boolean;
}

const InputField = memo(
    ({
        label,
        icon,
        ...props
    }: InputFieldProps) => {
        return (
            <View style={styles.fieldWrapper}>
                <Text style={styles.fieldLabel}>
                    {label}
                </Text>

                <View style={styles.inputContainer}>
                    <Feather
                        name={icon}
                        size={18}
                        color={COLORS.muted}
                        style={styles.inputIcon}
                    />

                    <TextInput
                        style={styles.input}
                        placeholderTextColor={
                            COLORS.placeholder
                        }
                        {...props}
                    />
                </View>
            </View>
        );
    }
);

InputField.displayName = "InputField";

/* -------------------------------------------------------------------------- */
/*                                   STYLES                                   */
/* -------------------------------------------------------------------------- */

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
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
        paddingVertical: 10,
    },


    header: {
        marginBottom: 40,
    },

    brandBadge: {
        width: 58,
        height: 58,
        borderRadius: 20,

        backgroundColor: "rgba(255,255,255,0.08)",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.08)",

        justifyContent: "center",
        alignItems: "center",

        marginBottom: 24,
    },

    title: {
        fontSize: 36,
        lineHeight: 38,
        fontWeight: "800",
        color: COLORS.white,
        letterSpacing: -2,
        textAlign:"left",
        paddingHorizontal:26,
    },


    subtitle: {
        marginTop: 18,
        fontSize: 15,
        lineHeight: 24,
        color: COLORS.muted,
        maxWidth: "90%",
        textAlign:"center",
        display:"none"

    },

    card: {
        backgroundColor: COLORS.card,
        borderRadius: 3,

        padding: 24,

        borderWidth: 1,
        borderColor: COLORS.cardBorder,

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

    errorContainer: {
        flexDirection: "row",
        alignItems: "center",

        backgroundColor: COLORS.errorBg,

        borderWidth: 1,
        borderColor: COLORS.errorBorder,

        padding: 14,
        borderRadius: 16,

        marginBottom: 22,
    },

    errorText: {
        flex: 1,
        marginLeft: 10,
        color: COLORS.errorText,
        fontSize: 13,
        fontWeight: "600",
        lineHeight: 18,
    },

    fieldWrapper: {
        marginBottom: 20,
    },

    fieldLabel: {
        color: COLORS.white,
        fontSize: 12,
        fontWeight: "700",

        marginBottom: 10,
        marginLeft: 4,

        textTransform: "uppercase",
        letterSpacing: 1,
    },

    inputContainer: {
        flexDirection: "row",
        alignItems: "center",

        height: 58,

        backgroundColor: COLORS.input,

        borderWidth: 1,
        borderColor: COLORS.inputBorder,

        borderRadius: 18,
        paddingHorizontal: 16,
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
        marginTop: 8,

        height: 60,
        borderRadius: 999,

        backgroundColor: COLORS.primary,

        justifyContent: "center",
        alignItems: "center",
    },

    buttonPressed: {
        opacity: 0.92,
        transform: [{ scale: 0.995 }],
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

        backgroundColor: COLORS.textDark,

        justifyContent: "center",
        alignItems: "center",
    },

    recoverButton: {
        alignSelf: "center",
        marginTop: 22,
    },

    recoverText: {
        color: COLORS.muted,
        fontSize: 14,
        fontWeight: "600",
    },

    footer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",

        marginTop: 28,
        gap: 6,
    },

    footerText: {
        color: COLORS.muted,
        fontSize: 14,
        fontWeight: "500",
    },

    footerLink: {
        color: COLORS.white,
        fontSize: 14,
        fontWeight: "800",
    },
});