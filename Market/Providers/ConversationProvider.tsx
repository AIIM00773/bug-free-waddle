import { ConversationContextType, User_And_Agent_Conversation_Session, UserSearchQuery } from "@/Interfaces";
import { APIRoutes } from "@/utils/api";
import * as SecureStore from 'expo-secure-store';
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Alert } from "react-native";
import { useAuth } from "./AuthProvider";
import { usePrompt } from "./MainProptsProvider";

const ConversationContext = createContext<ConversationContextType | undefined>(undefined);



export const ConversationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

    const { clearPrompt } = usePrompt();
    const [conversations, setConversations] = useState<User_And_Agent_Conversation_Session[]>([]);
    const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
    const [isSearching, setIsSearching] = useState(false);

    const currentConversation = useMemo(() =>
        conversations.find(conv => conv.conversationId === currentConversationId) ?? null,
        [conversations, currentConversationId]);

    const getAuthHeaders = async () => ({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${await SecureStore.getItemAsync('access')}`
    });



    // --- INITIALIZE / FETCH ALL ---
    const ConverationsInit = useCallback(async () => {
        try {
            const response = await fetch(`${APIRoutes.BASE_URL}/accounts/conversations/`, {
                method: "GET",
                headers: await getAuthHeaders()
            });

            if (response.ok) {
                const data = await response.json();
                setConversations(data);
            }
        } catch (e) {
            console.error("Connection failed", e);
        }
    }, []);




    const { isAuthenticated } = useAuth();
    useEffect(() => {
        if (!isAuthenticated) return
        ConverationsInit();

    }, [isAuthenticated])





    // --- NEW SEARCH (SINGLE TRIP) ---
    const performNewSearch = useCallback(async (activePrompt: UserSearchQuery) => {
        if (isSearching) return;
        setIsSearching(true);

        try {
            const response = await fetch(`${APIRoutes.BASE_URL}/accounts/conversations/new/`, {
                method: "POST",
                headers: await getAuthHeaders(),
                body: JSON.stringify(activePrompt)
            });

            const serverData = await response.json();

            if (response.ok) {
                // serverData is the full conversation object from Django
                const newFullConversation: User_And_Agent_Conversation_Session = serverData;

                setConversations(prev => [newFullConversation, ...prev]);
                setCurrentConversationId(newFullConversation.conversationId);

                console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")

                console.log(serverData.conversationHistory[0].agent_response)

                console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
            } else {
                throw new Error("Search failed.");
            }
        } catch (e) {
            console.error("Error performing New Search:", e);
            Alert.alert("Search Error", "Could not reach the neural engine.");
        } finally {
            setIsSearching(false);
            clearPrompt();
        }
    }, [isSearching, clearPrompt]);







    // --- FOLLOW-UP SEARCH ---

    const performFollowupSearch = useCallback(async (activePrompt: UserSearchQuery, conversationID: string) => {
        if (isSearching) return;
        setIsSearching(true);

        // Get the ID of the last message in history to tell Django to close its stream
        const lastMessageId = currentConversation?.conversationHistory?.slice(-1)[0]?.id;

        try {
            console.log(currentConversation?.conversationHistory[currentConversation?.conversationHistory?.length - 1]);

            const response = await fetch(`${APIRoutes.ROOT}conversations/refine/`, {
                method: "POST",
                headers: await getAuthHeaders(),
                body: JSON.stringify({
                    text: activePrompt.text,
                    filters: activePrompt.filters,
                    conversationId: conversationID,
                })
            });

            const newMessage = await response.json();

            if (response.ok) {
                setConversations(prev => prev.map(conv => {
                    if (conv.conversationId !== conversationID) return conv;
                    return {
                        ...conv,
                        conversationHistory: [...(conv.conversationHistory || []), newMessage],
                        last_update: new Date().toISOString()
                    };
                }));
            }
        } catch (e) {
            Alert.alert("Link error", "Could not reach the agent.");
        } finally {
            setIsSearching(false);
            clearPrompt();
        }
    }, [isSearching, currentConversation, clearPrompt]);










    // --- MARK AS STREAMED ---
    const markMessageAsStreamed = useCallback(async (convId: string, historyId: number) => {
        // Optimistic UI Update
        setConversations(prev => prev.map(conv => {
            if (conv.conversationId !== convId) return conv;

            const newHistory = conv.conversationHistory.map(msg =>
                msg.id === historyId ? { ...msg, has_been_streamed: true } : msg
            );

            return { ...conv, conversationHistory: newHistory };
        }));

        try {
            // Sync with backend
            await fetch(`${APIRoutes.BASE_URL}/accounts/conversations/update-stream/`, {
                method: "PATCH",
                headers: await getAuthHeaders(),
                body: JSON.stringify({ conversationId: convId, historyId: historyId })
            });
        } catch (e) {
            console.error("Stream Sync failed.");
        }
    }, []);

    // --- DELETE CONVERSATION ---
    const deleteConversation = useCallback(async (convId: string) => {
        const backup = [...conversations];
        setConversations(prev => prev.filter(c => c.conversationId !== convId));
        if (currentConversationId === convId) setCurrentConversationId(null);

        try {
            const response = await fetch(`${APIRoutes.BASE_URL}/accounts/conversations/`, {
                method: "DELETE",
                headers: await getAuthHeaders(),
                body: JSON.stringify({ conversationId: convId })
            });
            if (!response.ok) throw new Error();
        } catch (e) {
            setConversations(backup);
            Alert.alert("Error", "Delete failed.");
        }
    }, [conversations, currentConversationId]);

    const switchConversation = (id: string) => setCurrentConversationId(id);
    const closeConversation = () => setCurrentConversationId(null);

    return (
        <ConversationContext.Provider value={{
            switchConversation,
            closeConversation,
            conversations,
            currentConversation,
            performNewSearch,
            performFollowupSearch,
            deleteConversation,
            markMessageAsStreamed,
            ConverationsInit
        }}>
            {children}
        </ConversationContext.Provider>
    );
};

export const useConversation = () => {
    const context = useContext(ConversationContext);
    if (!context) throw new Error('useConversation must be used within ConversationProvider');
    return context;
};