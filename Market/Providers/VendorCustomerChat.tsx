import React, { createContext, useContext, useEffect, useState } from 'react';

// Enhanced Types
export interface ChatMessage {
  id: string;
  senderId: string;
  senderName?: string;
  content: string;
  sentAt: string;
  read?: boolean;
  type?: 'text' | 'image' | 'system';
}

export interface Conversation {
  id: string;
  participantName: string;
  participantId: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
  isOnline?: boolean;
  avatar?: string;
}

interface ChatContextType {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  messages: { [conversationId: string]: ChatMessage[] };
  loading: boolean;
  error: string | null;
  setActiveConversation: (conv: Conversation | null) => void;
  sendMessage: (conversationId: string, content: string) => Promise<void>;
  loadMessages: (conversationId: string) => Promise<void>;
  markAsRead: (conversationId: string) => void;
  createConversation: (participantId: string, participantName: string) => Conversation;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  // Enhanced State
  const [conversations, setConversations] = useState<Conversation[]>([]);




  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<{ [conversationId: string]: ChatMessage[] }>({});

  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load messages for a conversation
  const loadMessages = async (conversationId: string) => {
    setLoading(true);
    setError(null);

    try {
      // In a real app, this would fetch from API
      // For now, messages are already loaded in state
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (err) {
      setError('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  // Send message
  const sendMessage = async (conversationId: string, content: string) => {
    if (!content.trim()) return;

    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      senderId: 'current_user',
      senderName: 'You',
      content: content.trim(),
      sentAt: new Date().toISOString(),
      read: true,
      type: 'text'
    };

    // Update messages
    setMessages(prev => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), newMessage]
    }));

    // Update conversation
    setConversations(prev =>
      prev.map(conv =>
        conv.id === conversationId
          ? {
              ...conv,
              lastMessage: content.trim(),
              lastMessageTime: new Date().toISOString(),
              unreadCount: 0 // Reset unread count when sending
            }
          : conv
      )
    );

    // Simulate sending delay and potential response
    setTimeout(() => {
      // Simulate merchant response (20% chance)
      if (Math.random() < 0.2) {
        const conversation = conversations.find(c => c.id === conversationId);
        if (conversation) {
          const responseMessage: ChatMessage = {
            id: `msg_${Date.now()}_response`,
            senderId: conversation.participantId,
            senderName: conversation.participantName,
            content: 'Thank you for your message. We\'ll get back to you soon!',
            sentAt: new Date().toISOString(),
            read: false,
            type: 'text'
          };

          setMessages(prev => ({
            ...prev,
            [conversationId]: [...(prev[conversationId] || []), responseMessage]
          }));

          setConversations(prev =>
            prev.map(conv =>
              conv.id === conversationId
                ? {
                    ...conv,
                    lastMessage: responseMessage.content,
                    lastMessageTime: responseMessage.sentAt,
                    unreadCount: conv.unreadCount + 1
                  }
                : conv
            )
          );
        }
      }
    }, 2000);

    // In MVP, you'd trigger your API call here
    // await api.post(`/chat/${conversationId}/messages`, { content });
  };

  // Mark conversation as read
  const markAsRead = (conversationId: string) => {
    setConversations(prev =>
      prev.map(conv =>
        conv.id === conversationId
          ? { ...conv, unreadCount: 0 }
          : conv
      )
    );

    // Mark messages as read
    setMessages(prev => ({
      ...prev,
      [conversationId]: prev[conversationId]?.map(msg => ({ ...msg, read: true })) || []
    }));
  };

  // Create new conversation
  const createConversation = (participantId: string, participantName: string): Conversation => {
    const newConversation: Conversation = {
      id: `conv_${Date.now()}`,
      participantId,
      participantName,
      unreadCount: 0,
      isOnline: Math.random() > 0.5,
      avatar: `https://api.drop.com/avatars/${participantId}.jpg`
    };

    setConversations(prev => [newConversation, ...prev]);
    setMessages(prev => ({ ...prev, [newConversation.id]: [] }));

    return newConversation;
  };

  // Auto-load messages when active conversation changes
  useEffect(() => {
    if (activeConversation) {
      loadMessages(activeConversation.id);
    }
  }, [activeConversation]);

  return (
    <ChatContext.Provider value={{
      conversations,
      activeConversation,
      messages,
      loading,
      error,
      setActiveConversation,
      sendMessage,
      loadMessages,
      markAsRead,
      createConversation
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChat must be used within ChatProvider');
  return context;
};