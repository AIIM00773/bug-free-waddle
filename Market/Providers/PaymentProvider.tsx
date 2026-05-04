/**
 * Payment Provider
 * Handles payment processing, methods, and transactions
 */

import { ApiError } from '@/utils/api';
import React, { createContext, useContext, useState } from 'react';

export type PaymentMethod = 'mpesa' | 'card' | 'paypal' | 'bank_transfer';

export interface PaymentDetails {
  method: PaymentMethod;
  amount: number;
  currency: string;
  description: string;
  reference: string;
}

export interface MpesaPayment {
  phoneNumber: string;
  amount: number;
  accountReference: string;
  transactionDesc: string;
}

export interface CardPayment {
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  cardholderName: string;
}

export interface PaymentResult {
  success: boolean;
  transactionId: string;
  reference: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  message?: string;
  receiptUrl?: string;
  timestamp: string;
}

export interface PaymentStatus {
  transactionId: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  message?: string;
  lastChecked: string;
}

interface PaymentContextType {
  // State
  currentPayment: PaymentDetails | null;
  paymentResult: PaymentResult | null;
  paymentStatus: PaymentStatus | null;
  loading: boolean;
  error: string | null;

  // Payment methods
  initiateMpesaPayment: (details: MpesaPayment) => Promise<PaymentResult>;
  initiateCardPayment: (details: CardPayment, amount: number) => Promise<PaymentResult>;
  initiatePaypalPayment: (amount: number, description: string) => Promise<string>; // Returns PayPal URL
  initiateBankTransfer: (amount: number, reference: string) => Promise<PaymentResult>;

  // Status checking
  checkPaymentStatus: (transactionId: string) => Promise<PaymentStatus>;

  // Utilities
  getPaymentMethods: () => PaymentMethod[];
  validatePaymentDetails: (method: PaymentMethod, details: any) => { valid: boolean; errors: string[] };
  formatAmount: (amount: number, currency?: string) => string;

