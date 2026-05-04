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

    successGlow: "rgba(16,185,129,0.08)",

    errorBg: "rgba(239,68,68,0.12)",
    errorBorder: "rgba(239,68,68,0.22)",
    errorText: "#FCA5A5",
};

const ROUTES = {
    home: "/",
    signin: "/AppForms/Signin",
} as const;

/* -------------------------------------------------------------------------- */
/*                               SIGNUP SCREEN                                */
/* -------------------------------------------------------------------------- */

export default function SignupScreen() {
    /* ---------------------------------------------------------------------- */
    /*                                  AUTH                                  */
    /* ---------------------------------------------------------------------- */

    const {
        signup,
        signupError,
        user,
        isAuthenticated,
    } = useAuth();

    /* ---------------------------------------------------------------------- */
    /*                                 STATES                                 */
    /* ---------------------------------------------------------------------- */

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] =
        useState(false);

    const [isSubmitting, setIsSubmitting] =
        useState(false);

    const [validationError, setValidationError] =
        useState("");

    /* ---------------------------------------------------------------------- */
    /*                               ANIMATIONS                               */
    /* ---------------------------------------------------------------------- */

    const fadeAnimation = useRef(
        new Animated.Value(0)
    ).current;

    const translateAnimation = useRef(
        new Animated.Value(26)
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

    useEffect(() => {
        if (user && isAuthenticated) {
            router.replace(ROUTES.home);
        }
    }, [user, isAuthenticated]);

    /* ---------------------------------------------------------------------- */
    /*                              DERIVED STATE                             */
    /* ---------------------------------------------------------------------- */

    const isFormValid = useMemo(() => {
        return (
            form.name.trim().length > 2 &&
            form.email.trim().length > 0 &&
            form.password.length >= 6
        );
    }, [form]);

    /* ---------------------------------------------------------------------- */
    /*                                HANDLERS                                */
    /* ---------------------------------------------------------------------- */

    const updateField = useCallback(
        (
            field: "name" | "email" | "password",
            value: string
        ) => {
            setValidationError("");

            setForm((prev) => ({
                ...prev,
                [field]: value,
            }));
        },
        []
    );

    const validateForm = useCallback(() => {
        const trimmedName = form.name.trim();
        const trimmedEmail = form.email.trim();

        const nameParts = trimmedName.split(/\s+/);

        if (nameParts.length < 2) {
            setValidationError(
                "Please enter your first and last name."
            );

            return false;
        }

        const emailRegex =
            /^\S+@\S+\.\S+$/;

        if (!emailRegex.test(trimmedEmail)) {
            setValidationError(
                "Please enter a valid email address."
            );

            return false;
        }

        if (form.password.length < 6) {
            setValidationError(
                "Password must contain at least 6 characters."
            );

            return false;
        }

        return true;
    }, [form]);

    const handleSignup = useCallback(async () => {
        if (isSubmitting) return;

        const isValid = validateForm();

        if (!isValid) return;

        setIsSubmitting(true);

        try {
            const nameParts =
                form.name.trim().split(/\s+/);

            const firstName = nameParts[0];
            const lastName =
                nameParts.slice(1).join(" ");

            await signup(
                form.email.trim().toLowerCase(),
                form.password,
                firstName,
                lastName
            );
        } catch (error) {
            console.error(
                "[SIGNUP_ERROR]:",
                error
            );
        } finally {
            setIsSubmitting(false);
        }
    }, [
        form,
        isSubmitting,
        signup,
        validateForm,
    ]);

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
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={
                            styles.scrollContent
                        }
                    >
                        {/* HEADER */}
                        <Animated.View
                            style={[
                                styles.header,
                                {
                                    paddingHorizontal:10, 
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


                            <Text style={styles.titleLight}>
                                SignUp.

                            </Text>

                            <Text style={{color:"dodgerblue", marginVertical:4,}}>Create New Account ...</Text>


                        </Animated.View>

<KeyboardAvoidingView 


>

                        {/* FORM CARD */}
                        <Animated.View
                            style={[
                                styles.card,
                                {
                                    borderRadius:5,
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
                            {/* ERRORS */}
                            {!!(
                                validationError ||
                                signupError
                            ) && (
                                    <View
                                        style={
                                            styles.errorContainer
                                        }
                                    >
                                        <Feather
                                            name="alert-circle"
                                            size={16}
                                            color="#FCA5A5"
                                        />

                                        <Text
                                            style={
                                                styles.errorText
                                            }
                                        >
                                            {validationError ||
                                                signupError}
                                        </Text>
                                    </View>
                                )}

                            {/* FULL NAME */}
                            <InputField
                                label="Full Name"
                                icon="user"
                                placeholder="John Doe"
                                value={form.name}
                                autoCapitalize="words"
                                onChangeText={(
                                    value: string
                                ) =>
                                    updateField(
                                        "name",
                                        value
                                    )
                                }
                            />

                            {/* EMAIL */}
                            <InputField
                                label="Email Address"
                                icon="mail"
                                placeholder="hello@example.com"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                                value={form.email}
                                onChangeText={(
                                    value: string
                                ) =>
                                    updateField(
                                        "email",
                                        value
                                    )
                                }
                            />

                            {/* PASSWORD */}
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
                                    Password
                                </Text>

                                <View
                                    style={
                                        styles.inputContainer
                                    }
                                >
                                    <Feather
                                        name="lock"
                                        size={18}
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
                                        placeholder="Minimum 6 characters"
                                        placeholderTextColor={
                                            COLORS.placeholder
                                        }
                                        secureTextEntry={
                                            !showPassword
                                        }
                                        autoCapitalize="none"
                                        autoCorrect={
                                            false
                                        }
                                        value={
                                            form.password
                                        }
                                        onChangeText={(
                                            value
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
                                                (
                                                    prev
                                                ) =>
                                                    !prev
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
                                            color={
                                                COLORS.muted
                                            }
                                        />
                                    </Pressable>
                                </View>
                            </View>

                            {/* CTA BUTTON */}
                            <Pressable
                                disabled={
                                    !isFormValid ||
                                    isSubmitting
                                }
                                onPress={
                                    handleSignup
                                }
                                style={({
                                    pressed,
                                }) => [
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
                                        size="small"
                                        color={
                                            COLORS.textDark
                                        }
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
                                            Create
                                            Account
                                        </Text>

                                        <View
                                            style={
                                                styles.buttonIcon
                                            }
                                        >
                                            <Feather
                                                name="arrow-right"
                                                size={
                                                    16
                                                }
                                                color={
                                                    COLORS.white
                                                }
                                            />
                                        </View>
                                    </View>
                                )}
                            </Pressable>
                        </Animated.View>
</KeyboardAvoidingView>


                        {/* FOOTER */}
                        <Animated.View
                            style={[
                                styles.footer,
                                {
                                    opacity:
                                        fadeAnimation,
                                },
                            ]}
                        >
                            <Text
                                style={
                                    styles.footerText
                                }
                            >
                                Already have an
                                account?
                            </Text>

                            <Pressable
                                onPress={() =>
                                    router.push(
                                        ROUTES.signin
                                    )
                                }
                            >
                                <Text
                                    style={
                                        styles.footerLink
                                    }
                                >
                                    Sign In
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

    value: string;
    placeholder: string;

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

                <View
                    style={
                        styles.inputContainer
                    }
                >
                    <Feather
                        name={icon}
                        size={18}
                        color={COLORS.muted}
                        style={
                            styles.inputIcon
                        }
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



    header: {
        marginBottom: 34,
    },




    titleLight: {
        fontSize:40, color:"aliceblue",

        fontWeight: "600",
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

    errorContainer: {
        flexDirection: "row",
        alignItems: "center",

        backgroundColor:
            COLORS.errorBg,

        borderWidth: 1,
        borderColor:
            COLORS.errorBorder,

        borderRadius: 16,

        padding: 14,

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

        height: 58,

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
        marginTop: 10,

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