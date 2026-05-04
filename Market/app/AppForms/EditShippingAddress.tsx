import React, { useState, useEffect } from "react";
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    Modal,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Switch,
} from "react-native";

import { X, Check } from "lucide-react-native";
import { useAuth } from "@/Providers/AuthProvider";

export default function EditShippingAddress({visible, onClose, onSave, }: any) {

    const { user } = useAuth();
    const [address, setAddress] = useState<any|null>(null);

    useEffect(() => {

        if(user){
            setAddress(user);
        }else {
            return
        }

    }, [user]);


    // Initialize state with existing address values
    const [street, setStreet] = useState(address?.street || "");
    const [city, setCity] = useState(address?.city || "");
    const [state, setState] = useState(address?.state || "");
    const [postalCode, setPostalCode] = useState(address?.postalCode || "");
    const [country, setCountry] = useState(address?.country || "");
    const [phone, setPhone] = useState(address?.phone || "");
    const [defaultAddress, setDefaultAddress] = useState(address?.defaultAddress || false);
    const [description, setDescription] = useState(address?.description || "");

    const [isValid, setIsValid] = useState(false);

    // Validate required fields
    useEffect(() => {
        setIsValid(street && city && state && postalCode && country && phone);
    }, [street, city, state, postalCode, country, phone]);

    const handleSave = () => {
        if (!isValid) return;
        const updatedAddress = {
            street,
            city,
            state,
            postalCode,
            country,
            phone,
            defaultAddress,
            description,
        };
        onSave && onSave(updatedAddress);
        onClose();
    };

    return (
        <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
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
                        <Text style={styles.modalTitle}>EDIT SHIPPING ADDRESS</Text>
                        <TouchableOpacity
                            onPress={handleSave}
                            style={[styles.saveIconBtn, !isValid && { opacity: 0.5 }]}
                            disabled={!isValid}
                        >
                            <Check size={24} color={isValid ? "#22C55E" : "#A5F3FC"} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollBody}
                    >
                        <View style={styles.form}>
                            {/* PHONE */}
                            <InputLabel label="Your Phone Number" />
                            <TextInput
                                style={styles.input}
                                value={phone}
                                onChangeText={setPhone}
                                placeholder="+254 7 --------- "
                                keyboardType="phone-pad"
                            />

                            {/* FULL NAME */}
                            <InputLabel label="Full Name" />
                            <View style={styles.nameContainer}>
                                <TextInput
                                    style={[styles.input, styles.readOnlyInput]}
                                    value={user.first_name}
                                    editable={false}
                                />
                                <TextInput
                                    style={[styles.input, styles.readOnlyInput]}
                                    value={user.last_name}
                                    editable={false}
                                />
                            </View>

                            {/* ADDRESS FIELDS */}
                            <InputLabel label="Street Address" />
                            <TextInput
                                style={styles.input}
                                value={street}
                                onChangeText={setStreet}
                                placeholder="123 Main St"
                            />

                            <InputLabel label="City" />
                            <TextInput
                                style={styles.input}
                                value={city}
                                onChangeText={setCity}
                                placeholder="New York"
                                autoCapitalize="words"
                            />

                            <InputLabel label="State / Province" />
                            <TextInput
                                style={styles.input}
                                value={state}
                                onChangeText={setState}
                                placeholder="NY"
                                autoCapitalize="words"
                            />

                            <InputLabel label="Postal Code" />
                            <TextInput
                                style={styles.input}
                                value={postalCode}
                                onChangeText={setPostalCode}
                                placeholder="10001"
                                keyboardType="numeric"
                            />

                            <InputLabel label="Country" />
                            <TextInput
                                style={styles.input}
                                value={country}
                                onChangeText={setCountry}
                                placeholder="United States"
                                autoCapitalize="words"
                            />

                            <InputLabel label="Location Description (Optional)" />
                            <TextInput
                                style={styles.input}
                                value={description}
                                onChangeText={setDescription}
                                placeholder="Add Description here"
                            />

                            {/* DEFAULT ADDRESS SWITCH */}
                            <View style={styles.switchContainer}>
                                <Text style={styles.switchLabel}>Set as Default Address</Text>
                                <Switch
                                    value={defaultAddress}
                                    onValueChange={setDefaultAddress}
                                    trackColor={{ false: "#E5E7EB", true: "#22C55E" }}
                                    thumbColor="#FFF"
                                />
                            </View>
                        </View>

                        {/* SAVE BUTTON */}
                        <TouchableOpacity
                            style={[styles.primaryButton, !isValid && { opacity: 0.5 }]}
                            onPress={handleSave}
                            disabled={!isValid}
                        >
                            <Text style={styles.primaryButtonText}>Save Changes</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
}

const InputLabel = ({ label }: any) => (
    <Text style={styles.label}>{label.toUpperCase()}</Text>
);

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "flex-end",
    },
    modalContent: {
        backgroundColor: "#FFF",
        height: "95%",
        marginHorizontal:8,
        marginBottom:18,
        borderRadius:10,
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
        fontSize: 16,
        fontWeight: "900",
        letterSpacing: 1,
        color: "#0D1B1E",
    },
    saveIconBtn: {
        padding: 5,
    },
    scrollBody: {
        padding: 25,
    },
    form: {
        marginBottom: 20,
    },
    label: {
        fontSize: 12,
        fontWeight: "700",
        color: "#6B7280",
        letterSpacing: 1,
        marginBottom: 8,
    },
    input: {
        backgroundColor: "#F9FAFB",
        borderRadius: 18,
        paddingHorizontal: 15,
        height: 55,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        fontSize: 16,
        fontWeight: "600",
        color: "#0D1B1E",
    },
    readOnlyInput: {
        backgroundColor: "#F3F4F6",
        color: "#9CA3AF",
    },
    nameContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginBottom: 20,
    },
    switchContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 10,
        marginBottom: 25,
    },
    switchLabel: {
        fontSize: 14,
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