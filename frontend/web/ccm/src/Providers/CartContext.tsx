import React, { createContext, useContext, useState, useMemo } from 'react';
import {
  Bookmark,
  Check,
  CheckCircle2,
  MapPin,
  ShoppingCart,
  Sparkles,
  Store,
  Trash2,
  Truck,
  ArrowRight,
  Flame ,
} from "lucide-react";

// ==================== INTERFACES ====================




export interface VendorType {
  merchant: {
    id: string;
    name: string;
    ratting: number;
    active: boolean;
    verified: boolean;
    male: boolean;
    female: boolean;

    location: {
      country?: string;
      county?: string;
      subcounty?: string;
      city?: string;
      town?: string;
      streetAddress?: string;
    };

    gpsmetadata: {
      latitude?: number;
      longitude?: number;
      altitude?: number;
      accuracy_m?: number;
      timestamp?: string;
    };

  };
};





export interface ItemType {
  id: string;
  title: string;
  description: string;
  price: number;
  discount: number;
  ratting: number;
  base_image: string;
  gallery: string[];
  brand: string;
  category: string;
  requires_kyc: boolean;
  in_stock:boolean;
  created_timestamp?: string;
  updated_timestamp?: string;


};



export interface CartItem {
  count: number;
  added_timestamp?: string;
  merchant: VendorType;
  product: ItemType;
  price: number; // at add time 
  discount:number; // at add time  
}


export interface VendorBasedGrouping {
  merchant: VendorType;
  products: ItemType[];
};



interface CartContextType {
  // UI-CONTEXTS
  legibleForCheckout:boolean;
  cartLoading: boolean;
  cartActive: boolean;
  tabs:any[];
  activeTab: string;
  isNavMinimized: boolean;
  setCartLoading: (loading: boolean) => void;
  setCartActive: (active: boolean) => void;
  setActiveTab: (tab: string) => void;
  setIsNavMinimized: (minimized: boolean) => void;

  // PROCESS-CONTEXTS
  isCheckingOut: boolean;
  placingOrder: boolean;
  orderPlaced: boolean;
  notification: string | null;
  showNotification: (message: string | null) => void;

  // CART-CONTEXTS
  items: CartItem[];
  savedItems: CartItem[];
  paymentMethod: 'mpesa_express' | 'pay_on_delivery';
  mpesaPhoneNumber: string;
  runnerFee: number;
  subtotal: number;
  totalDue: number;
  totalItems: number;
  deliveryAddressId: string | null;
  deliveryAddress:string | null; 


  setPaymentMethod: (method: 'mpesa_express' | 'pay_on_delivery') => void;
  setMpesaPhoneNumber: (number: string) => void;
  setDeliveryAddressId: (id: string | null) => void;
  syncDeliveryAddress:()=>void; 
  editDeliveryAddress:(newddress:string)=> void;
  
  addItem: (item: CartItem) => void;
  moveToSaved: (item: CartItem) => void;
  moveToCart: (item: CartItem) => void;
  removeItemFromCart: (productId: string) => void;
  removeItemFromSaved: (productId: string) => void;
  updateQty: (productId: string, count: number) => void;
  clearCart: () => void;
  clearSaved: () => void;
  submitCheckout: () => Promise<any>;
  handleCheckout:() => Promise<any|void>; 


  // MULTI-VENDOR HANDLING
  groupedCartItems: VendorBasedGrouping[];
};