  // Reset
  resetPayment: () => void;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export function PaymentProvider({ children }: { children: React.ReactNode }) {
  const [currentPayment, setCurrentPayment] = useState<PaymentDetails | null>(null);
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initiateMpesaPayment = async (details: MpesaPayment): Promise<PaymentResult> => {
    setLoading(true);
    setError(null);

    try {
      // Validate M-Pesa details
      const validation = validatePaymentDetails('mpesa', details);
      if (!validation.valid) {
        throw new Error(validation.errors.join(', '));
      }

      // Set current payment
      const paymentDetails: PaymentDetails = {
        method: 'mpesa',
        amount: details.amount,
        currency: 'KES',
        description: details.transactionDesc,
        reference: `MPESA_${Date.now()}`
      };
      setCurrentPayment(paymentDetails);

      // Simulate M-Pesa API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate success/failure randomly for demo
      const isSuccess = Math.random() > 0.2; // 80% success rate

      const result: PaymentResult = {
        success: isSuccess,
        transactionId: `mpesa_${Date.now()}`,
        reference: paymentDetails.reference,
        amount: details.amount,
        currency: 'KES',
        status: isSuccess ? 'completed' : 'failed',
        message: isSuccess
          ? 'Payment received successfully'
          : 'Payment failed. Please try again.',
        timestamp: new Date().toISOString()
      };

      setPaymentResult(result);

      // In a real app:
      // const response = await apiClient.post('/payments/mpesa/stkpush', {
      //   phoneNumber: details.phoneNumber,
      //   amount: details.amount,
      //   accountReference: details.accountReference,
      //   transactionDesc: details.transactionDesc
      // });

      return result;

    } catch (err) {
      const apiError = err as ApiError;
      const errorMessage = apiError.message || 'M-Pesa payment failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const initiateCardPayment = async (details: CardPayment, amount: number): Promise<PaymentResult> => {
    setLoading(true);
    setError(null);

    try {
      // Validate card details
      const validation = validatePaymentDetails('card', details);
      if (!validation.valid) {
        throw new Error(validation.errors.join(', '));
      }

      // Set current payment
      const paymentDetails: PaymentDetails = {
        method: 'card',
        amount,
        currency: 'KES',
        description: 'Card payment',
        reference: `CARD_${Date.now()}`
      };
      setCurrentPayment(paymentDetails);

      // Simulate card payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Simulate success/failure randomly for demo
      const isSuccess = Math.random() > 0.15; // 85% success rate

      const result: PaymentResult = {
        success: isSuccess,
        transactionId: `card_${Date.now()}`,
        reference: paymentDetails.reference,
        amount,
        currency: 'KES',
        status: isSuccess ? 'completed' : 'failed',
        message: isSuccess
          ? 'Card payment processed successfully'
          : 'Card payment declined. Please check your details.',
        timestamp: new Date().toISOString()
      };

      setPaymentResult(result);

      // In a real app:
      // const response = await apiClient.post('/payments/card', {
      //   cardNumber: details.cardNumber,
      //   expiryMonth: details.expiryMonth,
      //   expiryYear: details.expiryYear,
      //   cvv: details.cvv,
      //   cardholderName: details.cardholderName,
      //   amount
      // });

      return result;

    } catch (err) {
      const apiError = err as ApiError;
      const errorMessage = apiError.message || 'Card payment failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const initiatePaypalPayment = async (amount: number, description: string): Promise<string> => {
    setLoading(true);
    setError(null);

    try {
      // Set current payment
      const paymentDetails: PaymentDetails = {
        method: 'paypal',
        amount,
        currency: 'KES',
        description,
        reference: `PAYPAL_${Date.now()}`
      };
      setCurrentPayment(paymentDetails);

      // Simulate PayPal payment URL generation
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Return mock PayPal URL
      const paypalUrl = `https://www.paypal.com/checkout?token=${paymentDetails.reference}`;

      // In a real app:
      // const response = await apiClient.post('/payments/paypal/create', {
      //   amount,
      //   currency: 'KES',
      //   description
      // });
      // return response.approvalUrl;

      return paypalUrl;

    } catch (err) {
      const apiError = err as ApiError;
      const errorMessage = apiError.message || 'PayPal payment initialization failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const initiateBankTransfer = async (amount: number, reference: string): Promise<PaymentResult> => {
    setLoading(true);
    setError(null);

    try {
      // Set current payment
      const paymentDetails: PaymentDetails = {
        method: 'bank_transfer',
        amount,
        currency: 'KES',
        description: 'Bank transfer payment',
        reference: `BANK_${Date.now()}`
      };
      setCurrentPayment(paymentDetails);

      // Simulate bank transfer initiation
      await new Promise(resolve => setTimeout(resolve, 1000));

      const result: PaymentResult = {
        success: true,
        transactionId: `bank_${Date.now()}`,
        reference: paymentDetails.reference,
        amount,
        currency: 'KES',
        status: 'pending',
        message: 'Bank transfer initiated. Please complete the transfer using the provided details.',
        timestamp: new Date().toISOString()
      };

      setPaymentResult(result);

      // In a real app:
      // const response = await apiClient.post('/payments/bank-transfer', {
      //   amount,
      //   reference,
      //   currency: 'KES'
      // });

      return result;

    } catch (err) {
      const apiError = err as ApiError;
      const errorMessage = apiError.message || 'Bank transfer initiation failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const checkPaymentStatus = async (transactionId: string): Promise<PaymentStatus> => {
    try {
      // Simulate status check
      await new Promise(resolve => setTimeout(resolve, 500));

      // Mock status updates
      const statuses: PaymentStatus['status'][] = ['pending', 'completed', 'failed'];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

      const status: PaymentStatus = {
        transactionId,
        status: randomStatus,
        message: randomStatus === 'completed' ? 'Payment confirmed' :
                randomStatus === 'pending' ? 'Payment is being processed' :
                'Payment failed',
        lastChecked: new Date().toISOString()
      };

      setPaymentStatus(status);

      // In a real app:
      // const response = await apiClient.get(`/payments/${transactionId}/status`);

      return status;

    } catch (err) {
      const apiError = err as ApiError;
      const errorMessage = apiError.message || 'Failed to check payment status';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const getPaymentMethods = (): PaymentMethod[] => {
    return ['mpesa', 'card', 'paypal', 'bank_transfer'];
  };

  const validatePaymentDetails = (method: PaymentMethod, details: any): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    switch (method) {
      case 'mpesa':
        if (!details.phoneNumber || !/^(\+254|254|0)[17]\d{8}$/.test(details.phoneNumber)) {
          errors.push('Invalid M-Pesa phone number');
        }
        if (!details.amount || details.amount < 1) {
          errors.push('Invalid amount');
        }
        break;

      case 'card':
        if (!details.cardNumber || !/^\d{13,19}$/.test(details.cardNumber.replace(/\s/g, ''))) {
          errors.push('Invalid card number');
        }
        if (!details.expiryMonth || !/^(0[1-9]|1[0-2])$/.test(details.expiryMonth)) {
          errors.push('Invalid expiry month');
        }
        if (!details.expiryYear || !/^\d{2}$/.test(details.expiryYear)) {
          errors.push('Invalid expiry year');
        }
        if (!details.cvv || !/^\d{3,4}$/.test(details.cvv)) {
          errors.push('Invalid CVV');
        }
        if (!details.cardholderName || details.cardholderName.trim().length < 2) {
          errors.push('Invalid cardholder name');
        }
        break;

      case 'paypal':
        // PayPal validation is handled by PayPal's system
        break;

      case 'bank_transfer':
        if (!details.amount || details.amount < 1) {
          errors.push('Invalid amount');
        }
        break;
    }

    return {
      valid: errors.length === 0,
      errors
    };
  };

  const formatAmount = (amount: number, currency: string = 'KES'): string => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const resetPayment = () => {
    setCurrentPayment(null);
    setPaymentResult(null);
    setPaymentStatus(null);
    setError(null);
  };

  const value: PaymentContextType = {
    currentPayment,
    paymentResult,
    paymentStatus,
    loading,
    error,
    initiateMpesaPayment,
    initiateCardPayment,
    initiatePaypalPayment,
    initiateBankTransfer,
    checkPaymentStatus,
    getPaymentMethods,
    validatePaymentDetails,
    formatAmount,
    resetPayment
  };

  return (
    <PaymentContext.Provider value={value}>
      {children}
    </PaymentContext.Provider>
  );
}

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment must be used within PaymentProvider');
  }
  return context;
};