import React, { useMemo, useState } from "react";

import {
    Alert,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

import { SafeAreaView } from "react-native-safe-area-context";

import {
    ArrowRight,
    Eye,
    EyeOff,
    Lock,
    Phone,
} from "lucide-react-native";

export default function LoginScreen() {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    phone: "",
    password: "",
  });

  const updateField = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const canProceedStep1 = useMemo(() => {
    return form.phone.trim().length >= 8;
  }, [form.phone]);

  const canSubmit = useMemo(() => {
    return form.password.trim().length > 0;
  }, [form.password]);

  const nextStep = () => {
    Keyboard.dismiss();

    if (step === 1 && !canProceedStep1) {
      return Alert.alert(
        "Invalid Input",
        "Enter a valid phone number"
      );
    }

    setStep(2);
  };

  const prevStep = () => setStep(1);

  const handleLogin = async () => {
    if (!canSubmit || isSubmitting) return;

    Keyboard.dismiss();

    try {
      setIsSubmitting(true);

      await new Promise((r) => setTimeout(r, 1000));

      router.replace("/Common/home");
    } catch {
      Alert.alert("Login failed", "Try again");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <StatusBar barStyle="light-content" />

      <Pressable
        style={styles.container}
        onPress={Keyboard.dismiss}
      >
        <LinearGradient
          colors={["#050816", "#05080e", "#111827"]}
          style={styles.gradient}
        >
          <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
              behavior={
                Platform.OS === "ios"
                  ? "padding"
                  : undefined
              }
              style={{ flex: 1 }}
            >
              <ScrollView
                contentContainerStyle={
                  styles.scrollContent
                }
                keyboardShouldPersistTaps="handled"
              >
                {/* HEADER */}
                <View style={styles.header}>
                  <Text style={styles.title}>
                    Welcome Back
                  </Text>

                  {/* STEP INDICATOR */}
                  <View style={styles.steps}>
                    <View
                      style={[
                        styles.dot,
                        step >= 1 && styles.dotActive,
                      ]}
                    />
                    <View
                      style={[
                        styles.dot,
                        step >= 2 && styles.dotActive,
                      ]}
                    />
                  </View>
                </View>

                {/* STEP 1: PHONE */}
                {step === 1 && (
                  <View style={styles.form}>
                    <Text style={styles.label}>
                      Phone number
                    </Text>

                    <View style={styles.inputWrapper}>
                      <Phone
                        size={18}
                        color="#6B7280"
                      />
                      <TextInput
                        value={form.phone}
                        onChangeText={(t) =>
                          updateField("phone", t)
                        }
                        placeholder="+254700000000"
                        placeholderTextColor="#6B7280"
                        keyboardType="phone-pad"
                        style={styles.input}
                      />
                    </View>
                  </View>
                )}

                {/* STEP 2: PASSWORD */}
                {step === 2 && (
                  <View style={styles.form}>
                    <Text style={styles.label}>
                      Password
                    </Text>

                    <View style={styles.inputWrapper}>
                      <Lock
                        size={18}
                        color="#6B7280"
                      />

                      <TextInput
                        value={form.password}
                        onChangeText={(t) =>
                          updateField(
                            "password",
                            t
                          )
                        }
                        placeholder="Enter password"
                        placeholderTextColor="#6B7280"
                        secureTextEntry={!showPassword}
                        style={styles.input}
                      />

                      <TouchableOpacity
                        onPress={() =>
                          setShowPassword(
                            !showPassword
                          )
                        }
                      >
                        {showPassword ? (
                          <EyeOff
                            size={18}
                            color="#6B7280"
                          />
                        ) : (
                          <Eye
                            size={18}
                            color="#6B7280"
                          />
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>
                )}

                {/* ACTIONS */}
                <View style={styles.actions}>
                  {step === 2 && (
                    <TouchableOpacity
                      onPress={prevStep}
                      style={styles.secondaryBtn}
                    >
                      <Text style={styles.secondaryText}>
                        Back
                      </Text>
                    </TouchableOpacity>
                  )}

                  {step === 1 ? (
                    <TouchableOpacity
                      onPress={nextStep}
                      style={styles.primaryBtn}
                    >
                      <Text style={styles.primaryText}>
                        Next
                      </Text>
                      <ArrowRight
                        size={18}
                        color="#000"
                      />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={handleLogin}
                      disabled={!canSubmit}
                      style={[
                        styles.primaryBtn,
                        !canSubmit &&
                          { opacity: 0.5 },
                      ]}
                    >
                      <Text style={styles.primaryText}>
                        {isSubmitting
                          ? "Signing in..."
                          : "Login"}
                      </Text>
                      <ArrowRight
                        size={18}
                        color="#000"
                      />
                    </TouchableOpacity>
                  )}
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </LinearGradient>
      </Pressable>
    </>
  );
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#050505",
    },

    gradient: {
        flex: 1,
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
        paddingVertical: 32,
    },

    header: {
        marginBottom: 42,
    },

    badge: {
        alignSelf: "flex-start",

        paddingHorizontal: 14,
        paddingVertical: 8,

        borderRadius: 999,

        backgroundColor: "#111111",

        borderWidth: 1,
        borderColor: "#1B1B1B",

        marginBottom: 24,
    },

    badgeText: {
        color: "#FFFFFF",

        fontSize: 12,
        fontWeight: "600",

        letterSpacing: 0.3,
    },

    title: {
        color: "#FFFFFF",

        fontSize: 42,
        fontWeight: "800",

        letterSpacing: -2,
        lineHeight: 48,
    },

    subtitle: {
        marginTop: 16,

        color: "#71717A",

        fontSize: 15,
        lineHeight: 28,

        maxWidth: "92%",
    },

    formContainer: {
        gap: 22,
    },

    inputGroup: {
        gap: 10,
    },

    form:{
        padding:4,
        gap:8,
    },
    passwordHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    label: {
        color: "#E4E4E7",

        fontSize: 14,
        fontWeight: "600",
    },

    forgotText: {
        color: "#A1A1AA",

        fontSize: 13,
        fontWeight: "500",
    },

    inputWrapper: {
        height: 60,

        borderRadius: 22,

        flexDirection: "row",
        alignItems: "center",

        paddingHorizontal: 18,
        gap: 12,

        backgroundColor: "#0E0E0F",

        borderWidth: 1,
        borderColor: "#1A1A1A",
    },

    input: {
        flex: 1,

        color: "#FFFFFF",

        fontSize: 15,
        fontWeight: "500",
    },

    loginButton: {
        height: 60,

        borderRadius: 22,

        marginTop: 8,

        backgroundColor: "#111111",

        borderWidth: 1,
        borderColor: "#1A1A1A",

        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",

        gap: 10,
    },

    loginButtonActive: {
        backgroundColor: "#FFFFFF",
        borderColor: "#FFFFFF",
    },

    loginButtonText: {
        color: "#71717A",

        fontSize: 16,
        fontWeight: "700",
    },

    loginButtonTextActive: {
        color: "#050505",
    },

    footer: {
        marginTop: 4,

        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",

        gap: 6,
    },

    footerText: {
        color: "#71717A",
        fontSize: 14,
    },

    registerText: {
        color: "#FFFFFF",

        fontSize: 14,
        fontWeight: "700",
    },


steps: {
  flexDirection: "row",
  gap: 8,
  marginTop: 18,
},

dot: {
  width: 8,
  height: 8,
  borderRadius: 99,
  backgroundColor: "#2A2A2A",
},

dotActive: {
  backgroundColor: "#FFFFFF",
},

actions: {
  flexDirection: "row",
  justifyContent: "space-between",
  marginTop: 28,
  gap: 12,
},

primaryBtn: {
  flex: 1,
  height: 54,
  backgroundColor: "#FFFFFF",
  borderRadius: 16,
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  gap: 10,
},

primaryText: {
  color: "#000",
  fontWeight: "700",
},

secondaryBtn: {
  height: 54,
  paddingHorizontal: 18,
  borderRadius: 16,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#1A1A1A",
},

secondaryText: {
  color: "#FFFFFF",
  fontWeight: "600",
},

});