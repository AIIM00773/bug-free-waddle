import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

// --- TYPES & INTERFACES ---
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface ShippingAddress {
    name: string;
    phone: string;
    street: string;
    city: string;
    houseNumber?: string;
}

export interface OrderItem {
    productId: string;
    productName: string;
    productImage: string;
    quantity: number;
    price: number;
}

export interface Order {
    id: string;
    orderNumber: string;
    items: OrderItem[];
    status: OrderStatus;
    total: number;
    shippingAddress: ShippingAddress;
    paymentMethod: string;
    createdAt: string;
}

interface OrderContextType {
    orders: Order[];
    loading: boolean;
    createOrder: (items: OrderItem[], address: ShippingAddress, method: string, total: number) => Promise<Order>;
    cancelOrder: (orderId: string) => Promise<void>; // Added cancelOrder
    getStatusUI: (status: OrderStatus) => { color: string; label: string };
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

// --- PROVIDER ---
export function OrderProvider({ children }: { children: React.ReactNode }) {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);

    /**
     * getStatusUI: Centralized mapping for UI consistency.
     */
    const getStatusUI = useCallback((status: OrderStatus) => {
        const config: Record<OrderStatus, { color: string; label: string }> = {
            pending: { color: '#F59E0B', label: 'Awaiting Payment' },
            processing: { color: '#8B5CF6', label: 'Neural Preparing' },
            shipped: { color: '#0EA5E9', label: 'On the Way' },
            delivered: { color: '#10B981', label: 'Delivered' },
            cancelled: { color: '#EF4444', label: 'Cancelled' },
        };
        return config[status] || { color: '#6B7280', label: 'Unknown' };
    }, []);

    /**
     * createOrder: Finalizes the checkout process.
     */
    const createOrder = async (
        items: OrderItem[],
        address: ShippingAddress,
        method: string,
        total: number
    ): Promise<Order> => {
        if (items.length === 0) throw new Error("Cannot create empty order");

        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));

            const newOrder: Order = {
                id: `ORD_${Math.random().toString(36).slice(2, 11)}`.toUpperCase(),
                orderNumber: `DX-${Math.floor(1000 + Math.random() * 9000)}`,
                items,
                status: 'pending',
                total,
                shippingAddress: address,
                paymentMethod: method,
                createdAt: new Date().toISOString(),
            };

            setOrders(prev => [newOrder, ...prev]);
            return newOrder;
        } catch (error) {
            console.error("Order Creation Error:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    /**
     * cancelOrder: Updates order status to 'cancelled'
     */
    const cancelOrder = async (orderId: string): Promise<void> => {
        setLoading(true);
        try {
            // Simulate API delay for cancellation request
            await new Promise(resolve => setTimeout(resolve, 1000));

            setOrders(prevOrders => 
                prevOrders.map(order => 
                    order.id === orderId 
                        ? { ...order, status: 'cancelled' as OrderStatus } 
                        : order
                )
            );
        } catch (error) {
            console.error("Order Cancellation Error:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const value = useMemo(() => ({
        orders,
        loading,
        createOrder,
        cancelOrder, // Exposed to the context
        getStatusUI
    }), [orders, loading, getStatusUI]);

    return (
        <OrderContext.Provider value={value}>
            {children}
        </OrderContext.Provider>
    );
}

// --- HOOK ---
export const useOrders = () => {
    const context = useContext(OrderContext);
    if (!context) {
        throw new Error('useOrders must be used within an OrderProvider');
    }
    return context;
};