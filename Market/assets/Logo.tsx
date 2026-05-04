import React from "react";
import { View, Text } from "react-native";

export const DropLogo =({ themeColor = "#111", showText=true }: { themeColor?: string, showText?:boolean }) => {
    return (
        <View
            style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 1,
            }}
        >
            {/* GLYPH */}
            <View
                style={{
                    width: 42,
                    height: 42,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                {/* Outer Shape (Modern "D") */}
                <View
                    style={{
                        width: 34,
                        height: 34,
                        borderRadius: 14,
                        borderWidth: 3,
                        borderColor: themeColor,
                        justifyContent: "center",
                        alignItems: "center",

                        // gives it a unique "D" personality
                        borderTopLeftRadius: 6,
                        borderBottomLeftRadius: 6,
                    }}
                >
                    {/* Inner Drop */}
                    <View
                        style={{
                            width: 16,
                            height: 16,
                            backgroundColor: "#00B377",
                            borderRadius: 999,
                            borderTopLeftRadius:3,

                            // better positioning = more intentional
                            // transform: [{ translateX: 4 }, { translateY: 4 }],
                        }}
                    />
                </View>

            </View>

            {/* TYPOGRAPHY */}
            {showText &&(
                <View style={{ justifyContent: "center" }}>
                    <Text style={{ fontSize: 14, fontWeight: "800", color: themeColor, letterSpacing: -0.5 }}></Text>
                </View>
            )}

        </View>
    );
};