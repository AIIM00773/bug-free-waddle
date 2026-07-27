import React, { createContext,  useContext, useState, useMemo, useCallback,  ReactNode } from 'react';
import type { CartItemType, CartGroupType, CartType,TransactionStatus, CustomerDeliveryLocationType} from '../types/shop.ts';

import { useCart } from './CartContext';
import { useAuth } from './profileContext';



export interface CheckoutContextType {
  showCheckoutModal: boolean;
  mpesaStatus: TransactionStatus;
  mpesaPhone: string;
  phoneError: string | null;
  deliveryNote: string;
  deliveryLocation: CustomerDeliveryLocationType | null;
  paymentError: string | null;
  networkError: string | null;
  setShowCheckoutModal: (isOpen: boolean) => void;
  setMpesaPhone: (phone: string) => boolean;
  setDeliveryNote: (note: string) => void;
  setDeliveryLocation: (location: CustomerDeliveryLocationType | null) => void;
  initiatePayment: () => Promise<boolean>;
  resetCheckoutState: () => void;
};




const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);


//===================================================================PAYMENT PHONE VALIDATION VALIDATION ;
function parseAndValidateKenyanPhone(phone: string): { isValid: boolean; formatted: string } {
  const cleaned = phone.replace(/\s+/g, '');
  const match = cleaned.match(/^(?:\+254|254|0)?([71]\d{8})$/);
  
  if (match) {
    return {
      isValid: true,
      formatted: `254${match[1]}`
    };
  }
  return {
    isValid: false,
    formatted: phone
  };
}

function sanitizeTextInput(input: string): string {
  return input.replace(/<[^>]*>/g, '').trim();
}





export function CheckoutProvider({ children }: { children: ReactNode }) {
  const { cartSummary, clearCart } = useCart();
  const { user } = useAuth();

  const [showCheckoutModal, setShowCheckoutModal] = useState<boolean>(false);
  const [mpesaStatus, setMpesaStatus] = useState<TransactionStatus>('idle');
  const [mpesaPhone, setMpesaPhoneState] = useState<string>('');
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [deliveryNote, setDeliveryNoteState] = useState<string>('');
  const [deliveryLocation, setDeliveryLocation] = useState<CustomerDeliveryLocationType | null>(null);
  
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [networkError, setNetworkError] = useState<string | null>(null);



//===================================================================ADD MPESA PHINE NUMBER ;
  const setMpesaPhone = useCallback((phone: string): boolean => {
    const { isValid, formatted } = parseAndValidateKenyanPhone(phone);
    if (!isValid && phone.trim().length > 4) {
      setPhoneError('Please enter a valid phone number (e.g. 0712345678)');
    } else {
      setPhoneError(null);
    }
    setMpesaPhoneState(formatted);
    return isValid;
  }, []);





//===================================================================ADD MPESA PHINE NUMBER ;
const setDeliveryNote = useCallback((note: string) => {
    setDeliveryNoteState(sanitizeTextInput(note));
  }, []);






//===================================================================RESET CHECKOUT STATE  ;
const resetCheckoutState = useCallback(() => {
    setMpesaStatus('idle');
    setPaymentError(null);
    setNetworkError(null);
  }, []);





//=================================================================== INITIATE PAYMENT  ;

const initiatePayment = useCallback(async (): Promise<boolean> => {
    setPaymentError(null);
    setNetworkError(null);

    const { isValid, formatted } = parseAndValidateKenyanPhone(mpesaPhone);
    if (!isValid) {
      setPhoneError('A valid phone number is required to receive the M-Pesa prompt.');
      return false;
    }

    if (cartSummary.finalTotal <= 0 || cartSummary.groups.length === 0) {
      setPaymentError('Your cart is empty or has an invalid total.');
      return false;
    }

    setMpesaStatus('sending');

    try {
      const payload = {
        phoneNumber: formatted,
        amount: Math.ceil(cartSummary.finalTotal),
        cart: cartSummary,
        deliveryNote,
        deliveryLocation,
        userId: user?.id || 'guest_user'
      };

      const response = await fetch('/api/payments/mpesa/stk-push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Payment initiation failed on server.');
      }

      setMpesaStatus('pin_prompted');
      return true;

    } catch (err: any) {
      console.error('Payment Processing Exception:', err);
      setMpesaStatus('failed');
      setPaymentError(err.message || 'Network error occurred while connecting to payment gateway.');
      setNetworkError(err.message);
      return false;
    }
  }, [mpesaPhone, cartSummary, deliveryNote, deliveryLocation, user]);









//===================================================================================

  const value = useMemo<CheckoutContextType>(() => ({
    showCheckoutModal,
    mpesaStatus,
    mpesaPhone,
    phoneError,
    deliveryNote,
    deliveryLocation,
    paymentError,
    networkError,
    setShowCheckoutModal,
    setMpesaPhone,
    setDeliveryNote,
    setDeliveryLocation,
    initiatePayment,
    resetCheckoutState
  }), [
    showCheckoutModal,
    mpesaStatus,
    mpesaPhone,
    phoneError,
    deliveryNote,
    deliveryLocation,
    paymentError,
    networkError,
    setMpesaPhone,
    setDeliveryNote,
    initiatePayment,
    resetCheckoutState
  ]);

  return <CheckoutContext.Provider value={value}>{children}</CheckoutContext.Provider>;
}



export function useCheckout(): CheckoutContextType {
  const context = useContext(CheckoutContext);
  if (!context) {
    throw new Error('useCheckout must be used within a CheckoutProvider');
  }
  return context;
}
