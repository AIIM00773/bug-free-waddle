import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, useRef } from 'react';
import type { Product } from '../Constants/productTypes';
import { AUTH_KEYS, API_BASE_URL, useAuth } from "./AuthContex";


// -----------------------------------------------------------------------------
// 1. TYPE DEFINITIONS & SCHEMAS
// -----------------------------------------------------------------------------

export type SearchTypes = "direct_search" | "intelligent_search" | "direct_filter" | "intelligent_filter" | "direct_followup" | "intelligent_followup";
export type ResponseTypes = "direct_response" | "intelligent_response" | "direct_followup" | "intelligent_followup" | "direct_inquiry" | "intelligent_inquiry";
export type MessageType = 'success' | 'inquiry' | 'error' | 'followup' | 'response' | 'search';
export type MessageSenderType = 'user' | 'assistant' | 'system' | 'sokoAI';
export type FilterType = "price" | "category" | "brand" | "reviews" | "ratings" | "all" | "agency";
export type ReviewsType = "best" | "good" | "moderate" | "poor";
export type ProximityType = "delivery_by_minutes" | "half_hour_delivery" | "hourly_delivery" | "one_day_delivery" | "delivery_by_days" | "one_week_delivery";
export type ChatStatus = 'IDLE' | 'LOADING' | 'WORKING' | 'RETRYING' | 'ERROR';

