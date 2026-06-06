

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { Product } from '../Constants/productTypes';

// ==========================================
// 1. TYPE DEFINITIONS & SCHEMAS
// ==========================================

export interface Message {
    id: string;
    sender: 'user' | 'assistant' |"system" | "sokoAI";
    text: string;
    products?: Product[];
    timestamp: number;
    type?:"sucess" | "inquery" | "error" | "followup"
}




export interface Conversation {
    id: string;
    uid?:string |null;
    pinned?:boolean;
    completed?:boolean;
    title: string;
    messages: Message[];
    createdAt: number;
    updatedAt: number;
    protected?:boolean;
}



export type ChatStatus = 'IDLE' | 'LOADING' | "WORKING" | "RETRYING" | 'ERROR';

interface ConversationState {
    conversations: Record<string, Conversation>; // O(1) lookups instead of Arrays
    activeId: string | null;
    status: ChatStatus;
    error: string | null;
}



// Discriminated Unions for Strict Reducer Actions
type ConversationAction = 
    | { type: 'SET_ACTIVE_CONVERSATION'; payload: string | null }
    | { type: 'CREATE_CONVERSATION'; payload: { id: string; firstMessage: Message } }
    | { type: 'ADD_MESSAGE'; payload: { conversationId: string; message: Message } }
    | { type: 'SET_STATUS'; payload: ChatStatus }
    | { type: 'SET_ERROR'; payload: string | null }
    | { type: 'DELETE_CONVERSATION'; payload: string }
    | { type: 'CLEAR_ALL_CONVERSATIONS' };




// ==========================================
// 2. REDUCER IMPLEMENTATION (Pure State Machine)
// ==========================================

const initialState: ConversationState = {
    conversations: {},
    activeId: null,
    status: 'IDLE',
    error: null,
};





function conversationReducer(state: ConversationState, action: ConversationAction): ConversationState {
    switch (action.type) {
        case 'SET_ACTIVE_CONVERSATION':
            return { 
                ...state, 
                activeId: action.payload,
                error: null // Reset error states on context swap
            };

        case 'CREATE_CONVERSATION': {
            const { id, firstMessage } = action.payload;
            const now = Date.now();
            
            // Derive a crisp preview title from the user prompt
            const derivedTitle = firstMessage.text.length > 30 
                ? `${firstMessage.text.substring(0, 30)}...` 
                : firstMessage.text;

            return {
                ...state,
                activeId: id,
                conversations: {
                    ...state.conversations,
                    [id]: {
                        id,
                        title: derivedTitle,
                        messages: [firstMessage],
                        createdAt: now,
                        updatedAt: now,
                    }
                }
            };
        }

        case 'ADD_MESSAGE': {
            const { conversationId, message } = action.payload;
            const existingTarget = state.conversations[conversationId];
            
            if (!existingTarget) return state;

            return {
                ...state,
                conversations: {
                    ...state.conversations,
                    [conversationId]: {
                        ...existingTarget,
                        messages: [...existingTarget.messages, message],
                        updatedAt: Date.now()
                    }
                }
            };
        }

        case 'SET_STATUS':
            return { ...state, status: action.payload };

        case 'SET_ERROR':
            return { ...state, error: action.payload, status: 'IDLE' };

        case 'DELETE_CONVERSATION': {
            const updatedConversations = { ...state.conversations };
            delete updatedConversations[action.payload];
            
            return {
                ...state,
                conversations: updatedConversations,
                activeId: state.activeId === action.payload ? null : state.activeId
            };
        }

        case 'CLEAR_ALL_CONVERSATIONS':
            return initialState;

        default:
            return state;
    }
}





// ==========================================
// 3. CONTEXT & INTERFACE BINDING
// ==========================================

interface ConversationContextType extends ConversationState {
    currentMessages: Message[];
    sendMessage: (text: string) => Promise<void>;
    switchConversation: (id: string | null) => void;
    deleteConversation: (id: string) => void;
    startNewChatFrame: () => void;
}



const ConversationContext = createContext<ConversationContextType | undefined>(undefined);

