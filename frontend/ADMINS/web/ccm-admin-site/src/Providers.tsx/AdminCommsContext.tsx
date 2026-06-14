


import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAdminAuth } from './AdminAuthAndProfileContext';

export interface Message {
  id: string;
  room_id: string;
  sender_username: string;
  sender_display_name: string;
  text: string;
  timestamp: string;
  is_system_log: boolean;
}

export interface ChatRoom {
  id: string;
  name: string;
  type: 'public' | 'secure';
  description: string;
}

interface OperationsChatContextType {
  rooms: ChatRoom[];
  activeRoomId: string;
  setActiveRoomId: (id: string) => void;
  roomMessages: Record<string, Message[]>; // Keyed by room_id for perfect isolation
  sendMessage: (text: string) => Promise<void>;
  unreadCounts: Record<string, number>;
  clearUnread: (roomId: string) => void;
  isConnecting: boolean;
}

const OperationsChatContext = createContext<OperationsChatContextType | undefined>(undefined);

export const operationalRoomsList: ChatRoom[] = [
  { id: 'ops-general', name: 'ops-general', type: 'public', description: 'Standard inter-departmental communications canvas' },
  { id: 'data-engine-logs', name: 'data-engine-logs', type: 'secure', description: 'Scraper execution metrics and database update outputs' },
  { id: 'merchant-relations', name: 'merchant-relations', type: 'public', description: 'Partner onboarding sync and verification queues' },
];

export function OperationsChatProvider({ children }: { children: React.ReactNode }) {
  const { adminUser } = useAdminAuth();
  const [activeRoomId, setActiveRoomId] = useState<string>('ops-general');
  const [isConnecting, setIsConnecting] = useState<boolean>(true);
  
  // Isolate histories by room ID to prevent layout bleeding
  const [roomMessages, setRoomMessages] = useState<Record<string, Message[]>>({
    'ops-general': [
      { id: 'g1', room_id: 'ops-general', sender_username: 'system', sender_display_name: 'SYSTEM', text: 'Secure operations channel initialized.', timestamp: '08:00 AM', is_system_log: true },
      { id: 'g2', room_id: 'ops-general', sender_username: 'amina_ops', sender_display_name: 'Amina Ops', text: 'Reviewing currency matrix variances across Kenyan marketplaces now.', timestamp: '09:20 AM', is_system_log: false },
    ],
    'data-engine-logs': [
      { id: 'd1', room_id: 'data-engine-logs', sender_username: 'system', sender_display_name: 'SCRAPER_ENGINE', text: 'SUCCESS: Pipeline pulled 1,400 entry records from Jumia Core.', timestamp: '09:14 AM', is_system_log: true },
    ],
    'merchant-relations': [],
  });

  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({
    'ops-general': 0,
    'data-engine-logs': 2, // Preload unread markers for realism
    'merchant-relations': 0,
  });

  // Clear unreads safely on target change
  const clearUnread = useCallback((roomId: string) => {
    setUnreadCounts(prev => prev[roomId] ? { ...prev, [roomId]: 0 } : prev);
  }, []);

  useEffect(() => {
    clearUnread(activeRoomId);
  }, [activeRoomId, clearUnread]);

  // Simulate gateway initialization shakeout
  useEffect(() => {
    const timer = setTimeout(() => setIsConnecting(false), 600);
    return () => clearTimeout(timer);
  }, []);

  // Production asynchronous transaction dispatcher
  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    // Simulate standard asynchronous network flight latency
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const generatedMessage: Message = {
          id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          room_id: activeRoomId,
          sender_username: adminUser?.username || 'operator',
          sender_display_name: adminUser ? `${adminUser.first_name} ${adminUser.last_name || ''}`.trim() : 'Operator Node',
          text: text.trim(),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          is_system_log: false,
        };

        setRoomMessages(prev => ({
          ...prev,
          [activeRoomId]: [...(prev[activeRoomId] || []), generatedMessage]
        }));
        resolve();
      }, 80); // Sub-100ms processing threshold simulation
    });
  }, [activeRoomId, adminUser]);

  return (
    <OperationsChatContext.Provider value={{
      rooms: operationalRoomsList,
      activeRoomId,
      setActiveRoomId,
      roomMessages,
      sendMessage,
      unreadCounts,
      clearUnread,
      isConnecting
    }}>
      {children}
    </OperationsChatContext.Provider>
  );
}

export function useOperationsChat() {
  const context = useContext(OperationsChatContext);
  if (context === undefined) {
    throw new Error('useOperationsChat must be initialized within an OperationsChatProvider wrapping ecosystem');
  }
  return context;
}