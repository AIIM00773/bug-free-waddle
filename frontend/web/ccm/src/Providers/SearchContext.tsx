
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect
} from 'react';


import {  
  Search,
  Monitor
  } from "lucide-react"; 




import { NEIGHBORHOODS } from '../Constants/fakedb';
import { processQuery } from '../utils/queryProcessor';



export const DEFAULT_CARDS = [
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



const SearchContext = createContext(null);

export function SearchProvider({ children }) {
  // Neighborhood & Filtering state
  const [activeEstate, setActiveEstate] = useState(NEIGHBORHOODS[0]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Answer');
  const [inputText, setInputText] = useState('');
  const [defaultCards,setDefaultCards] = useState<any[]>([]);

  useEffect(()=>{setDefaultCards(DEFAULT_CARDS)},[])
   

  // Toast Notification state
  const [notification, setNotification] = useState(null);

  // Chat Session management state
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [sessions, setSessions] = useState([]);
  

  // Toast notification helper
  const showToast = useCallback((message, type = 'info') => {
    setNotification({ text: message, type });
    setTimeout(() => setNotification(null), 4000);
  }, []);

  // Delete a session
  const handleDeleteSession = useCallback((sessionId, e) => {
    if (e) e.stopPropagation();
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    setActiveSessionId((current) => (current === sessionId ? null : current));
    showToast('Conversation deleted', 'info');
  }, [showToast]);

  // Handle Query Submission and AI response processing
  const handleSendMessage = useCallback(
    (textToSend) => {
      const text = textToSend || inputText;
      if (!text || !text.trim()) return;

      setIsSearching(true);
      let currentSessionId = activeSessionId;
      const userMessage = {
        id: Date.now().toString(),
        sender: 'user',
        text: text.trim(),
      };

      // Create new session if no active session exists
      if (!currentSessionId) {
        currentSessionId = `session-${Date.now()}`;
        const newSession = {
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

      // Process query matching local catalog
      setTimeout(() => {
        const matchedProducts = processQuery(text);
        const aiResponseText =
          matchedProducts.length > 0
            ? `Nimepata hizi bidhaa karibu na wewe katika estate ya ${
                activeEstate?.name || 'mtaani'
              }. Zote ziko chini ya 500m:`
            : `Sijapata direct matches ya "${text}" hivi sasa. Lakini hapa kuna baadhi ya bidhaa karibu na wewe:`;

        const aiMessage = {
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

  // Helper to append system messages (e.g. M-Pesa receipts) directly to the active session
  const appendSystemMessage = useCallback((sysMsg) => {
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

  const activeSession = useMemo(
    () => sessions.find((s) => s.id === activeSessionId),
    [sessions, activeSessionId]
  );

  const value = {
    // Session state & actions
    sessions,
    activeSessionId,
    setActiveSessionId,
    activeSession,
    handleDeleteSession,
    handleSendMessage,
    appendSystemMessage,
    isSearching,

    // Input & Navigation
    inputText,
    setInputText,
    activeTab,
    setActiveTab,

    // Location & Filters
    activeEstate,
    setActiveEstate,
    filtersOpen,
    setFiltersOpen,

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
