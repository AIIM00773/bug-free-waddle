import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';
import { Search, Monitor } from 'lucide-react';

import { NEIGHBORHOODS } from '../Constants/fakedb';
import { processQuery } from '../utils/queryProcessor';

// ==========================================
// Types & Constants
// ==========================================

export const SEARCH_TYPES = [
  'Direct Search',
  'Intelligent Search',
  'Web Search',
  'Local Search',
] as const;


type tabsType = ['AI mode', "catalog", 'shops'];

export type SearchType = (typeof SEARCH_TYPES)[number];

export interface CardItem {
  id: string;
  icon: any;
  title: string;
  description: string;
  query: string;
  gradient: string;
  accentColor: string;
  badge?: string;
}

export interface Message {
  id: string;
  sender: 'user' | 'ai' | 'system';
  text: string;
  products?: any[];
}

export interface Session {
  id: string;
  title: string;
  messages: Message[];
}

export interface Notification {
  text: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export const DEFAULT_CARDS: CardItem[] = [
  {
    id: 'search',
    icon: Search,
    title: 'Search anything',
    description: 'Get fast and accurate answers from the most trusted sources.',
    query: 'Search products and local deals',
    gradient: 'from-[#0d4f54] to-[#0c383c]',
    accentColor: 'text-teal-400',
  },
  {
    id: 'computer',
    icon: Monitor,
    title: 'Get work done with Computer',
    badge: 'NEW',
    description:
      'Hand off your projects to get polished, reliable deliverables around the clock.',
    query: 'Help me find the best deals near me',
    gradient: 'from-[#0d343a] to-[#0a2328]',
    accentColor: 'text-teal-400',
  },
];

// ==========================================
// Context & Provider Setup
// ==========================================

interface SearchContextType {
  // Session State
  sessions: Session[];
  activeSessionId: string | null;
  setActiveSessionId: React.Dispatch<React.SetStateAction<string | null>>;
  activeSession: Session | undefined;
  isSearching: boolean;
  handleDeleteSession: (sessionId: string, e?: React.MouseEvent) => void;
  handleSendMessage: (textToSend?: string) => void;
  appendSystemMessage: (sysMsg: Message) => void;

  // Input & Tabs
  inputText: string;
  setInputText: React.Dispatch<React.SetStateAction<string>>;
  activeTab: tabsType;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;

  // Location & Filters
  activeEstate: any;
  setActiveEstate: React.Dispatch<React.SetStateAction<any>>;
  filtersOpen: boolean;
  setFiltersOpen: React.Dispatch<React.SetStateAction<boolean>>;

  // Search Types & Cards
  searchTypes: typeof SEARCH_TYPES;
  activeSearchType: SearchType;
  setActiveSearchType: React.Dispatch<React.SetStateAction<SearchType>>;
  defaultCards: CardItem[];

  // Toast Notifications
  notification: Notification | null;
  showToast: (message: string, type?: Notification['type']) => void;
}



const SearchContext = createContext<SearchContextType | null>(null);

export function SearchProvider({ children }: { children: ReactNode }) {
  // Neighborhood & Filtering State
  const [activeEstate, setActiveEstate] = useState(NEIGHBORHOODS[0]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('AI mode');
  const [inputText, setInputText] = useState('');
  const [activeSearchType, setActiveSearchType] = useState<SearchType>('Direct Search');

  // Chat Session Management
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Toast Notifications
  const [notification, setNotification] = useState<Notification | null>(null);

  // Helper: Toast Notifications
  const showToast = useCallback((message: string, type: Notification['type'] = 'info') => {
    setNotification({ text: message, type });
    setTimeout(() => setNotification(null), 4000);
  }, []);

  // Helper: Delete Session
  const handleDeleteSession = useCallback(
    (sessionId: string, e?: React.MouseEvent) => {
      if (e) e.stopPropagation();
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      setActiveSessionId((current) => (current === sessionId ? null : current));
      showToast('Conversation deleted', 'info');
    },
    [showToast]
  );

  // Helper: Send Message & Get AI Response
  const handleSendMessage = useCallback(
    (textToSend?: string) => {
      const text = textToSend || inputText;
      if (!text || !text.trim()) return;

      setIsSearching(true);
      let currentSessionId = activeSessionId;
      const userMessage: Message = {
        id: Date.now().toString(),
        sender: 'user',
        text: text.trim(),
      };

      // Create new session if none exists
      if (!currentSessionId) {
        currentSessionId = `session-${Date.now()}`;
        const newSession: Session = {
          id: currentSessionId,
          title: text.length > 22 ? `${text.slice(0, 22)}...` : text,
          messages: [userMessage],
        };
        setSessions((prev) => [newSession, ...prev]);
        setActiveSessionId(currentSessionId);
      } else {
        setSessions((prev) =>
          prev.map((s) =>
            s.id === currentSessionId
              ? { ...s, messages: [...s.messages, userMessage] }
              : s
          )
        );
      }

      setInputText('');

      // Process Query & AI Response
      setTimeout(() => {
        const matchedProducts = processQuery(text);
        const aiResponseText =
          matchedProducts.length > 0
            ? `Nimepata hizi bidhaa karibu na wewe katika estate ya ${
                activeEstate?.name || 'mtaani'
              }. Zote ziko chini ya 500m:`
            : `Sijapata direct matches ya "${text}" hivi sasa. Lakini hapa kuna baadhi ya bidhaa karibu na wewe:`;

        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: aiResponseText,
          products: matchedProducts.length > 0 ? matchedProducts : [],
        };

        setSessions((prev) =>
          prev.map((s) =>
            s.id === currentSessionId
              ? { ...s, messages: [...s.messages, aiMessage] }
              : s
          )
        );
        setIsSearching(false);
      }, 1000);
    },
    [inputText, activeSessionId, activeEstate]
  );

  // Helper: Append System Messages (e.g. M-Pesa receipts)
  const appendSystemMessage = useCallback((sysMsg: Message) => {
    setActiveSessionId((currentId) => {
      if (currentId) {
        setSessions((prev) =>
          prev.map((s) =>
            s.id === currentId
              ? { ...s, messages: [...s.messages, sysMsg] }
              : s
          )
        );
      }
      return currentId;
    });
  }, []);

  // Current Active Session Object
  const activeSession = useMemo(
    () => sessions.find((s) => s.id === activeSessionId),
    [sessions, activeSessionId]
  );

  const value: SearchContextType = {
    // Sessions
    sessions,
    activeSessionId,
    setActiveSessionId,
    activeSession,
    handleDeleteSession,
    handleSendMessage,
    appendSystemMessage,
    isSearching,

    // Inputs & Tabs
    inputText,
    setInputText,
    activeTab,
    setActiveTab,

    // Location & Filters
    activeEstate,
    setActiveEstate,
    filtersOpen,
    setFiltersOpen,

    // Search Types & Static Config
    searchTypes: SEARCH_TYPES,
    activeSearchType,
    setActiveSearchType,
    defaultCards: DEFAULT_CARDS,

    // Notifications
    notification,
    showToast,
  };

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}
