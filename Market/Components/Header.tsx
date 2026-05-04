import React, { useState, useRef } from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Dimensions,
    Pressable,
    ScrollView,
    Animated,
    Easing,
    Platform
} from "react-native";
import {
    ShoppingBasket, Search,  Zap,
    User, PlusSquare, Tag, TrendingUp, ShieldCheck, LogOut, X, MenuIcon
} from "lucide-react-native";
import {  useRouter } from "expo-router";
import { DropLogo } from "@/assets/Logo";
import { useAuth } from "@/Providers/AuthProvider";

const { width } = Dimensions.get("window");

export default function AppHeader({ ShowExplore = true }) {
    const { user, logout } = useAuth();
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const dropdownAnim = useRef(new Animated.Value(0)).current; // 0 to 1

    const toggleMenu = () => {
        const toValue = open ? 0 : 1;
        if (!open) setOpen(true);

        Animated.timing(dropdownAnim, {
            toValue,
            duration: 300,
            easing: Easing.bezier(0.4, 0, 0.2, 1),
            useNativeDriver: true,
        }).start(() => {
            if (open) setOpen(false);
        });
    };

    const menuY = dropdownAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [-20, 0],
    });

    const menuOpacity = dropdownAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, 0, 1],
    });


    return (
        <View style={styles.outerContainer}>
            <View style={styles.headerContainer}>
                <View style={styles.topRow}>
                    <DropLogo />

                    {ShowExplore ? (
                        <>

                            <View style={styles.actionIcons}>


                                <TouchableOpacity style={{}} onPress={toggleMenu} activeOpacity={0.8}>
                                    <Animated.View >
                                        {open ? (
                                            <View style={{display:"flex", flexDirection:"column", alignItems:"center",}}>

                                            <X size={22} color="red" />
                                                <Text style={{fontSize:10, fontWeight:"black", color:"red"}}> {"menu"}</Text>
                                            </View>

                                        ):(
                                            <View style={{display:"flex", flexDirection:"column", alignItems:"center",}}>
                                                <MenuIcon size={22} color="darkgreen" />
                                                <Text style={{fontSize:10, fontWeight:"black", color:"darkgreen"}}> {"Menu"}</Text>

                                            </View>

                                        )}
                                    </Animated.View>
                                </TouchableOpacity>


                                <TouchableOpacity
                                    style={[styles.iconButton,{display:"flex", flexDirection:"column", alignItems:"center",}]}
                                    onPress={() => router.push("/GenerallAppScreens/SearchPage")}
                                >
                                    <Search size={22} color="darkgreen" strokeWidth={2} />
                                    <Text style={{fontSize:10, fontWeight:"black", color:"darkgreen"}}> {"Search"}</Text>

                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.iconButton,{display:"flex", flexDirection:"column", alignItems:"center",}]}
                                    onPress={() => router.push("/GenerallAppScreens/Cart")}
                                >
                                    <ShoppingBasket size={22} color="darkgreen" strokeWidth={2} />

                                        <View style={styles.badge}>
                                            <Text style={styles.badgeText}>{0}</Text>
                                        </View>

                                    <Text style={{fontSize:10, fontWeight:"black", color:"darkgreen"}}> {"Cart"}</Text>

                                </TouchableOpacity>
                            </View>
                        </>
                    ) : (
                        <View style={styles.profileIndicator}>
                            <Text style={styles.profileText}>Verified</Text>
                            <ShieldCheck color="#10B981" size={20} />
                        </View>
                    )}
                </View>
            </View>

            {/* ANIMATED DROPDOWN */}
            {open && (
                <View style={styles.absoluteWrapper}>
                    <Pressable style={styles.backdrop} onPress={toggleMenu} />
                    <Animated.View style={[
                        styles.dropdown,
                        { opacity: menuOpacity, transform: [{ translateY: menuY }] }
                    ]}>
                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
                            <Text style={styles.dropdownSectionTitle}>Marketplace</Text>
                            <DropdownItem label="New Arrivals" icon={<Zap size={18} color="#F59E0B"/>}
                                          onPress={undefined} />
                            <DropdownItem label="Best Sellers" icon={<TrendingUp size={18} color="#3B82F6"/>}
                                          onPress={undefined} />
                            <DropdownItem label="Sneakers" icon={<Tag size={18} color="#8B5CF6"/>} isBold
                                          onPress={undefined} />

                            <View style={styles.divider} />

                            <Text style={styles.dropdownSectionTitle}>Account</Text>
                            <DropdownItem
                                label="Start Selling"
                                icon={<PlusSquare size={18} color="#059669"/>}
                                color="#059669" onPress={undefined}                            />

                            <DropdownItem
                                label={user? (user.first_name) :"Profile"}
                                icon={<User size={18} color="#1A1A1A" />}
                                onPress={() => router.push("/GenerallAppScreens/Profile")}
                            />

                            {user ? (
                                <DropdownItem
                                    label="Logout"
                                    icon={<LogOut size={18} color="#EF4444" />}
                                    color="#EF4444"
                                    onPress={() => { logout(); toggleMenu(); }}
                                />
                            ) : (
                                <DropdownItem
                                    label="Sign In"
                                    icon={<User size={18} color="#3B82F6" />}
                                    color="#3B82F6"
                                    onPress={() => { router.push("/GenerallAppScreens/SignIn"); toggleMenu(); }}
                                />
                            )}
                        </ScrollView>
                    </Animated.View>
                </View>
            )}
        </View>
    );
}

