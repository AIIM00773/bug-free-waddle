import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import type { Product } from '../Constants/productTypes';

// ==========================================
// 1. TYPE DEFINITIONS & SCHEMAS
// ==========================================
export type SearchTypes = "direct_search" | "intelligent_search" | "direct_filter" | "intelligent_filter";
export type ResponseTypes = "direct_response" | "intelligent_response" | "direct_followup" | "intelligent_followup";
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
    conversationErrorMessage: string | null;
    sendMessage: (text: string) => Promise<void>;
    switchConversation: (id: string | null) => void;
    deleteConversation: (id: string) => Promise<void>;
    startNewChatFrame: () => void;
    clearAllConversations: () => Promise<void>;
    markStreamed: (messageId: string) => void;
    changeChatType: (type: SearchTypes) => void;
    loadAllConversations: () => Promise<void>;
}


// ==========================================
// 2. PRODUCTION API SERVICE LAYER WITH RETRY
// ==========================================
const API_BASE_URL = 'https://api.sokoai.tech/v1';

// Helper to implement standard exponential backoff/retry with tracking hook callbacks
const fetchWithRetry = async (url: string, options: RequestInit, onRetryTrigger: () => void, retries = 2): Promise<Response> => {
    try {
        const res = await fetch(url, options);
        if (!res.ok && retries > 0) {
            onRetryTrigger();
            await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2s before retry
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




const sokoApi = {
    async fetchAll(): Promise<Conversation[]> {
        const res = await fetch(`${API_BASE_URL}/conversations`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });
        if (!res.ok) throw new Error('Failed to synchronize conversations from server.');
        return res.json();
    },

    async create(text: string, searchType: SearchTypes, onRetry: () => void): Promise<Conversation> {
        const res = await fetchWithRetry(`${API_BASE_URL}/conversations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, searchType }),
        }, onRetry);
        if (!res.ok) throw new Error('Failed to initialize workspace session on backend.');
        return res.json();
    },

    async appendMessage(conversationId: string, text: string, onRetry: () => void): Promise<Conversation> {
        const res = await fetchWithRetry(`${API_BASE_URL}/conversations/${conversationId}/messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text }),
        }, onRetry);
        if (!res.ok) throw new Error('Failed to deliver query payload upstream to scrapers.');
        return res.json();
    },

    async delete(id: string): Promise<void> {
        const res = await fetch(`${API_BASE_URL}/conversations/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        });
        if (!res.ok) throw new Error('Remote lifecycle terminal request dropped.');
    },

    async clearAll(): Promise<void> {
        const res = await fetch(`${API_BASE_URL}/conversations/clear`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        });
        if (!res.ok) throw new Error('Global account history sweep rejected.');
    }
};

// ==========================================
// 3. INITIAL STATES & CONTEXT SEEDING
// ==========================================
const INITIAL_STATE: ConversationState = {
    conversations: {},
    activeId: null,
    status: 'IDLE',
    error: null,
};

const ConversationContext = createContext<ConversationContextType | undefined>(undefined);

// ==========================================
// 4. MAIN PROVIDER IMPLEMENTATION
// ==========================================
export function ConversationProvider({ children }: { children: React.ReactNode }) {
    const [searchType, setSearchType] = useState<SearchTypes>("direct_search");
    const [conversationErrorMessage, setConversationErrorMessage] = useState<string | null>(null);

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
            .map(({ id, title, updatedAt }) => ({ id, title, updatedAt }))
            .sort((a, b) => b.updatedAt - a.updatedAt);
    }, [state.conversations]);

    // ==========================================
    // 5. CONTEXT ACTIONS & MUTATOR ENGINE
    // ==========================================
    const changeChatType = (type: SearchTypes) => {
        if (type !== "direct_search") {
            setConversationErrorMessage("Sorry! This Advanced Feature is currently not available. We'll notify you when it goes live! Please switch to direct search for now.");
            setSearchType("direct_search");
        } else {
            setConversationErrorMessage(null);
            setSearchType(type);
        }
    };

    const loadAllConversations = async () => {
        setState(prev => ({ ...prev, status: 'LOADING', error: null }));
        try {
            const serverConversations = await sokoApi.fetchAll();
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
            error: null // Wipe errors cleanly when switching chat contexts
        }));
    };

    const startNewChatFrame = () => {
        setState(prev => ({
            ...prev,
            activeId: null,
            error: null
        }));
    };

    const sendMessage = async (text: string) => {
        if (!text.trim()) return;

        const currentActiveId = state.activeId;
        const isInitialPrompt = !currentActiveId;

        // Generate a local client-side message block just to append the user's input *immediately*
        const clientUserMessage: Message = {
            id: `temp-user-msg-${Date.now()}`,
            sender: 'user',
            text: text,
            timestamp: Date.now(),
            type: isInitialPrompt ? 'search' : 'followup'
        };

        // 1. Optimistically write the User's text block into the UI feed while changing status to WORKING
        setState(prev => {
            if (isInitialPrompt) {
                // If it's a new chat, create a placeholder workspace object so the text can display
                const placeholderId = 'placeholder_session';
                return {
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
                };
            } else {
                // Ongoing conversation: append to existing message stack immediately
                const existingChat = prev.conversations[currentActiveId!];
                if (!existingChat) return { ...prev, status: 'WORKING', error: null };
                return {
                    ...prev,
                    status: 'WORKING',
                    error: null,
                    conversations: {
                        ...prev.conversations,
                        [currentActiveId!]: {
                            ...existingChat,
                            messages: [...existingChat.messages, clientUserMessage],
                            updatedAt: Date.now()
                        }
                    }
                };
            }
        });

        // Trigger target hook callback down into network stream layers if retry loops are executed
        const triggerRetryStatus = () => {
            setState(prev => ({ ...prev, status: 'RETRYING' }));
        };

        try {
            let updatedConversationFromServer: Conversation;

            if (isInitialPrompt) {
                updatedConversationFromServer = await sokoApi.create(text, searchType, triggerRetryStatus);
            } else {
                updatedConversationFromServer = await sokoApi.appendMessage(currentActiveId!, text, triggerRetryStatus);
            }

            // 3. Request succeeded! Replace placeholder tracking keys with official server objects
            setState(prev => {
                const cleanConversations = { ...prev.conversations };
                // Wipe our temporary creation container key clean
                delete cleanConversations['placeholder_session']; 

                return {
                    ...prev,
                    status: 'IDLE',
                    activeId: updatedConversationFromServer.id,
                    conversations: {
                        ...cleanConversations,
                        [updatedConversationFromServer.id]: updatedConversationFromServer
                    }
                };
            });

        } catch (err: any) {
            console.error("Upstream request dropped or rejected:", err);
            
            // 4. On Error: Revert the placeholder conversation block if it was a failed initial prompt 
            // so garbage chat entries don't persist on the side dashboard tree lists.
            setState(prev => {
                const cleanConversations = { ...prev.conversations };
                
                if (isInitialPrompt) {
                    delete cleanConversations['placeholder_session'];
                    return {
                        ...prev,
                        status: 'ERROR',
                        activeId: null,
                        conversations: cleanConversations,
                        error: err?.message || 'Network communication break. Connection timed out.'
                    };
                } else {
                    // For failed followups, strip the un-answered message block so the user can re-submit cleanly
                    const existingChat = cleanConversations[currentActiveId!];
                    if (existingChat) {
                        cleanConversations[currentActiveId!] = {
                            ...existingChat,
                            messages: existingChat.messages.filter(m => m.id !== clientUserMessage.id)
                        };
                    }
                    return {
                        ...prev,
                        status: 'ERROR',
                        conversations: cleanConversations,
                        error: err?.message || 'Network communication break. Request failed.'
                    };
                }
            });
        }
    };

    const deleteConversation = async (id: string) => {
        setState(prev => ({ ...prev, status: 'WORKING' }));
        try {
            await sokoApi.delete(id);
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
            await sokoApi.clearAll();
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
            conversationErrorMessage,
            sendMessage,
            switchConversation,
            deleteConversation,
            startNewChatFrame,
            clearAllConversations,
            markStreamed,
            changeChatType,
            loadAllConversations
        }}>
            {children}
        </ConversationContext.Provider>
    );
}

export function useConversations() {
    const context = useContext(ConversationContext);
    if (!context) {
        throw new Error('useConversations must be strictly wrapped inside a valid ConversationProvider instantiation block.');
    }
    return context;
}