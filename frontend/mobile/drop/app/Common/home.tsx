import React, { useState } from "react";
import { Keyboard } from "react-native";

import {
    Dimensions,
    KeyboardAvoidingView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

import { BlurView } from "expo-blur";
import { SafeAreaView } from "react-native-safe-area-context";

import { router } from "expo-router";
import {
    ArrowUp,
    Menu,
    UserPlus,
} from "lucide-react-native";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
    const [prompt, setPrompt] = useState("");
    const [userAuthenticated, setUserAuthenticated] = useState(false)
    const [activeConversation, setActiveConversation] = useState<any>(null);

    const canSend = prompt.trim().length > 0;


    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!prompt.trim() || isSubmitting) return;
        Keyboard.dismiss();


        try {
            setIsSubmitting(true);

            // API CALL / AI REQUEST
            console.log(prompt);

            // OPTIONAL:
            setPrompt("");

        } catch (error) {
            console.log(error);
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <>
            <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle="light-content"
            />

            <SafeAreaView style={styles.container}>
                {/* HEADER */}
                <View style={styles.topBar}>
                    <TouchableOpacity
                        activeOpacity={0.85}
                        style={styles.iconButton}
                    >
                        <Menu size={20} color="#FFFFFF" />
                    </TouchableOpacity>

                    <Text style={styles.logoText}>
                        AI Marketplace
                    </Text>

                    <TouchableOpacity
                        activeOpacity={0.85}
                        style={styles.iconButton}
                        onPress={()=>{
                            if(userAuthenticated){
                                router.push("/Common/profile")
                            }else{
                                router.push("/Forms/login")

                            }
                        }}
                    >
                        <UserPlus size={19} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>

                {/* CONTENT */}
                {activeConversation ? (
                    <ScrollView
                        style={styles.chatContainer}
                        contentContainerStyle={styles.chatContent}
                        showsVerticalScrollIndicator={false}
                    >
                        {/* CHAT AREA */}
                    </ScrollView>
                ) : (
                    <View style={styles.emptyState}>
                        <View style={styles.heroWrapper}>
                            <Text style={styles.heroTitle}>
                                Discover Products{"\n"}
                                Intelligently
                            </Text>

                            <Text style={styles.heroDescription}>
                                Search naturally using AI-powered conversations.
                            </Text>
                        </View>
                    </View>
                )}
                {/* INPUT */}
                <KeyboardAvoidingView
                    behavior="padding"
                    keyboardVerticalOffset={10}
                    style={styles.bottomArea}
                >
                    <BlurView
                        intensity={45}
                        tint="dark"
                        style={[
                            styles.inputContainer,
                            isSubmitting && styles.inputContainerDisabled,
                        ]}
                    >
                        <TextInput
                            value={prompt}
                            onChangeText={setPrompt}
                            placeholder="Ask anything..."
                            placeholderTextColor="#6B7280"
                            multiline
                            editable={!isSubmitting}
                            cursorColor="#FFFFFF"
                            style={styles.input}
                        />

                        <TouchableOpacity
                            activeOpacity={0.85}
                            disabled={!canSend || isSubmitting}
                            onPress={handleSubmit}
                            style={[
                                styles.sendButton,
                                canSend && styles.sendButtonActive,
                                isSubmitting && styles.sendButtonDisabled,
                            ]}
                        >
                            <ArrowUp
                                size={18}
                                color={
                                    isSubmitting
                                        ? "#71717A"
                                        : canSend
                                            ? "#000000"
                                            : "#A1A1AA"
                                }
                            />
                        </TouchableOpacity>
                    </BlurView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#111827",
        paddingHorizontal: 20,
    },

    // colors={["#050816", "#05080e", "#111827"]}

    /* HEADER */

    topBar: {
        marginTop: 6,

        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    logoText: {
        color: "#FFFFFF",

        fontSize: 15,
        fontWeight: "600",

        letterSpacing: -0.3,
    },

    iconButton: {
        width: 46,
        height: 46,

        borderRadius: 999,

        justifyContent: "center",
        alignItems: "center",

        backgroundColor: "#050816",

        borderWidth: 1,
        borderColor: "#1B1B1B",
    },

    /* EMPTY STATE */

    emptyState: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    heroWrapper: {
        alignItems: "center",
        width: "100%",
    },

    heroTitle: {
        color: "#d2cece",

        fontSize: width > 400 ? 38 : 32,
        fontWeight: "800",

        letterSpacing: -0.4,
        lineHeight: width > 400 ? 50 : 48,
        textAlign: "center",
    },


    heroDescription: {
        marginTop: 18,

        color: "#71717A",

        fontSize: 15,
        lineHeight: 26,

        textAlign: "center",

        maxWidth: "82%",
    },

    /* INPUT */

    bottomArea: {
        paddingBottom: 18,
        paddingTop: 10,
    },

    inputContainer: {
        minHeight: 64,
        maxHeight: 160,

        borderRadius: 28,

        flexDirection: "row",
        alignItems: "flex-end",

        paddingLeft: 18,
        paddingRight: 10,
        paddingVertical: 10,

        overflow: "hidden",

        backgroundColor: "rgba(18,18,18,0.78)",

        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.05)",
    },

    input: {
        flex: 1,

        color: "#FFFFFF",

        fontSize: 16,
        lineHeight: 24,

        paddingTop: 10,
        paddingRight: 12,

        maxHeight: 120,
    },

    sendButton: {
        width: 42,
        height: 42,

        borderRadius: 999,

        justifyContent: "center",
        alignItems: "center",

        backgroundColor: "#151515",
    },

    sendButtonActive: {
        backgroundColor: "#FFFFFF",
    },

    inputContainerDisabled: {
        opacity: 0.7,
    },

    sendButtonDisabled: {
        backgroundColor: "#151515",
    },

    /* CHAT */

    chatContainer: {
        flex: 1,
    },

    chatContent: {
        paddingTop: 20,
        paddingBottom: 120,
    },
});