export interface Message {
    id: string;
    sender: MessageSenderType;
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

export interface Filters {
    conversationId: string;
    chatId: string;
    filterby: FilterType;
    minprice?: number;
    maxprice?: number;
    category?: string;
    brand?: string;
    reviews?: ReviewsType;
    ratings?: number;
    proximity?: ProximityType;
}



interface ConversationContextType extends ConversationState {
    conversationList: ConversationSummary[];
    currentMessages: Message[];
    searchType: SearchTypes;
    chatTypeSwitchErrorMessage: string | null;
    conversationErrorMessage: string | null;
    chatWorkspaceState: ChatStatus | null;
    clearConversationErrorMessage: () => void;
    sendMessage: (text: string) => Promise<void>;
    filterResults: (filters: Filters) => Promise<void>;
    startNewChatFrame: () => void;
    switchConversation: (id: string | null) => Promise<void>;
    deleteConversation: (id: string) => Promise<void>;
    clearAllConversations: () => Promise<void>;
    markStreamed: (messageId: string) => Promise<void>;
    loadAllConversations: () => Promise<void>;
    changeChatType: (type: SearchTypes) => void;
}




// Constants & Helpers
export const base_url_for_conversations = `${API_BASE_URL}/public/api/v1/conversations/conversations/`;


const fetchWithRetry = async (
    url: string,
    options: RequestInit,
    onRetryTrigger: () => void,
    retries = 2
): Promise<Response> => {
    try {
        const res = await fetch(url, options);
        if (!res.ok && res.status >= 400 && res.status < 500) { return res; }
        if (!res.ok && res.status >= 500) { throw new Error(`Server responded with ${res.status}`); }
        return res;
    } catch (err) {
        if (retries > 0) {
            onRetryTrigger();
            await new Promise((resolve) => setTimeout(resolve, 2000));
            return fetchWithRetry(url, options, onRetryTrigger, retries - 1);
        }
        throw err;
    }
};








// Context initialization
const INITIAL_STATE: ConversationState = {
    conversations: {},
    activeId: null,
    status: 'IDLE',
    error: null,
};

const ConversationContext = createContext<ConversationContextType | undefined>(undefined);





// Provider
export function ConversationProvider({ children }: { children: React.ReactNode }) {
    const [searchType, setSearchType] = useState<SearchTypes>('direct_search');
    const [conversationErrorMessage, setConversationErrorMessage] = useState<string | null>(null);
    const [chatTypeSwitchErrorMessage, setChatTypeSwitchErrorMessage] = useState<string | null>(null);
    const [chatWorkspaceState, setChatWorkspaceState] = useState<ChatStatus | null>(null);

    const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
    const wasAuthenticatedRef = useRef<boolean | null>(null);

    const clearConversationErrorMessage = useCallback(() => { setConversationErrorMessage(null); }, []);


    // Hydrate state from sessionStorage
    const [state, setState] = useState<ConversationState>(() => {
        if (typeof window !== 'undefined') {
            const persisted = sessionStorage.getItem('soko_ai_sessions');
            if (persisted) {
                try { return JSON.parse(persisted); }
                catch { return INITIAL_STATE; }
            }
        }
        return INITIAL_STATE;
    });




    // Persist conversations while authenticated
    useEffect(() => {
        if (isAuthenticated) {
            try {
                sessionStorage.setItem('soko_ai_sessions', JSON.stringify(state));
            } catch (e) {
                setConversationErrorMessage(`Failed to persist sessions to sessionStorage, ${e}`);
            }
        }
    }, [state, isAuthenticated]);




    // Monitor authentication changes and clear on logout
    useEffect(() => {
        if (isAuthLoading) return;

        if (!isAuthenticated) {
            if (wasAuthenticatedRef.current === true) {
                setState(INITIAL_STATE);
                sessionStorage.removeItem('soko_ai_sessions');
                setConversationErrorMessage('Your previous active session was terminated.');
            }
            wasAuthenticatedRef.current = false;
        } else {
            wasAuthenticatedRef.current = true;
        }
    }, [isAuthenticated, isAuthLoading]);





    //|||||||||| DERIVED DATA ()|||||||||||||||||||||||||
    const currentMessages = useMemo(() => {
        if (!state.activeId) return [];
        return state.conversations[state.activeId]?.messages || [];
    }, [state.activeId, state.conversations]);



    const conversationList = useMemo(() => {
        return Object.values(state.conversations)
            .filter((c) => c.id !== 'placeholder_session')
            .map(({ id, title, updatedAt }) => ({ id, title, updatedAt }))
            .sort((a, b) => b.updatedAt - a.updatedAt);
    }, [state.conversations]);



    const triggerRetryStatus = useCallback(() => {
        setState((prev) => ({ ...prev, status: 'RETRYING' }));
    }, []);



    const getAuthHeaders = useCallback(async (customHeaders: Record<string, string> = {}) => {
        const accessToken = localStorage.getItem(AUTH_KEYS.ACCESS_TOKEN_KEY);
        return {
            'Content-Type': 'application/json',
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
            ...customHeaders,
        };
    }, []);










    /*API ACTIONS /OPERATIONS  */


    // fetch  a single conversation's history 
    const fetchConversationDetails = useCallback(
        async (id: string): Promise<Conversation> => {
            const authHeaders = await getAuthHeaders();
            const res = await fetch(`${base_url_for_conversations}${id}/conversation_history/`, {
                method: 'GET',
                headers: authHeaders,
            });
            if (!res.ok) throw new Error('Failed to retrieve full conversation stream details.');
            const data = await res.json();
            return data.conversation || data;
        },
        [getAuthHeaders]
    );




    // load all conversations summery for sidebar
    const loadAllConversations = useCallback(async () => {
        const accessToken = localStorage.getItem(AUTH_KEYS.ACCESS_TOKEN_KEY);
        if (!isAuthenticated || !accessToken) return;

        setState((prev) => ({ ...prev, status: 'LOADING', error: null }));

        try {
            const authHeaders = await getAuthHeaders();
            const res = await fetch(base_url_for_conversations, {
                method: 'GET',
                headers: authHeaders,
            });

            if (!res.ok) throw new Error('Failed to synchronize conversations from server.');
            const serverConversations: Conversation[] = await res.json();

            const normalizedConversations = serverConversations.reduce<Record<string, Conversation>>((acc, curr) => {
                acc[curr.id] = { ...curr, messages: curr.messages || [] };
                return acc;
            }, {});

            let activeChatId = state.activeId;
            if (activeChatId && normalizedConversations[activeChatId]) {
                try {
                    const fullConversationData = await fetchConversationDetails(activeChatId);
                    normalizedConversations[activeChatId] = fullConversationData;
                } catch (fetchErr) {
                    console.error('Failed to hydrate active chat timeline:', fetchErr);
                }
            }

            setState((prev) => ({ ...prev, status: 'IDLE', conversations: normalizedConversations }));
        } catch (err: any) {
            setState((prev) => ({ ...prev, status: 'ERROR', error: err?.message || 'Failed to fetch conversations.' }));
        }
    }, [isAuthenticated, getAuthHeaders, state.activeId, fetchConversationDetails]);



    // auth guard effect 
    useEffect(() => {
        if (!isAuthLoading && isAuthenticated) {
            loadAllConversations();
        }
    }, [isAuthenticated, isAuthLoading, loadAllConversations]);





    // create  new coversations
    const createNewConversation = useCallback(
        async (clientUserMessage: Message) => {
            if (!isAuthenticated) {
                setConversationErrorMessage('Authentication is required to perform search routines.');
                return;
            }

            const placeholderId = 'placeholder_session';
            setChatWorkspaceState('WORKING');

            setState((prev) => ({
                ...prev,
                status: 'WORKING',
                error: null,
                activeId: placeholderId,
                conversations: {
                    ...prev.conversations,
                    [placeholderId]: {
                        id: placeholderId,
                        title: clientUserMessage.text.slice(0, 20),
                        messages: [clientUserMessage],
                        createdAt: Date.now(),
                        updatedAt: Date.now(),
                    },
                },
            }));

            try {
                const authHeaders = await getAuthHeaders();
                const res = await fetchWithRetry(
                    base_url_for_conversations, // Removed redundant 'conversations/'
                    {
                        method: 'POST',
                        headers: authHeaders,
                        body: JSON.stringify({ clientUserMessage, searchType }),
                    },
                    triggerRetryStatus
                );

                if (!res.ok) throw new Error('Failed to initialize workspace link with server.');
                const serverResponse: Conversation = await res.json();

                setChatWorkspaceState('IDLE');
                setState((prev) => {
                    const cleanConversations = { ...prev.conversations };
                    delete cleanConversations[placeholderId];
                    return {
                        ...prev,
                        status: 'IDLE',
                        activeId: serverResponse.id,
                        conversations: {
                            ...cleanConversations,
                            [serverResponse.id]: serverResponse,
                        },
                    };
                });
            } catch (err: any) {
                setChatWorkspaceState('ERROR');
                setState((prev) => {
                    const cleanConversations = { ...prev.conversations };
                    delete cleanConversations[placeholderId];
                    return {
                        ...prev,
                        status: 'ERROR',
                        activeId: null,
                        conversations: cleanConversations,
                        error: err?.message || 'Server dropped initialization link.',
                    };
                });
                setConversationErrorMessage(err?.message || 'Failed to initialize session.');
            }
        },
        [searchType, triggerRetryStatus, getAuthHeaders, isAuthenticated]
    );




    // followup chats / conversations
    const appendFollowupMessage = useCallback(
        async (text: string, activeId: string, clientUserMessage: Message) => {
            if (!isAuthenticated) {
                setConversationErrorMessage('Authentication expired. Please log in again.');
                return;
            }

            setChatWorkspaceState('WORKING');

            setState((prev) => {
                const existingChat = prev.conversations[activeId];
                if (!existingChat) return prev;
                return {
                    ...prev, status: 'WORKING', error: null,
                    conversations: {
                        ...prev.conversations, [activeId]: {
                            ...existingChat, messages: [...existingChat.messages, clientUserMessage], updatedAt: Date.now(),
                        },
                    },
                };
            });

            try {
                const authHeaders = await getAuthHeaders();
                const res = await fetchWithRetry(`${base_url_for_conversations}${activeId}/messages/`, {
                    method: 'POST',
                    headers: authHeaders,
                    body: JSON.stringify({ text }),
                }, triggerRetryStatus);

                if (!res.ok) throw new Error('Failed to deliver query payload upstream.');

                const aiMessage: Message = await res.json();

                setChatWorkspaceState('IDLE');
                setState((prev) => {
                    const existingChat = prev.conversations[activeId];
                    if (!existingChat) return prev;
                    return {
                        ...prev,
                        status: 'IDLE',
                        conversations: {
                            ...prev.conversations,
                            [activeId]: {
                                ...existingChat,
                                messages: [...existingChat.messages, aiMessage],
                                updatedAt: Date.now(),
                            },
                        },
                    };
                });
            } catch (err: any) {
                setChatWorkspaceState('ERROR');
                setState((prev) => {
                    const cleanConversations = { ...prev.conversations };
                    const existingChat = cleanConversations[activeId];
                    if (existingChat) {
                        cleanConversations[activeId] = {
                            ...existingChat,
                            messages: existingChat.messages.filter((m) => m.id !== clientUserMessage.id),
                        };
                    }
                    return { ...prev, status: 'ERROR', conversations: cleanConversations, error: err?.message || 'Upstream handling failure.' };
                });
                setConversationErrorMessage(err?.message || 'Failed to sync follow-up query.');
            }
        },
        [triggerRetryStatus, getAuthHeaders, isAuthenticated]
    );





    // send message functions 
    const sendMessage = useCallback(
        async (text: string) => {
            if (!text.trim()) return;
            if (!isAuthenticated) {
                setConversationErrorMessage('You must log in to submit inquiries.');
                return;
            }

            const currentActiveId = state.activeId;
            const isInitialPrompt = !currentActiveId || currentActiveId === 'placeholder_session';

            const clientUserMessage: Message = {
                id: `temp-user-msg-${Date.now()}`,
                sender: 'user',
                text: text,
                timestamp: Date.now(),
                type: isInitialPrompt ? 'search' : 'followup',
            };

            if (isInitialPrompt) {
                await createNewConversation(clientUserMessage);
            } else {
                await appendFollowupMessage(text, currentActiveId as string, clientUserMessage);
            }
        },
        [state.activeId, createNewConversation, appendFollowupMessage, isAuthenticated]
    );




    // change chat type function
    const changeChatType = useCallback((type: SearchTypes) => {
        if (type !== 'direct_search') {
            setChatTypeSwitchErrorMessage('Sorry! This Feature is currently not available. Please switch to direct search for now.');
        } else {
            setChatTypeSwitchErrorMessage(null);
            setSearchType(type);
        }
    }, []);



    // switch conversation 
    const switchConversation = useCallback(
        async (id: string | null) => {
            if (!id) {
                setState((prev) => ({ ...prev, activeId: null, error: null }));
                return;
            }

            setState((prev) => ({ ...prev, activeId: id, error: null }));

            let locallyCachedConversation: Conversation | undefined;
            setState((prev) => {
                locallyCachedConversation = prev.conversations[id];
                return prev;
            });

            if (!locallyCachedConversation || !locallyCachedConversation.messages || locallyCachedConversation.messages.length === 0) {
                setState((prev) => ({ ...prev, status: 'WORKING' }));
                try {
                    const deepConversationData = await fetchConversationDetails(id);
                    setState((prev) => ({ ...prev, status: 'IDLE', conversations: { ...prev.conversations, [id]: deepConversationData } }));
                } catch (err: any) {
                    setState((prev) => ({ ...prev, status: 'ERROR', error: err?.message || 'Failed to read thread messages.' }));
                }
            }
        },
        [fetchConversationDetails]
    );

    // start new chat frame 
    const startNewChatFrame = useCallback(() => {
        setState((prev) => ({ ...prev, activeId: null, error: null }));
    }, []);



    // delete user conversation 
    const deleteConversation = useCallback(
        async (id: string) => {
            try {
                const authHeaders = await getAuthHeaders();
                const res = await fetch(`${base_url_for_conversations}${id}/delete/`, {
                    method: 'DELETE',
                    headers: authHeaders,
                });
                if (!res.ok) throw new Error('Remote lifecycle terminal request dropped.');

                setState((prev) => {
                    const updatedConversations = { ...prev.conversations };
                    delete updatedConversations[id];
                    return { ...prev, status: 'IDLE', conversations: updatedConversations, activeId: prev.activeId === id ? null : prev.activeId };
                });
            } catch (err: any) {
                setState((prev) => ({ ...prev, status: 'ERROR', error: err.message }));
            }
        },
        [getAuthHeaders]
    );



    // Clear all conversations 
    const clearAllConversations = useCallback(async () => {
        setState((prev) => ({ ...prev, status: 'WORKING' }));
        try {
            const authHeaders = await getAuthHeaders();
            const res = await fetch(`${base_url_for_conversations}clear/`, {
                method: 'POST',
                headers: authHeaders,
                body: JSON.stringify({}),
            });
            if (!res.ok) throw new Error('Global account history sweep rejected.');

            setState(INITIAL_STATE);
        } catch (err: any) {
            setState((prev) => ({ ...prev, status: 'ERROR', error: err.message }));
        }
    }, [getAuthHeaders]);



    // mark chat as streamed 
    const markStreamed = useCallback(
        async (messageId: string) => {
            const activeChatId = state.activeId;
            if (!activeChatId) return;

            let dynamicBailout = false;

            setState((prev) => {
                const activeChat = prev.conversations[activeChatId];
                if (!activeChat) return prev;

                const targetMessage = activeChat.messages.find((msg) => msg.id === messageId);
                if (targetMessage?.streamed) {
                    dynamicBailout = true;
                    return prev;
                }

                const updatedMessages = activeChat.messages.map((msg) => (msg.id === messageId ? { ...msg, streamed: true } : msg));

                return { ...prev, conversations: { ...prev.conversations, [activeChatId]: { ...activeChat, messages: updatedMessages } } };
            });

            if (dynamicBailout) return;

            try {
                const authHeaders = await getAuthHeaders();
                const res = await fetch(`${base_url_for_conversations}${activeChatId}/mark_streamed/`, {
                    method: 'PATCH',
                    headers: authHeaders,
                    body: JSON.stringify({ streamed: true, messageId: messageId }),
                });

                if (res.status === 404) return;
                if (!res.ok) throw new Error('Server declined to update message stream status.');
            } catch (err) {
                // Rollback optimistic update
                setState((prev) => {
                    const activeChat = prev.conversations[activeChatId];
                    if (!activeChat) return prev;
                    return {
                        ...prev,
                        conversations: {
                            ...prev.conversations,
                            [activeChatId]: {
                                ...activeChat,
                                messages: activeChat.messages.map((msg) => (msg.id === messageId ? { ...msg, streamed: false } : msg)),
                            },
                        },
                    };
                });
                setConversationErrorMessage('Failed to save conversation reading state.');
            }
        },
        [state.activeId, getAuthHeaders]
    );



    // todo , filters the results 
    const filterResults = useCallback(async (filters: Filters) => {
        if (!filters) {
            setConversationErrorMessage('An empty filter is not possible !!');
            return;
        }
        console.log(filters);
    }, []);




    // -------------------------------------------------------------------------
    // Context value & export
    // -------------------------------------------------------------------------
    const contextValue = useMemo(
        () => ({
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
            chatWorkspaceState,
            filterResults,
        }),
        [
            state,
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
            chatWorkspaceState,
            filterResults,
        ]
    );

    return <ConversationContext.Provider value={contextValue}>{children}</ConversationContext.Provider>;
}

export function useConversations() {
    const context = useContext(ConversationContext);
    if (!context) {
        throw new Error('useConversations must be wrapped inside a valid ConversationProvider block.');
    }
    return context;
}