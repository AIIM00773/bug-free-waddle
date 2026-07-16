import React, { useState, useEffect } from 'react';
import { NEIGHBORHOODS } from "./Constants/fakedb"; 
import { processQuery } from "./utils/queryProcessor";

import { Sidebar } from "./Components/globals/Sidebar";
import { Header } from "./Components/globals/Header";

import { EmptyState } from "./Components/chat/EmptyState";
import { ChatFeed } from "./Components/chat/ChatFeed";
import { ChatInput } from "./Components/chat/ChatInput";
import { ProductDetails } from "./Components/chat/ProductDetails"; // Imported here!

import { BasketDrawer } from "./Components/checkout/BasketDrawer";
import { MpesaModal } from "./Components/checkout/MpesaModal";

import { Sparkles } from 'lucide-react';

export default function App() {
  // Global States
  const [activeEstate, setActiveEstate] = useState(NEIGHBORHOODS[0]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [cart, setCart] = useState([]);
  const [notification, setNotification] = useState(null);

  // Session Management
  const [sessions, setSessions] = useState([
    {
      id: 'welcome-session',
      title: 'Mboga za jioni',
      messages: [
        {
          id: 'welcome',
          sender: 'ai',
          text: "Habari! I am your Soko AI neighborhood assistant. Tell me what you're looking for today in Sheng, Swahili, or English. I'll search local kiosks within 500 meters.",
          suggestions: true
        }
      ]
    }
  ]);
  const [activeSessionId, setActiveSessionId] = useState(null); // null = Empty "New Search" state

  // Checkout States
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [mpesaStatus, setMpesaStatus] = useState('idle'); // 'idle' | 'sending' | 'pin_prompted' | 'success'
  const [mpesaPhone, setMpesaPhone] = useState('+254712345678');
  const [deliveryNote, setDeliveryNote] = useState('Opposite water dispenser, Plot 4B, 2nd Floor');

  // Product Details Integration States
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Utility toast system
  const showToast = (message, type = 'info') => {
    setNotification({ text: message, type });
  };

  // Automatically dismiss notifications
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleAddToBasket = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        showToast(`Increased quantity of ${product.name}`, 'success');
        return prev.map(item => 
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      showToast(`Added ${product.name} to basket`, 'success');
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateCartQty = (id, change) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === id) {
        const nextQty = item.quantity + change;
        return nextQty > 0 ? { ...item, quantity: nextQty } : null;
      }
      return item;
    }).filter(Boolean));
  };

  // View Details Event Handlers
  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setShowDetailsModal(true);
  };

  const handleCloseDetails = () => {
    setSelectedProduct(null);
    setShowDetailsModal(false);
  };

  // Chat Submission Core Logic
  const handleSendMessage = (textToSend) => {
    if (!textToSend.trim()) return;

    let currentSessionId = activeSessionId;
    const userMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend
    };

    // If no session is active, dynamically spin up a new session
    if (!currentSessionId) {
      currentSessionId = `session-${Date.now()}`;
      const newSession = {
        id: currentSessionId,
        title: textToSend.length > 22 ? `${textToSend.slice(0, 22)}...` : textToSend,
        messages: [userMessage]
      };
      setSessions(prev => [newSession, ...prev]);
      setActiveSessionId(currentSessionId);
    } else {
      setSessions(prev => prev.map(s => 
        s.id === currentSessionId ? { ...s, messages: [...s.messages, userMessage] } : s
      ));
    }

    // AI thinking state response simulation
    setTimeout(() => {
      const matchedProducts = processQuery(textToSend);
      const aiResponseText = matchedProducts.length > 0 
        ? `Nimepata hizi bidhaa karibu na wewe katika estate ya ${activeEstate.name}. Zote ziko chini ya 500m:`
        : `Sijapata direct matches ya "${textToSend}" hivi sasa. Lakini hapa kuna baadhi ya bidhaa karibu na wewe:`;

      const aiMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: aiResponseText,
        products: matchedProducts.length > 0 ? matchedProducts : []
      };

      setSessions(prev => prev.map(s => 
        s.id === currentSessionId ? { ...s, messages: [...s.messages, aiMessage] } : s
      ));
    }, 1000);
  };

  // Active Session Resolution
  const activeSession = sessions.find(s => s.id === activeSessionId);

  const handleDeleteSession = (sessionId, e) => {
    e.stopPropagation();
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    if (activeSessionId === sessionId) {
      setActiveSessionId(null);
    }
    showToast("Conversation deleted", "info");
  };

  return (
    <div className="flex h-screen bg-stone-950 text-stone-100 font-sans antialiased overflow-hidden">
      
      {/* Toast Notification System */}
      {notification && (
        <div className="fixed top-4 right-4 z-[99] max-w-sm bg-stone-900 border border-amber-500/30 rounded-xl px-4 py-3.5 shadow-2xl flex items-center gap-2.5 text-xs animate-in fade-in slide-in-from-top-5 duration-300">
          <Sparkles className="text-amber-400 shrink-0" size={15} />
          <span className="font-semibold text-stone-200">{notification.text}</span>
        </div>
      )}

      {/* Navigation Header */}
      <Header setSidebarOpen={setSidebarOpen} cart={cart} />

      {/* State-controlled Responsive Sidebar */}
      <Sidebar 
        sessions={sessions}
        activeSessionId={activeSessionId}
        setActiveSessionId={setActiveSessionId}
        handleDeleteSession={handleDeleteSession}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      /> 

      {/* Mobile Backdrop Overlay */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}  
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-all duration-300"
        />
      )}
      
      {/* Core Workspace Frame */}
      <section className="flex-1 flex flex-col bg-[#141b24] relative min-w-0 pt-14 md:pt-0">
      
        <div className="flex-1 overflow-y-auto px-0 md:px-8 py-6 pb-32">
          {activeSession ? (
            <ChatFeed 
              messages={activeSession.messages} 
              onAddToBasket={handleAddToBasket} 
              onSendSuggested={handleSendMessage} 
              onViewDetails={handleViewDetails} // Bound Action!
            />
          ) : (
            <EmptyState 
              activeEstate={activeEstate} 
              onSendSuggested={handleSendMessage} 
            />
          )}
        </div>

        {/* Input Bar pinned to the bottom layout */}
        <ChatInput onSendMessage={handleSendMessage} activeEstate={activeEstate} />
      </section>

      {/* Cart Slider Drawer */}
      <BasketDrawer 
        cart={cart}  
        setCart={setCart} 
        updateCartQty={updateCartQty}  
        deliveryNote={deliveryNote} 
        triggerCheckout={() => setShowCheckoutModal(true)} 
        showToast={showToast} 
      />

      {/* Product Details overlay Modal */}
      <ProductDetails 
        product={selectedProduct}
        isOpen={showDetailsModal}
        onClose={handleCloseDetails}
        onAddToBasket={handleAddToBasket}
      />

      {/* MPESA Direct Payment Simulator Dialog */}
      {showCheckoutModal && (
        <MpesaModal 
          cart={cart} 
          setCart={setCart} 
          mpesaPhone={mpesaPhone} 
          setMpesaPhone={setMpesaPhone}
          mpesaStatus={mpesaStatus}
          setMpesaStatus={setMpesaStatus}
          deliveryNote={deliveryNote}
          closeModal={() => setShowCheckoutModal(false)}
          showToast={showToast}
          onSuccessPayment={(sysMsg) => {
            if (activeSessionId) {
              setSessions(prev => prev.map(s => 
                s.id === activeSessionId ? { ...s, messages: [...s.messages, sysMsg] } : s
              ));
            }
          }}
        />
      )}
    </div>
  );
}
