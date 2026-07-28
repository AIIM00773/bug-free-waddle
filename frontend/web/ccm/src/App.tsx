import React, { useState, useEffect } from 'react';

// Context Providers
import { useCart } from './Providers/CartContext';
import { useSearch } from './Providers/SearchContext';

// Global Layout Components
import { Sidebar } from './Components/globals/Sidebar';
import { Header } from './Components/globals/header';
import { FilterSidebar } from './Components/globals/filtersBar';
import { UserProfile } from './Components/globals/profile';
import { UserSettings } from './Components/globals/setting';
import { AuthOverlay } from './Components/globals/Auth';
import { HomeNotificationToast } from './Components/globals/homeNotificationToast';

// Chat Interface Components
import { EmptyState } from './Components/chat/EmptyState';
import { ChatFeed } from './Components/chat/ChatFeed';
import { ProductDetails } from './Components/chat/ProductDetails';

// Checkout Components
import { BasketDrawer } from './Components/checkout/BasketDrawer';
import { MpesaModal } from './Components/checkout/MpesaModal';

// Modal Back Button Interceptor
function useModalBackHandler(isOpen, onClose) {
  useEffect(() => {
    if (!isOpen) return;

    window.history.pushState({ modalOpen: true }, '');
    const handlePopState = () => onClose();

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      if (window.history.state?.modalOpen) {
        window.history.back();
      }
    };
  }, [isOpen, onClose]);
}

export default function App() {
  // Global Search & Session Context
  const {
    sessions,
    activeSessionId,
    setActiveSessionId,
    activeSession,
    handleDeleteSession,
    handleSendMessage,
    appendSystemMessage,
    activeEstate,
    filtersOpen,
    setFiltersOpen,
    activeTab,
    setActiveTab,
    notification,
  } = useSearch();

  // E-Commerce / Cart Context
  const { showCheckoutModal, setShowCheckoutModal, handleAddToBasket } =
    useCart();

  // Local Modal Overlay states
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [settingOpen, setSettingOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Modals Back-Button Handlers
  useModalBackHandler(filtersOpen, () => setFiltersOpen(false));
  useModalBackHandler(showDetailsModal, () => {
    setSelectedProduct(null);
    setShowDetailsModal(false);
  });
  useModalBackHandler(showCheckoutModal, () => setShowCheckoutModal(false));
  useModalBackHandler(isProfileOpen, () => setIsProfileOpen(false));
  useModalBackHandler(settingOpen, () => setSettingOpen(false));

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setShowDetailsModal(true);
  };

  const handleCloseDetails = () => {
    setSelectedProduct(null);
    setShowDetailsModal(false);
  };

  return (
  <>
         <AuthOverlay />

    <div className="flex h-screen overflow-hidden bg-[#191919] font-sans text-[#e3e3e3] antialiased">

      {notification && <HomeNotificationToast notification={notification} />}

      <Sidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        setActiveSessionId={setActiveSessionId}
        handleDeleteSession={handleDeleteSession}
        setIsProfileOpen={setIsProfileOpen}
        settingOpen={settingOpen}
        setSettingOpen={setSettingOpen}
      />


      <main className="relative flex flex-1 min-w-0 flex-col overflow-hidden bg-[#191919]">
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          filtersOpen={filtersOpen}
          setFiltersOpen={setFiltersOpen}
        />

        <div className="custom-scrollbar flex-1 overflow-y-auto px-8 py-8">
          <div className="mx-auto flex max-w-4xl gap-8">
            <div className="flex-1 min-w-0">
              {activeSession ? (
                <ChatFeed
                  messages={activeSession.messages}
                  onAddToBasket={handleAddToBasket}
                  onSendSuggested={handleSendMessage}
                  onViewDetails={handleViewDetails}
                />
              ) : (
                <EmptyState
                  activeEstate={activeEstate}
                  onSendSuggested={handleSendMessage}
                  onSendMessage={handleSendMessage}
                />
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Drawers & Overlays */}
      <FilterSidebar
        isOpen={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        onApply={() => null}
      />
      <BasketDrawer />
      <ProductDetails
        product={selectedProduct}
        isOpen={showDetailsModal}
        onClose={handleCloseDetails}
        onAddToBasket={handleAddToBasket}
      />
      {showCheckoutModal && (
        <MpesaModal onSuccessPayment={appendSystemMessage} />
      )}
      {isProfileOpen && (
        <UserProfile onBackToChat={() => setIsProfileOpen(false)} />
      )}
      {settingOpen && (
        <UserSettings onBackToChat={() => setSettingOpen(false)} />
      )}
    </div>
    </> 
  );
}
