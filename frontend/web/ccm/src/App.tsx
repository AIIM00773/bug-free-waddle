import React, { useState, useEffect, useRef, useCallback } from 'react';

// Context Providers
import { useAuth } from "./Providers/profileContext";
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
// import { MpesaModal } from './Components/globals/MpesaModal';
import { AuthOverlay } from './Components/globals/Auth';
import { HomeNotificationToast } from './Components/globals/homeNotificationToast';
import { LoadingScreen } from './Components/globals/LoadingScreen';

// Chat & Hyper-Local E-Commerce Components
import { EmptyState } from './Components/chat/EmptyState';
import { ChatFeed } from './Components/chat/ChatFeed';
import { ProductDetails } from './Components/chat/ProductDetails';

// ==========================================
// Helper: Safe SessionStorage Reader
// ==========================================
const getStorageState = (key: string, defaultValue = false): boolean => {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = sessionStorage.getItem(key);
    return item ? item === 'true' : defaultValue;
  } catch {
    return defaultValue;
  }
};

// ==========================================
// Hook: Modal Back Button Interceptor
// ==========================================
function useModalBackHandler(isOpen: boolean, onClose: () => void) {
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    window.history.pushState({ modalOpen: true }, '');

    const handlePopState = () => {
      onCloseRef.current();
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      if (window.history.state?.modalOpen) {
        window.history.back();
      }
    };
  }, [isOpen]);
}

// ==========================================
// Main Application Shell
// ==========================================
export default function App() {
  // Shopping mode UI Control Provider
  const { ShoppingMode, setShoppingMode, ModeLoading } = useShoppingMode();

  const {
    isAuthenticated,
    proceedWithoutAuth,
    isLoading
  } = useAuth();

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
    notification,
  } = useSearch();

  // E-Commerce / Cart Context
  const { showCheckoutModal, setShowCheckoutModal, handleAddToBasket } = useCart();

  // Local Modal Overlay states
  const [isProfileOpen, setIsProfileOpen] = useState(() => getStorageState('soko_isProfileOpen'));
  const [settingOpen, setSettingOpen] = useState(() => getStorageState('soko_settingOpen'));
  const [isOrdersOpen, setIsOrdersOpen] = useState(() => getStorageState('soko_isOrdersOpen'));
  const [isCartOpen, setIsCartOpen] = useState(() => getStorageState('soko_isCartOpen'));
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(() => getStorageState('soko_isCheckoutOpen'));

  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Persistence Effects
  useEffect(() => { sessionStorage.setItem('soko_isProfileOpen', String(isProfileOpen)); }, [isProfileOpen]);
  useEffect(() => { sessionStorage.setItem('soko_settingOpen', String(settingOpen)); }, [settingOpen]);
  useEffect(() => { sessionStorage.setItem('soko_isOrdersOpen', String(isOrdersOpen)); }, [isOrdersOpen]);
  useEffect(() => { sessionStorage.setItem('soko_isCartOpen', String(isCartOpen)); }, [isCartOpen]);
  useEffect(() => { sessionStorage.setItem('soko_isCheckoutOpen', String(isCheckoutOpen)); }, [isCheckoutOpen]);

  // Stable callbacks for modal closing
  const handleCloseFilters = useCallback(() => setFiltersOpen(false), [setFiltersOpen]);
  const handleCloseCheckoutModal = useCallback(() => setShowCheckoutModal(false), [setShowCheckoutModal]);
  const handleCloseProfile = useCallback(() => setIsProfileOpen(false), []);
  const handleCloseSettings = useCallback(() => setSettingOpen(false), []);
  const handleCloseOrders = useCallback(() => setIsOrdersOpen(false), []);
  const handleCloseCart = useCallback(() => setIsCartOpen(false), []);
  const handleCloseCheckout = useCallback(() => setIsCheckoutOpen(false), []);

  const handleCloseDetails = useCallback(() => {
    setSelectedProduct(null);
    setShowDetailsModal(false);
  }, []);

  const handleViewDetails = useCallback((product: any) => {
    setSelectedProduct(product);
    setShowDetailsModal(true);
  }, []);

  // Back-Button Modal Interceptors
  useModalBackHandler(filtersOpen, handleCloseFilters);
  useModalBackHandler(showDetailsModal, handleCloseDetails);
  useModalBackHandler(showCheckoutModal, handleCloseCheckoutModal);
  useModalBackHandler(isProfileOpen, handleCloseProfile);
  useModalBackHandler(settingOpen, handleCloseSettings);
  useModalBackHandler(isOrdersOpen, handleCloseOrders);
  useModalBackHandler(isCartOpen, handleCloseCart);
  useModalBackHandler(isCheckoutOpen, handleCloseCheckout);

  if (ModeLoading || isLoading) {
    return (
      <LoadingScreen
        message="Connecting to Neighborhood Merchants..."
        subtext="Preparing your local Soko experience..."
      />
    );
  }

  const isNavigationHidden = ShoppingMode !== "AI mode";

  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden bg-slate-50 font-sans text-slate-800 antialiased selection:bg-slate-900 selection:text-white">
      <AuthOverlay />
      {notification && <HomeNotificationToast notification={notification} />}

      {!isNavigationHidden && (
        <Header
          activeTab={ShoppingMode}
          setActiveTab={setShoppingMode}
          filtersOpen={filtersOpen}
          setFiltersOpen={setFiltersOpen}
        />
      )}

      {/* Main Shell Viewport */}
      <div className="flex flex-1 min-h-0 w-full overflow-hidden">
        {!isNavigationHidden && (proceedWithoutAuth || isAuthenticated) && (
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

        {/* Main Workspace Container */}
        <main className="relative flex flex-1 min-w-0 min-h-0 flex-col overflow-hidden bg-white">
          {!isNavigationHidden && (
            <div className="custom-scrollbar flex-1 min-h-0 overflow-y-auto px-4 py-6 md:px-8 md:py-8">
              <div className="mx-auto flex max-w-4xl w-full gap-8">
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
          onClose={handleCloseFilters}
          onApply={() => null}
        />

        <ProductDetails
          product={selectedProduct}
          isOpen={showDetailsModal}
          onClose={handleCloseDetails}
          onAddToBasket={handleAddToBasket}
        />

        {isCartOpen && <UserCart onBackToChat={handleCloseCart} />}
        {showCheckoutModal && <MpesaModal onSuccessPayment={appendSystemMessage} />}
        {isProfileOpen && <UserProfile onBackToChat={handleCloseProfile} />}
        {settingOpen && <UserSettings onBackToChat={handleCloseSettings} />}
        {isOrdersOpen && <UserOrders onBackToChat={handleCloseOrders} />}
        {isCheckoutOpen && <UserCheckout onBackToChat={handleCloseCheckout} />}
      </div>
    </div>
  );
}
