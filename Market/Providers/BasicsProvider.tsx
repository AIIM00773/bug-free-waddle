


import { APIRoutes } from "@/utils/api";

import * as SecureStore from 'expo-secure-store';
import React, { createContext, useContext, useState } from "react";
const BasicsContext = createContext<any | undefined>(undefined);






export function BasicsProvider({ children }: { children: React.ReactNode }) {
    const [welcomeNote, setWelcomeNote] = useState<any | null>(null);
    const [appTheme, setappTheme] = useState<any | null>("default");
    const [appLanguage, setAppLanguage] = useState<any | null>("english");

    const fetchandSetuserWelcomePrompt = async () => {
        try {
            // 1. MUST await the token
            const token = await SecureStore.getItemAsync("access");

            // 2. Use the correct headers and check response.ok
            const response = await fetch(`${APIRoutes.BASE_URL}`, { 
                method: "GET",
                headers: {
                    "Content-Type": "application/json", 
                    "Authorization": `Bearer ${token}`,
                    "ngrok-skip-browser-warning": "true" 
                }
            });

            if (response.ok) {
                const data = await response.json();
                setWelcomeNote(data.note);
            } else {
                setWelcomeNote("Hey, What Would you Like to Find?");
                console.log("Response not OK:", response.status);
            }
        } catch (error) {
            console.error("Fetch failed:", error);
            setWelcomeNote("Hey, What Would you Like to Find?");
        }
    };

    return (
        <BasicsContext.Provider value={{ welcomeNote, appTheme, appLanguage, fetchandSetuserWelcomePrompt }}>
            {children}
        </BasicsContext.Provider>
    );
}




export const UseBasics = () => {
    const context = useContext(BasicsContext);
    if (!context) throw new Error("UseBasics must be used within BasicsProvider");
    return context;

}