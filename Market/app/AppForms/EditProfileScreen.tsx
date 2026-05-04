


import React, { useState } from "react";
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    Modal,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    ScrollView
} from "react-native";
import { Feather } from "@expo/vector-icons";
import {Camera, X, Check, User} from "lucide-react-native";
import {useAuth} from "@/Providers/AuthProvider";

export default function EditProfileModal({ visible, onClose, }:any) {

    const {user} = useAuth();

    const [firstName, setFirstName] = useState(user?.first_name || "");
    const [lastName, setLastName] = useState(user?.last_name || "");
    const [email, setEmail] = useState(user?.email || "");


    return (
        <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>

            <View style={styles.modalOverlay}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.modalContent}
                >
                    {/* --- HEADER --- */}
                    <View style={styles.modalHeader}>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <X size={24} color="#0D1B1E" />
                        </TouchableOpacity>
                        <Text style={styles.modalTitle}>EDIT PROFILE</Text>
                        <TouchableOpacity
                            onPress={() => onClose()}
                            style={styles.saveIconBtn}
                        >
                            <Check size={24} color="#22C55E" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>

                        {/* --- AVATAR PICKER --- */}
                        <View style={styles.avatarSection}>
                            <View style={styles.avatarWrapper}>
                                <User style={styles.avatar} size={30} />
                                <TouchableOpacity style={styles.cameraBadge}>
                                    <Camera size={16} color="#FFF" />
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.changePhotoText}>Change Profile Photo</Text>
                        </View>

                        {/* --- INPUT FIELDS --- */}
                        <View style={styles.form}>
                            <InputLabel label="First Name" />
                            <View style={styles.inputContainer}>
                                <Feather name="user" size={18} color="#999" />
                                <TextInput
                                    style={styles.input}
                                    value={firstName}
                                    onChangeText={setFirstName}
                                    placeholder="First Name"
                                />
                            </View>

                            <InputLabel label="Last Name" />
                            <View style={styles.inputContainer}>
                                <Feather name="user" size={18} color="#999" />
                                <TextInput
                                    style={styles.input}
                                    value={lastName}
                                    onChangeText={setLastName}
                                    placeholder="Last Name"
                                />
                            </View>

                            <InputLabel label="Email Address" />
                            <View style={[styles.inputContainer, styles.disabledInput]}>
                                <Feather name="mail" size={18} color="#CCC" />
                                <TextInput
                                    style={[styles.input, { color: '#999' }]}
                                    value={email}
                                    editable={false} // Email usually stays locked
                                    onChangeText={setEmail}
                                />
                                <Feather name="lock" size={14} color="#CCC" />
                            </View>
                        </View>

                        {/* --- SAVE BUTTON --- */}
                        <TouchableOpacity style={styles.primaryButton} onPress={() => onClose()}>
                            <Text style={styles.primaryButtonText}>SAVE CHANGES</Text>
                        </TouchableOpacity>

                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
}

const InputLabel = ({ label }:any) => (
    <Text style={styles.label}>{label.toUpperCase()}</Text>
);

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.2)",
        justifyContent: "flex-end",
        paddingVertical: 25,

    },
    modalContent: {
        backgroundColor: "#FFF",
        height: "96%",
        marginHorizontal: 10,
        borderRadius: 18,
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 25,
        borderBottomWidth: 1,
        borderBottomColor: "#F3F4F6",
    },
    closeButton: {
        padding: 5,
    },
    modalTitle: {
        fontSize: 14,
        fontWeight: "900",
        letterSpacing: 2,
        color: "#0D1B1E",
    },
    saveIconBtn: {
        padding: 5,
    },
    scrollBody: {
        padding: 25,
    },
    avatarSection: {
        alignItems: "center",
        marginBottom: 35,
    },
    avatarWrapper: {
        position: "relative",
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 40,
        backgroundColor: "#F3F4F6",
        borderWidth: 4,
        borderColor: "#4ADE80",
    },
    cameraBadge: {
        position: "absolute",
        bottom: 0,
        right: 0,
        backgroundColor: "#0D1B1E",
        width: 34,
        height: 34,
        borderRadius: 17,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 3,
        borderColor: "#FFF",
    },
    changePhotoText: {
        marginTop: 12,
        fontSize: 13,
        fontWeight: "700",
        color: "#22C55E",
    },
    form: {
        marginBottom: 20,
    },
    label: {
        fontSize: 11,
        fontWeight: "900",
        color: "#6B7280",
        letterSpacing: 1.5,
        marginBottom: 10,
        marginLeft: 5,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F9FAFB",
        borderRadius: 18,
        paddingHorizontal: 15,
        height: 60,
        marginBottom: 25,
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
    disabledInput: {
        backgroundColor: "#F3F4F6",
        borderColor: "#F3F4F6",
    },
    input: {
        flex: 1,
        marginLeft: 12,
        fontSize: 16,
        fontWeight: "600",
        color: "#0D1B1E",
    },
    primaryButton: {
        backgroundColor: "#0D1B1E",
        height: 65,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
    },
    primaryButtonText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "900",
        letterSpacing: 1,
    },
});