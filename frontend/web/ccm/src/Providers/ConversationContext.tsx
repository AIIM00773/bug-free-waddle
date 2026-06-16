import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import type { Product } from '../Constants/productTypes';

// ==========================================
// 1. TYPE DEFINITIONS & SCHEMAS
// ==========================================
export type SearchTypes = "direct_search" | "intelligent_search" | "direct_filter" | "intelligent_filter" | "direct_followup" | "intelligent_followup";
export type ResponseTypes = "direct_response" | "intelligent_response" | "direct_followup" | "intelligent_followup" | "direct_inquery" | "inelgent_inquery";
export type MessageType = 'success' | 'inquiry' | 'error' | 'followup' | 'response' | 'search';

export interface Message {
    id: string;
    sender: 'user' | 'assistant' | 'system' | 'sokoAI';
    text: string;
    products?: Product[];
    relatedProducts?: Product[];
    timestamp: number;
    type?: MessageType;
    streamed?: boolean;
    searchType?: SearchTypes;
    responseType?: ResponseTypes;
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

export interface ConversationState {
    conversations: Record<string, Conversation>;
    activeId: string | null;
    status: ChatStatus;
    error: string | null;
}

export interface ConversationSummary {
    id: string;
    title: string;
    updatedAt: number;
}

interface ConversationContextType extends ConversationState {
    currentMessages: Message[];
    conversationList: ConversationSummary[];
    searchType: SearchTypes;
    chatTypeSwitchErrorMessage: string | null;
    conversationErrorMessage: string | null;
    clearConversationErrorMessage: () => void;
    sendMessage: (text: string) => Promise<void>;
    switchConversation: (id: string | null) => void;
    deleteConversation: (id: string) => Promise<void>;
    startNewChatFrame: () => void;
    clearAllConversations: () => Promise<void>;
    markStreamed: (messageId: string) => void;
    changeChatType: (type: SearchTypes) => void;
    loadAllConversations: () => Promise<void>;
    chatWorkspaceState: string | null;
}

const API_BASE_URL = 'https://api.sokoai.tech/v1';

// Standardized Inline Exponential Backoff Engine
const fetchWithRetry = async (url: string, options: RequestInit, onRetryTrigger: () => void, retries = 2): Promise<Response> => {
    try {
        const res = await fetch(url, options);
        if (!res.ok && retries > 0) {
            onRetryTrigger();
            await new Promise(resolve => setTimeout(resolve, 2000));
            return fetchWithRetry(url, options, onRetryTrigger, retries - 1);
        }
        return res;
    } catch (err) {
        if (retries > 0) {
            onRetryTrigger();
            await new Promise(resolve => setTimeout(resolve, 2000));
            return fetchWithRetry(url, options, onRetryTrigger, retries - 1);
        }
        throw err;
    }
};

// ==========================================
// 2. INITIAL STATES & CONTEXT SEEDING
// ==========================================
const INITIAL_STATE: ConversationState = {
    conversations: {},
    activeId: null,
    status: 'IDLE',
    error: null,
};

const ConversationContext = createContext<ConversationContextType | undefined>(undefined);

// ==========================================
// 3. MAIN PROVIDER IMPLEMENTATION
// ==========================================
export function ConversationProvider({ children }: { children: React.ReactNode }) {
    const [searchType, setSearchType] = useState<SearchTypes>("direct_search");
    const [conversationErrorMessage, setConversationErrorMessage] = useState<string | null>(null);
    const [chatTypeSwitchErrorMessage, setchatTypeSwitchErrorMessage] = useState<string | null>(null);
    const [chatWorkspaceState, setchatWorkspaceState] = useState<string | null>(null);

    const clearConversationErrorMessage = () => {
        setConversationErrorMessage(null);
    };

    const [state, setState] = useState<ConversationState>(() => {
        if (typeof window !== 'undefined') {
            const persisted = sessionStorage.getItem('soko_ai_sessions');
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

    useEffect(() => {
        sessionStorage.setItem('soko_ai_sessions', JSON.stringify(state));
    }, [state]);

    useEffect(() => {
        loadAllConversations();
    }, []);

    const currentMessages = useMemo(() => {
        if (!state.activeId) return [];
        return state.conversations[state.activeId]?.messages || [];
    }, [state.activeId, state.conversations]);

    const conversationList = useMemo(() => {
        return Object.values(state.conversations)
            .filter(c => c.id !== 'placeholder_session')
            .map(({ id, title, updatedAt }) => ({ id, title, updatedAt }))
            .sort((a, b) => b.updatedAt - a.updatedAt);
    }, [state.conversations]);

    const triggerRetryStatus = useCallback(() => {
        setState(prev => ({ ...prev, status: 'RETRYING' }));
    }, []);





    // ==========================================
    // 4. DECOUPLED OPERATIONAL ENGINE (INLINE APIS)
    // ==========================================

    const createNewConversation = async (text: string, clientUserMessage: Message) => {
        const placeholderId = 'placeholder_session';
        setchatWorkspaceState("WORKING");

        setState(prev => ({
            ...prev,
            status: 'WORKING',
            error: null,
            activeId: placeholderId,
            conversations: {
                ...prev.conversations,
                [placeholderId]: {
                    id: placeholderId,
                    title: text.substring(0, 30),
                    messages: [clientUserMessage],
                    createdAt: Date.now(),
                    updatedAt: Date.now()
                }
            }
        }));

        try {
            const res = await fetchWithRetry(`${API_BASE_URL}/conversations`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text, searchType })
            }, triggerRetryStatus);

            if (!res.ok) throw new Error('Failed to initialize workspace session, server or network Error!!.');
            const serverResponse: Conversation = await res.json();

            setchatWorkspaceState("IDLE");
            setState(prev => {
                const cleanConversations = { ...prev.conversations };
                delete cleanConversations[placeholderId];

                return {
                    ...prev,
                    status: 'IDLE',
                    activeId: serverResponse.id,
                    conversations: {
                        ...cleanConversations,
                        [serverResponse.id]: serverResponse
                    }
                };
            });
        } catch (err: any) {
            console.error("Failed to spin up backend workspace canvas session:", err);
            setchatWorkspaceState("ERROR");

            setState(prev => {
                const cleanConversations = { ...prev.conversations };
                delete cleanConversations[placeholderId];
                return {
                    ...prev,
                    status: 'ERROR',
                    activeId: null,
                    conversations: cleanConversations,
                    error: err?.message || 'Server drops initialization link.'
                };
            });
            setConversationErrorMessage(err?.message || 'Failed to initialize session.');
        }
    };






    const appendFollowupMessage = async (text: string, activeId: string, clientUserMessage: Message) => {
        setchatWorkspaceState("WORKING");

        setState(prev => {
            const existingChat = prev.conversations[activeId];
            if (!existingChat) return prev;
            return {
                ...prev,
                status: 'WORKING',
                error: null,
                conversations: {
                    ...prev.conversations,
                    [activeId]: {
                        ...existingChat,
                        messages: [...existingChat.messages, clientUserMessage],
                        updatedAt: Date.now()
                    }
                }
            };
        });

        try {
            const res = await fetchWithRetry(`${API_BASE_URL}/conversations/${activeId}/messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text }),
            }, triggerRetryStatus);

            if (!res.ok) throw new Error('Failed to deliver query payload upstream to scrapers.');
            const serverResponse: Conversation = await res.json();

            setchatWorkspaceState("IDLE");
            setState(prev => ({
                ...prev,
                status: 'IDLE',
                conversations: {
                    ...prev.conversations,
                    [serverResponse.id]: serverResponse
                }
            }));
        } catch (err: any) {
            console.error("Downstream append pipeline dropped payload execution context:", err);
            setchatWorkspaceState("ERROR");

            setState(prev => {
                const cleanConversations = { ...prev.conversations };
                const existingChat = cleanConversations[activeId];
                if (existingChat) {
                    cleanConversations[activeId] = {
                        ...existingChat,
                        messages: existingChat.messages.filter(m => m.id !== clientUserMessage.id)
                    };
                }
                return {
                    ...prev,
                    status: 'ERROR',
                    conversations: cleanConversations,
                    error: err?.message || 'Upstream request handling failure.'
                };
            });
            setConversationErrorMessage(err?.message || 'Failed to sync follow-up query.');
        }
    };






    // ==========================================
    // 5. SERVICE ROUTER & MANAGER RUNTIMES
    // ==========================================
    const sendMessage = async (text: string) => {
        if (!text.trim()) return;

        const currentActiveId = state.activeId;
        const isInitialPrompt = !currentActiveId || currentActiveId === 'placeholder_session';

        const clientUserMessage: Message = {
            id: `temp-user-msg-${Date.now()}`,
            sender: 'user',
            text: text,
            timestamp: Date.now(),
            type: isInitialPrompt ? 'search' : 'followup'
        };

        if (isInitialPrompt) {
            await createNewConversation(text, clientUserMessage);
        } else {
            await appendFollowupMessage(text, currentActiveId!, clientUserMessage);
        }
    };







    const changeChatType = (type: SearchTypes) => {
        if (type !== "direct_search") {
            setchatTypeSwitchErrorMessage("Sorry! This Feature is currently not available. We'll notify you when it goes live! Please switch to direct search for now.");
        } else {
            setchatTypeSwitchErrorMessage(null);
            setSearchType(type);
        }
    };








    const loadAllConversations = async () => {
        setState(prev => ({ ...prev, status: 'LOADING', error: null }));
        try {
            const res = await fetch(`${API_BASE_URL}/conversations`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!res.ok) throw new Error('Failed to synchronize conversations from server.');
            const serverConversations: Conversation[] = await res.json();

            const normalizedConversations = serverConversations.reduce<Record<string, Conversation>>((acc, curr) => {
                acc[curr.id] = curr;
                return acc;
            }, {});

            setState(prev => ({
                ...prev,
                status: 'IDLE',
                conversations: normalizedConversations
            }));
        } catch (err: any) {
            setState(prev => ({
                ...prev,
                status: 'ERROR',
                error: err?.message || 'Failed to fetch conversations from server.'
            }));
        }
    };




    const switchConversation = (id: string | null) => {
        setState(prev => ({
            ...prev,
            activeId: id,
            error: null
        }));
    };




    const startNewChatFrame = () => {
        setState(prev => ({
            ...prev,
            activeId: null,
            error: null
        }));
    };






    const deleteConversation = async (id: string) => {
        setState(prev => ({ ...prev, status: 'WORKING' }));
        try {
            const res = await fetch(`${API_BASE_URL}/conversations/${id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!res.ok) throw new Error('Remote lifecycle terminal request dropped.');

            setState(prev => {
                const updatedConversations = { ...prev.conversations };
                delete updatedConversations[id];
                return {
                    ...prev,
                    status: 'IDLE',
                    conversations: updatedConversations,
                    activeId: prev.activeId === id ? null : prev.activeId
                };
            });
        } catch (err: any) {
            setState(prev => ({ ...prev, status: 'ERROR', error: err.message }));
        }
    };








    const clearAllConversations = async () => {
        setState(prev => ({ ...prev, status: 'WORKING' }));
        try {
            const res = await fetch(`${API_BASE_URL}/conversations/clear`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!res.ok) throw new Error('Global account history sweep rejected.');

            setState(INITIAL_STATE);
        } catch (err: any) {
            setState(prev => ({ ...prev, status: 'ERROR', error: err.message }));
        }
    };






    const markStreamed = (messageId: string) => {
        if (!state.activeId) return;

        setState(prev => {
            const activeChat = prev.conversations[prev.activeId!];
            if (!activeChat) return prev;

            const updatedMessages = activeChat.messages.map(msg =>
                msg.id === messageId ? { ...msg, streamed: true } : msg
            );

            return {
                ...prev,
                conversations: {
                    ...prev.conversations,
                    [activeChat.id]: {
                        ...activeChat,
                        messages: updatedMessages
                    }
                }
            };
        });
    };

    return (
        <ConversationContext.Provider value={{
            ...state,
            currentMessages,
            conversationList,
            searchType,
            sendMessage,
            switchConversation,
            deleteConversation,
            startNewChatFrame,
            clearAllConversations,
            markStreamed,
            changeChatType,
            loadAllConversations,
            chatTypeSwitchErrorMessage,
            conversationErrorMessage,
            clearConversationErrorMessage,
            chatWorkspaceState
        }}>
            {children}
        </ConversationContext.Provider>
    );
}

export function useConversations() {
    const context = useContext(ConversationContext);
    if (!context) {
        throw new Error('useConversations must be wrapped inside a valid ConversationProvider block.');
    }
    return context;
}