const DropdownItem = ({ label, icon, color = "#1A1A1A", isBold = false, onPress }:any) => (
    <TouchableOpacity style={styles.item} onPress={onPress} activeOpacity={0.6}>
        <View style={styles.itemContent}>
            <View style={styles.iconCircle}>{icon}</View>
            <Text style={[styles.itemText, { color, fontWeight: isBold ? "700" : "500" }]}>
                {label}
            </Text>
        </View>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    outerContainer: {
        zIndex: 1000,
        backgroundColor: "#F8F9FA",
    },
    headerContainer: {
        backgroundColor: "#F8F9FA",
        paddingHorizontal: 20,
        paddingBottom: 12,
        paddingTop: Platform.OS === 'ios' ? 0 : 10,
        borderBottomWidth: 1,
        borderBottomColor: "#F2F2F7",
    },
    topRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        height: 50,
    },
    filterToggle: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#1A1A1A",
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 50,
        gap: 6,
    },
    filterToggleActive: {
        backgroundColor: "#059669",
    },
    filterText: {
        color: "#FFF",
        fontSize: 14,
        fontWeight: "600",
    },
    actionIcons: {
        flexDirection: "row",
        alignItems: "center",
        gap: 38,
    },
    iconButton: {
        position: "relative",
    },
    badge: {
        position: "absolute",
        top: -6,
        right: -8,
        backgroundColor: "#059669",
        borderRadius: 10,
        minWidth: 18,
        height: 18,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderColor: "#FFF",
    },
    badgeText: {
        color: "#FFF",
        fontSize: 9,
        fontWeight: "800",
    },
    profileIndicator: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        backgroundColor: "#ECFDF5",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    profileText: {
        fontSize: 14,
        fontWeight: "700",
        color: "#10B981",
    },
    absoluteWrapper: {
        position: "absolute",
        top: 62, // Aligns exactly under header
        left: 0,
        right: 0,
        bottom: -Dimensions.get('window').height,
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.3)",
    },
    dropdown: {
        width: width * 0.65,
        backgroundColor: "whitesmoke",
        borderBottomRightRadius: 24,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 5,
        height:"81.7%"
    },
    dropdownSectionTitle: {
        fontSize: 12,
        fontWeight: "800",
        color: "#9CA3AF",
        textTransform: "uppercase",
        letterSpacing: 1.2,
        marginBottom: 12,
        marginTop: 10,
    },
    item: {
        marginBottom: 8,
    },
    itemContent: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        padding: 10,
        backgroundColor: "#F9FAFB",
        borderRadius: 14,
    },
    iconCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "#FFF",
        justifyContent: "center",
        alignItems: "center",
    },
    itemText: {
        fontSize: 16,
    },
    divider: {
        height: 1,
        backgroundColor: "#F3F4F6",
        marginVertical: 15,
    },
});