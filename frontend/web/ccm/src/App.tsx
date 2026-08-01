import React, { useState, useEffect } from 'react';

// Context Providers
import { useCart } from './Providers/CartContext';
import { useSearch } from './Providers/SearchContext';
import { useShoppingMode } from './Providers/ui/ShoppingModeManager';

// Global Layout Components
import { Sidebar } from './Components/globals/Sidebar';
import { Header } from './Components/globals/header';
import { FilterSidebar } from './Components/globals/filtersBar';
import { UserProfile } from './Components/globals/profile';
import { UserSettings } from './Components/globals/setting';
import { UserCart } from './Components/globals/cart'; 
import { UserOrders } from './Components/globals/Orders';
import { UserCheckout } from './Components/globals/checkout';
import { AuthOverlay } from './Components/globals/Auth';
import { HomeNotificationToast } from './Components/globals/homeNotificationToast';
import { LoadingScreen } from './Components/globals/LoadingScreen';

// Chat & Hyper-Local E-Commerce Components
import { EmptyState } from './Components/chat/EmptyState';
import { ChatFeed } from './Components/chat/ChatFeed';
import { ProductDetails } from './Components/chat/ProductDetails';

// Checkout Components
import { MpesaModal } from './Components/checkout/MpesaModal';

// ==========================================
// Hook: Modal Back Button Interceptor
// ==========================================
function useModalBackHandler(isOpen: boolean, onClose: () => void) {
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

// ==========================================
// Main Application Shell
// ==========================================
export default function App() {
  // Shopping mode UI Control Provider
  const { ShoppingMode, setShoppingMode, ModeLoading } = useShoppingMode();

  // Global Search & Session Context (100% Merchant-Provided Engine)
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
    notification,
  } = useSearch();

  // E-Commerce / Cart Context
  const { showCheckoutModal, setShowCheckoutModal, handleAddToBasket } = useCart();

  // Local Modal Overlay states with Session Persistence via sessionStorage
  const [isProfileOpen, setIsProfileOpen] = useState(() => {
    return sessionStorage.getItem('soko_isProfileOpen') === 'true';
  });
  
  const [settingOpen, setSettingOpen] = useState(() => {
    return sessionStorage.getItem('soko_settingOpen') === 'true';
  });

  const [isOrdersOpen, setIsOrdersOpen] = useState(() => {
    return sessionStorage.getItem('soko_isOrdersOpen') === 'true';
  });

  const [isCartOpen, setIsCartOpen] = useState(() => {
    return sessionStorage.getItem('soko_isCartOpen') === 'true';
  });

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(() => {
    return sessionStorage.getItem('soko_isCheckoutOpen') === 'true';
  });

  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Sync modal states to sessionStorage on change
  useEffect(() => {
    sessionStorage.setItem('soko_isProfileOpen', String(isProfileOpen));
  }, [isProfileOpen]);

  useEffect(() => {
    sessionStorage.setItem('soko_settingOpen', String(settingOpen));
  }, [settingOpen]);

  useEffect(() => {
    sessionStorage.setItem('soko_isOrdersOpen', String(isOrdersOpen));
  }, [isOrdersOpen]);

  useEffect(() => {
    sessionStorage.setItem('soko_isCartOpen', String(isCartOpen));
  }, [isCartOpen]);

  useEffect(() => {
    sessionStorage.setItem('soko_isCheckoutOpen', String(isCheckoutOpen));
  }, [isCheckoutOpen]);

  // Modals Back-Button Handlers
  useModalBackHandler(filtersOpen, () => setFiltersOpen(false));
  useModalBackHandler(showDetailsModal, () => {
    setSelectedProduct(null);
    setShowDetailsModal(false);
  });
  useModalBackHandler(showCheckoutModal, () => setShowCheckoutModal(false));
  useModalBackHandler(isProfileOpen, () => setIsProfileOpen(false));
  useModalBackHandler(settingOpen, () => setSettingOpen(false));
  useModalBackHandler(isOrdersOpen, () => setIsOrdersOpen(false));
  useModalBackHandler(isCartOpen, () => setIsCartOpen(false));
  useModalBackHandler(isCheckoutOpen, () => setIsCheckoutOpen(false));

  const handleViewDetails = (product: any) => {
    setSelectedProduct(product);
    setShowDetailsModal(true);
  };

  const handleCloseDetails = () => {
    setSelectedProduct(null);
    setShowDetailsModal(false);
  };

  // Render Soko AI Clean Loader
  if (ModeLoading) {
    return (
      <LoadingScreen
        message="Connecting to Neighborhood Merchants..."
        subtext="Preparing your local Soko experience..."
      />
    );
  }

  const isNavigationHidden = ShoppingMode !== "AI mode";

  return (
    <>
      <AuthOverlay />

      {/* Outer Shell: Switched from dark #0d0f12 to Soko AI clean editorial slate-50 */}
      <div className="flex h-screen overflow-hidden bg-slate-50 font-sans text-slate-800 antialiased selection:bg-[#3C3147] selection:text-white">
        {notification && <HomeNotificationToast notification={notification} />}

        {!isNavigationHidden && (
          <Sidebar
            sessions={sessions}
            activeSessionId={activeSessionId}
            setActiveSessionId={setActiveSessionId}
            handleDeleteSession={handleDeleteSession}
            setIsProfileOpen={setIsProfileOpen}
            settingOpen={settingOpen}
            setSettingOpen={setSettingOpen}
            setIsOrdersOpen={setIsOrdersOpen}
            isOrdersOpen={isOrdersOpen}
            isCartOpen={isCartOpen}
            setIsCartOpen={setIsCartOpen}
            isCheckoutOpen={isCheckoutOpen}
            setIsCheckoutOpen={setIsCheckoutOpen}
          />
        )}

        {/* Main Content Area */}
        <main className="relative flex flex-1 min-w-0 flex-col overflow-hidden bg-white/80">
          {!isNavigationHidden && (
            <Header
              activeTab={ShoppingMode}
              setActiveTab={setShoppingMode}
              filtersOpen={filtersOpen}
              setFiltersOpen={setFiltersOpen}
            />
          )}

          {!isNavigationHidden && (
            <div className="custom-scrollbar flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-8">
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
          )}
        </main>

        {/* Drawers & Overlays */}
        <FilterSidebar
          isOpen={filtersOpen}
          onClose={() => setFiltersOpen(false)}
          onApply={() => null}
        />

        <ProductDetails
          product={selectedProduct}
          isOpen={showDetailsModal}
          onClose={handleCloseDetails}
          onAddToBasket={handleAddToBasket}
        />

        {isCartOpen && (
          <UserCart onBackToChat={() => setIsCartOpen(false)} /> 
        )}

        {showCheckoutModal && (
          <MpesaModal onSuccessPayment={appendSystemMessage} />
        )}

        {isProfileOpen && (
          <UserProfile onBackToChat={() => setIsProfileOpen(false)} />
        )}

        {settingOpen && (
          <UserSettings onBackToChat={() => setSettingOpen(false)} />
        )}

        {isOrdersOpen && (
          <UserOrders onBackToChat={() => setIsOrdersOpen(false)} />
        )}

        {isCheckoutOpen && (
          <UserCheckout onBackToChat={() => setIsCheckoutOpen(false)} />
        )}
      </div>
    </>
  );
}
