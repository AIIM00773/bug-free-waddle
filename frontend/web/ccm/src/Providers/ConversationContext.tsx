import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Product } from '../Constants/productTypes';
import { EXTENSIVE_MOCK_DATABASE } from '../Constants/fakedb';

// ==========================================
// 1. TYPE DEFINITIONS & SCHEMAS
// ==========================================

export interface Message {
    id: string;
    sender: 'user' | 'assistant' | 'system' | 'sokoAI';
    text: string;
    products?: Product[];
    relatedProducts?: Product[]; // Added to explicitly handle your 4 related items cleanly
    timestamp: number;
    type?: 'success' | 'inquiry' | 'error' | 'followup';
}

export interface Conversation {
    id: string;
    uid?: string | null;
    pinned?: boolean;
    completed?: boolean;
    title: string;
    messages: Message[];
    createdAt: number;
    updatedAt: number;
    protected?: boolean;
}

export type ChatStatus = 'IDLE' | 'LOADING' | 'WORKING' | 'RETRYING' | 'ERROR';

interface ConversationState {
    conversations: Record<string, Conversation>;
    activeId: string | null;
    status: ChatStatus;
    error: string | null;
}

interface ConversationContextType extends ConversationState {
    currentMessages: Message[];
    sendMessage: (text: string) => Promise<void>;
    switchConversation: (id: string | null) => void;
    deleteConversation: (id: string) => void;
    startNewChatFrame: () => void;
    clearAllConversations: () => void;
}

// Helper: Safely grab random elements from an array source
const getRandomItems = (arr: Product[], count: number): Product[] => {
    if (!arr || arr.length === 0) return [];
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};

// Helper: Pool of realistic, dynamic AI conversational responses
const AI_RESPONSES = [
    "I've scanned the active marketplaces and found excellent options based on your request. Take a look at these current listings:",
    "Here are the top-rated matching items updated live from your product feed. I've also tagged a few related alternatives below:",
    "Found these listings matching your profile target parameters. Price points and seller data have been parsed successfully:",
    "Here is your real-time price matching breakdown. I found 6 stellar matches and some great related context alternatives:",
    "Soko AI pipeline analysis completed. Check out these highly relevant matching units currently available on the market right now:"
];

const INITIAL_STATE: ConversationState = {
    conversations: {},
    activeId: null,
    status: 'IDLE',
    error: null,
};

const ConversationContext = createContext<ConversationContextType | undefined>(undefined);

export function ConversationProvider({ children }: { children: React.ReactNode }) {
    // ==========================================
    // 2. STATE MANAGER (useState LocalStorage Initialization)
    // ==========================================
    const [state, setState] = useState<ConversationState>(() => {
        if (typeof window !== 'undefined') {
            const persisted = localStorage.getItem('soko_ai_sessions');
            if (persisted) {
                try {
                    return JSON.parse(persisted);
                } catch {
                    return INITIAL_STATE;
                }
            }
        }
        return INITIAL_STATE;
    });

    // Write-through caching synchronization layer
    useEffect(() => {
        localStorage.setItem('soko_ai_sessions', JSON.stringify(state));
    }, [state]);

    // Computed derived state properties
    const currentMessages = state.activeId ? state.conversations[state.activeId]?.messages || [] : [];

    // ==========================================
    // 3. CONTROLLER ACTIONS (State Mutators)
    // ==========================================

    const switchConversation = (id: string | null) => {
        setState(prev => ({
            ...prev,
            activeId: id,
            error: null // Reset error states on context swap
        }));
    };

    const startNewChatFrame = () => {
        setState(prev => ({
            ...prev,
            activeId: null
        }));
    };

    const deleteConversation = (id: string) => {
        setState(prev => {
            const updatedConversations = { ...prev.conversations };
            delete updatedConversations[id];
            return {
                ...prev,
                conversations: updatedConversations,
                activeId: prev.activeId === id ? null : prev.activeId
            };
        });
    };

    const clearAllConversations = () => {
        setState(INITIAL_STATE);
    };

    /**
     * Production-Ready MVP Mock Engine Handler
     */
    const sendMessage = async (text: string) => {
        if (!text.trim()) return;

        const currentActiveId = state.activeId;
        const targetChatId = currentActiveId || `chat_${Date.now()}`;

        const userMessage: Message = {
            id: `user_${Date.now()}`,
            sender: 'user',
            text,
            timestamp: Date.now()
        };

        // 1. Immediately inject the user's message into local state cleanly
        setState(prev => {
            const isInitialPrompt = !prev.activeId;
            const now = Date.now();

            const derivedTitle = text.length > 30
                ? `${text.substring(0, 30)}...`
                : text;

            let targetedConversation = prev.conversations[targetChatId];

            if (isInitialPrompt || !targetedConversation) {
                targetedConversation = {
                    id: targetChatId,
                    title: derivedTitle,
                    messages: [userMessage],
                    createdAt: now,
                    updatedAt: now,
                };
            } else {
                targetedConversation = {
                    ...targetedConversation,
                    messages: [...targetedConversation.messages, userMessage],
                    updatedAt: now
                };
            }

            return {
                ...prev,
                activeId: targetChatId,
                status: 'LOADING',
                error: null,
                conversations: {
                    ...prev.conversations,
                    [targetChatId]: targetedConversation
                }
            };
        });

        try {
            // 2. Simulated Network Call latency 
            const responseData = await new Promise<{ text: string; products: Product[]; related: Product[] }>((resolve) => {
                setTimeout(() => {
                    // Pick 6 random items for primary array, 4 separate random items for related recommendations
                    const mainProducts = getRandomItems(EXTENSIVE_MOCK_DATABASE || [], 6);
                    const relatedProducts = getRandomItems(EXTENSIVE_MOCK_DATABASE || [], 4);
                    const randomText = AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)];

                    resolve({
                        text: randomText,
                        products: mainProducts,
                        related: relatedProducts
                    });
                }, 1000);
            });

            const assistantMessage: Message = {
                id: `ai_${Date.now()}`,
                sender: 'assistant',
                text: responseData.text,
                products: responseData.products,
                relatedProducts: responseData.related,
                timestamp: Date.now()
            };

            // 3. Update active conversation map stack with incoming engine reply payload
            setState(prev => {
                const targetConv = prev.conversations[targetChatId];
                if (!targetConv) return prev; // Guard condition check

                return {
                    ...prev,
                    status: 'IDLE',
                    conversations: {
                        ...prev.conversations,
                        [targetChatId]: {
                            ...targetConv,
                            messages: [...targetConv.messages, assistantMessage],
                            updatedAt: Date.now()
                        }
                    }
                };
            });

        } catch (err: any) {
            setState(prev => ({
                ...prev,
                status: 'ERROR',
                error: err?.message || 'Failed to sync with Soko AI engine. Check connectivity.'
            }));
        }
    };

    return (
        <ConversationContext.Provider value={{
            ...state,
            currentMessages,
            sendMessage,
            switchConversation,
            deleteConversation,
            startNewChatFrame,
            clearAllConversations
        }}>
            {children}
        </ConversationContext.Provider>
    );
}

export function useConversations() {
    const context = useContext(ConversationContext);
    if (!context) {
        throw new Error('useConversations must be used strictly within a ConversationProvider closure.');
    }
    return context;
}