// ==================== CONTEXT CREATION ====================

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
 


  // UI States
  const [cartLoading, setCartLoading] = useState<boolean>(false);
  const [cartActive, setCartActive] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('active');
  const [isNavMinimized, setIsNavMinimized] = useState<boolean>(false);
  const [legibleForCheckout,setLegibleForCheckout] = useState<boolean>(false);


  // Process States
  const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false);
  const [placingOrder] = useState<boolean>(false);
  const [orderPlaced] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);


  // Cart & Saved States
  const [items, setItems] = useState<CartItem[]>([]);
  const [savedItems, setSavedItems] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'mpesa_express' | 'pay_on_delivery'>('mpesa_express');
  const [mpesaPhoneNumber, setMpesaPhoneNumber] = useState<string>('+254');
  const [deliveryAddressId, setDeliveryAddressId] = useState<string | null>(null);
  const [runnerFee] = useState<number>(100.00); // Fixed KES 100 runner fee


  // Notification Handler helper
  const showNotification = (message: string | null) => {
    setNotification(message);
    if (message) {
      setTimeout(() => setNotification(null), 4000);
    }
  };


    const tabs = [
    {
      id: "active" as const,
      label: "Cart",
      icon: ShoppingCart,
      count: items.length,
    },
    {
      id: "saved" as const,
      label: "Saved ",
      icon: Bookmark,
      count: savedItems.length,
    },

    {
      id: "saved" as const,
      label: "Finds",
      icon: Flame ,
      count: savedItems.length,
    },

  ];






  // Computed Totals
  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + (item.price * item.count), 0);
  }, [items]);


  const totalDue = useMemo(() => {
    return subtotal + (items.length > 0 ? runnerFee : 0);
  }, [subtotal, runnerFee, items.length]);


  const totalItems = useMemo(() => {
    return items.reduce((sum, item) => sum + item.count, 0);
  }, [items]);


  // Multi-vendor Grouping Calculation
  const groupedCartItems = useMemo(() => {
    const groupMap: Record<string, VendorBasedGrouping> = {};
    
    items.forEach(cartItem => {
      const merchantId = cartItem.merchant.merchant.id;
      if (!groupMap[merchantId]) {
        groupMap[merchantId] = {
          merchant: cartItem.merchant,
          products: []
        };
      }
      groupMap[merchantId].products.push(cartItem.product);
    });

    return Object.values(groupMap);
  }, [items]);




  // Cart Actions
  const addItem = (newItem: CartItem) => {
    setItems(prev => {
      const existingIndex = prev.findIndex(i => i.product.id === newItem.product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].count += newItem.count;
        return updated;
      }
      return [...prev, newItem];
    });
    showNotification('Item added to cart');
  };


  const removeItemFromCart = (productId: string) => {
    setItems(prev => prev.filter(i => i.product.id !== productId));
  };


  const removeItemFromSaved = (productId: string) => {
    setSavedItems(prev => prev.filter(i => i.product.id !== productId));
  };

  const updateQty = (productId: string, count: number) => {
    if (count <= 0) {
      removeItemFromCart(productId);
      return;
    }
    setItems(prev => prev.map(i => i.product.id === productId ? { ...i, count } : i));
  };


  const moveToSaved = (cartItem: CartItem) => {
    removeItemFromCart(cartItem.product.id);
    setSavedItems(prev => {
      if (prev.some(i => i.product.id === cartItem.product.id)) return prev;
      return [...prev, cartItem];
    });
    showNotification('Moved item to saved list');
  };

  const moveToCart = (cartItem: CartItem) => {
    removeItemFromSaved(cartItem.product.id);
    addItem(cartItem);
  };

  const clearCart = () => setItems([]);
  const clearSaved = () => setSavedItems([]);





  // Submit Checkout payload compatible with backend Django models
  const submitCheckout = async () => {
    setIsCheckingOut(true);
    try {
      const groupedByMerchant = items.reduce((acc: Record<string, any>, item) => {
        const mId = item.merchant.merchant.id;
        if (!acc[mId]) {
          acc[mId] = {
            merchant: item.merchant,
            items: []
          };
        }
        acc[mId].items.push({
          product: item.product,
          price: item.price,
          product_title: item.product.title,
          product_description: item.product.description,
          count: item.count
        });
        return acc;
      }, {});

      const payload = {
        delivery_address_uuid: deliveryAddressId,
        payment_method: paymentMethod,
        mpesa_phone_number: mpesaPhoneNumber,
        runner_fee: runnerFee,
        sub_orders: Object.values(groupedByMerchant)
      };

      const response = await fetch('/api/orders/checkout/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('access_token') || ''}`
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Checkout transaction failed.');
      }

      const data = await response.json();
      clearCart();
      showNotification('Order placed successfully!');
      return data;
    } catch (error: any) {
      showNotification(error.message || 'Checkout failed');
      throw error;
    } finally {
      setIsCheckingOut(false);
    }
  };


    const handleCheckout = async () => {
    if (!legibleForCheckout  || isCheckingOut) return;
    try {
      await submitCheckout();
    } catch (error) {
      // Error handling is handled via notification inside the provider
    }
  };


  return (
    <CartContext.Provider
      value={{
        cartLoading,
        cartActive,
        tabs, 
        activeTab,
        isNavMinimized,
        setCartLoading,
        setCartActive,
        setActiveTab,
        setIsNavMinimized,
        isCheckingOut,
        placingOrder,
        orderPlaced,
        notification,
        showNotification,
        items,
        savedItems,
        paymentMethod,
        mpesaPhoneNumber,
        runnerFee,
        subtotal,
        totalDue,
        totalItems,
        deliveryAddressId,
        setPaymentMethod,
        setMpesaPhoneNumber,
        setDeliveryAddressId,
        addItem,
        moveToSaved,
        moveToCart,
        removeItemFromCart,
        removeItemFromSaved,
        updateQty,
        clearCart,
        clearSaved,
        submitCheckout,
        groupedCartItems,
        handleCheckout,

      }}
    >
      {children}
    </CartContext.Provider>
  );
};


export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};