export function ConversationProvider({ children }: { children: React.ReactNode }) {
    // Lazy initialization from LocalStorage for persistence across full page reloads
    
    const [state, dispatch] = useReducer(conversationReducer, initialState, (initial) => {
        if (typeof window !== 'undefined') {
            const persisted = localStorage.getItem('soko_ai_sessions');
            if (persisted) {
                try {
                    return JSON.parse(persisted);
                } catch {
                    return initial;
                }
            }
        }
        return initial;
    });


    // Write-through caching synchronization layer
    useEffect(() => {
        localStorage.setItem('soko_ai_sessions', JSON.stringify(state));
    }, [state]);


    // Computed derived state properties
    const currentMessages = state.activeId ? state.conversations[state.activeId]?.messages || [] : [];

    // --- CONTROLLER ACTION CREATORS ---

    const switchConversation = (id: string | null) => {
        dispatch({ type: 'SET_ACTIVE_CONVERSATION', payload: id });
    };

    const startNewChatFrame = () => {
        dispatch({ type: 'SET_ACTIVE_CONVERSATION', payload: null });
    };

    const deleteConversation = (id: string) => {
        dispatch({ type: 'DELETE_CONVERSATION', payload: id });
    };

    
    /**
     * Complete HTTP Request/Response Lifecycle Handler (Non-Streaming execution block)
     */
    const sendMessage = async (text: string) => {
        if (!text.trim()) return;

        let targetChatId = state.activeId;
        const isInitialPrompt = !targetChatId;
        const generatedUserMsgId = `user_${Date.now()}`;
        
        const userMessage: Message = {
            id: generatedUserMsgId,
            sender: 'user',
            text,
            timestamp: Date.now()
        };

        // 1. Setup Session Context or append to existing array immutably
        if (isInitialPrompt) {
            targetChatId = `chat_${Date.now()}`;
            dispatch({ 
                type: 'CREATE_CONVERSATION', 
                payload: { id: targetChatId, firstMessage: userMessage } 
            });
        } else {
            dispatch({ 
                type: 'ADD_MESSAGE', 
                payload: { conversationId: targetChatId!, message: userMessage } 
            });
        }

        // 2. Transition State to Loading for Non-Streaming Request
        dispatch({ type: 'SET_STATUS', payload: 'LOADING' });
        dispatch({ type: 'SET_ERROR', payload: null });

        try {
            // Simulated Axios / Fetch integration payload with your scraper backend API wrapper
            // const response = await api.post('/api/v1/chat', { message: text, conversation_id: targetChatId });
            
            const responseData = await new Promise<{ text: string; products: Product[] }>((resolve) => {
                setTimeout(() => {
                    resolve({
                        text: "Here are the top live product listings aggregated matching your request parameters:",
                        // Fallback fallback or dynamically mock items here
                        products: [] 
                    });
                }, 1000);
            });

            const assistantMessage: Message = {
                id: `ai_${Date.now()}`,
                sender: 'assistant',
                text: responseData.text,
                products: responseData.products,
                timestamp: Date.now()
            };

            // 3. Dispatch success payload back down to correct collection map slot
            dispatch({ 
                type: 'ADD_MESSAGE', 
                payload: { conversationId: targetChatId!, message: assistantMessage } 
            });
            dispatch({ type: 'SET_STATUS', payload: 'IDLE' });

        } catch (err: any) {
            dispatch({ 
                type: 'SET_ERROR', 
                payload: err?.message || 'Failed to sync with Soko AI engine. Check connectivity.' 
            });
        }
    };

    return (
        <ConversationContext.Provider value={{
            ...state,
            currentMessages,
            sendMessage,
            switchConversation,
            deleteConversation,
            startNewChatFrame
        }}>
            {children}
        </ConversationContext.Provider>
    );
}

// Custom hook guard statement to guarantee compile-time verification
export function useConversations() {
    const context = useContext(ConversationContext);
    if (!context) {
        throw new Error('useConversations must be used strictly within a ConversationProvider closure.');
    }
    return context;
}