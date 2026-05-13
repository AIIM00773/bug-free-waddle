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
    Mail,
    Phone,
    User,
} from "lucide-react-native";

export default function RegisterScreen() {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
  });

  const updateField = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // STEP VALIDATION
  const canProceedStep1 = useMemo(() => {
    return (
      form.full_name.trim().length > 0 &&
      form.email.trim().length > 0
    );
  }, [form]);

  const canProceedStep2 = useMemo(() => {
    return form.phone.trim().length > 0;
  }, [form]);

  const canSubmit = useMemo(() => {
    return form.password.trim().length > 0;
  }, [form]);

  const nextStep = () => {
    Keyboard.dismiss();

    if (step === 1 && !canProceedStep1) {
      return Alert.alert(
        "Missing Info",
        "Enter name and email"
      );
    }

    if (step === 2 && !canProceedStep2) {
      return Alert.alert(
        "Missing Info",
        "Enter phone number"
      );
    }

    setStep((s) => s + 1);
  };

  const prevStep = () => {
    setStep((s) => Math.max(1, s - 1));
  };

  const handleRegister = async () => {
    if (!canSubmit || isSubmitting) return;

    Keyboard.dismiss();

    try {
      setIsSubmitting(true);

      await new Promise((r) => setTimeout(r, 1200));

      Alert.alert(
        "Success",
        "Account created successfully"
      );

      router.replace("/Forms/login");
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
          colors={["#050505", "#0A0A0A", "#0F0F0F"]}
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
                    Create Account
                  </Text>

                  {/* PROGRESS */}
                  <View style={styles.progress}>
                    {[1, 2, 3].map((i) => (
                      <View
                        key={i}
                        style={[
                          styles.dot,
                          step >= i &&
                            styles.dotActive,
                        ]}
                      />
                    ))}
                  </View>
                </View>

                {/* STEP 1 */}
                {step === 1 && (
                  <View style={styles.form}>
                    <Text style={styles.label}>
                      Full name
                    </Text>

                    <View style={styles.inputWrapper}>
                      <User
                        size={18}
                        color="#6B7280"
                      />
                      <TextInput
                        value={form.full_name}
                        onChangeText={(t) =>
                          updateField(
                            "full_name",
                            t
                          )
                        }
                        placeholder="John Doe"
                        placeholderTextColor="#6B7280"
                        style={styles.input}
                      />
                    </View>

                    <Text style={styles.label}>
                      Email
                    </Text>

                    <View style={styles.inputWrapper}>
                      <Mail
                        size={18}
                        color="#6B7280"
                      />
                      <TextInput
                        value={form.email}
                        onChangeText={(t) =>
                          updateField("email", t)
                        }
                        placeholder="you@email.com"
                        placeholderTextColor="#6B7280"
                        style={styles.input}
                        autoCapitalize="none"
                      />
                    </View>
                  </View>
                )}

                {/* STEP 2 */}
                {step === 2 && (
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
                        style={styles.input}
                        keyboardType="phone-pad"
                      />
                    </View>
                  </View>
                )}

                {/* STEP 3 */}
                {step === 3 && (
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
                        placeholder="Create password"
                        placeholderTextColor="#6B7280"
                        secureTextEntry={
                          !showPassword
                        }
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

                {/* BUTTONS */}
                <View style={styles.actions}>
                  {step > 1 && (
                    <TouchableOpacity
                      onPress={prevStep}
                      style={styles.secondaryBtn}
                    >
                      <Text
                        style={styles.secondaryText}
                      >
                        Back
                      </Text>
                    </TouchableOpacity>
                  )}

                  {step < 3 ? (
                    <TouchableOpacity
                      onPress={nextStep}
                      style={styles.primaryBtn}
                    >
                      <Text
                        style={styles.primaryText}
                      >
                        Next
                      </Text>
                      <ArrowRight
                        size={18}
                        color="#000"
                      />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={handleRegister}
                      style={styles.primaryBtn}
                    >
                      <Text
                        style={styles.primaryText}
                      >
                        Create Account
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
        marginBottom: 38,
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

        fontSize: 40,
        fontWeight: "800",

        letterSpacing: -2,
        lineHeight: 46,
    },

    subtitle: {
        marginTop: 16,

        color: "#71717A",

        fontSize: 15,
        lineHeight: 28,

        maxWidth: "94%",
    },

    formContainer: {
        gap: 20,
        backgroundColor:"#050816",
        padding:4,
    },

    form:{

        padding:4, gap:4, 
    },

    inputGroup: {
        gap: 10,
    },

    label: {
        color: "#E4E4E7",

        fontSize: 14,
        fontWeight: "600",
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

    registerButton: {
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

    registerButtonActive: {
        backgroundColor: "#FFFFFF",
        borderColor: "#FFFFFF",
    },

    registerButtonText: {
        color: "#71717A",

        fontSize: 16,
        fontWeight: "700",
    },

    registerButtonTextActive: {
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

    loginText: {
        color: "#FFFFFF",

        fontSize: 14,
        fontWeight: "700",
    },


progress: {
  flexDirection: "row",
  gap: 6,
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
  marginTop: 30,
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
  paddingHorizontal: 20,
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