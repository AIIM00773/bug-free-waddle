// --- Types (Aligned for Production) ---

export interface AIresponseContent {
    explanation?: string;
    followupSurgestions: Array<{ label: string }>;
    confidenceScore?: number;
    remarks?: string;
}

export interface AIResponse {
    type: "error" | 'product_recommendation' | 'search_result' | 'follow_up';
    content: AIresponseContent;
    is_final?: boolean;
    is_liked?: boolean;
    is_disliked?: boolean;
    remarks?: string;
    products:any[]; 
}

export interface UserSearchQuery {
    text: string;
    filters?: any[];
}

export interface ConversationHistoryItem {
    id: String | any,
    MessageFromUser: UserSearchQuery;
    agent_response: AIResponse | null;
    hasBeenStreamed?: boolean;
}

export interface User_And_Agent_Conversation_Session {
        title:string; 

    conversationId: string;
    conversationTitle: string;
    conversationStatus: 'active' | 'archived' | 'notactive';
    conversationHistory: ConversationHistoryItem[];
    is_liked: boolean;
    is_disliked: boolean;
    is_pinned: boolean;
    last_update: string;
}

export interface ConversationContextType {
    // State

    conversations: User_And_Agent_Conversation_Session[];
    currentConversation: User_And_Agent_Conversation_Session | null;
    
    // Core Logic (The Engines)
    performNewSearch: (activePrompt: UserSearchQuery) => Promise<void>;
    performFollowupSearch: (activePrompt: UserSearchQuery, conversationID: string) => Promise<void>;
    
    // UI Helpers (The Steering Wheel)
    switchConversation: (id: string) => void;
    closeConversation: () => void;
    deleteConversation: (id: string) => Promise<void>;
    markMessageAsStreamed: (convId: string, index: number) => Promise<void>;
    ConverationsInit:()=>void;

}