/**
 * Notification Provider
 * Handles push notifications, in-app notifications, and notification preferences
 */

import { ApiError } from '@/utils/api';
import React, { createContext, useContext, useEffect, useState } from 'react';

export type NotificationType =
  | 'order_update'
  | 'new_message'
  | 'product_like'
  | 'price_drop'
  | 'new_follower'
  | 'review_received'
  | 'promotion'
  | 'system';

export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface NotificationData {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  priority: NotificationPriority;
  data?: any; // Additional data like orderId, productId, etc.
  read: boolean;
  createdAt: string;
  expiresAt?: string;
  actionUrl?: string;
  imageUrl?: string;
}

export interface NotificationPreferences {
  pushEnabled: boolean;
  emailEnabled: boolean;
  smsEnabled: boolean;
  types: {
    [K in NotificationType]: boolean;
  };
  quietHours: {
    enabled: boolean;
    start: string; // HH:MM format
    end: string; // HH:MM format
  };
}

export interface PushToken {
  token: string;
  platform: 'ios' | 'android';
  deviceId: string;
}

interface NotificationContextType {
  // State
  notifications: NotificationData[];
  unreadCount: number;
  preferences: NotificationPreferences;
  pushToken: PushToken | null;
  loading: boolean;
  error: string | null;

  // Notification management
  addNotification: (notification: Omit<NotificationData, 'id' | 'read' | 'createdAt'>) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (notificationId: string) => void;
  clearAllNotifications: () => void;

  // Push notifications
  registerPushToken: (token: PushToken) => Promise<boolean>;
  unregisterPushToken: () => Promise<boolean>;
  testPushNotification: () => Promise<boolean>;

  // Preferences
  updatePreferences: (preferences: Partial<NotificationPreferences>) => Promise<boolean>;
  getPreferences: () => Promise<NotificationPreferences>;

  // Batch operations
  getNotifications: (page?: number, limit?: number) => Promise<NotificationData[]>;
  getUnreadNotifications: () => NotificationData[];
  getNotificationsByType: (type: NotificationType) => NotificationData[];

  // Utilities
  formatNotificationTime: (timestamp: string) => string;
  getNotificationIcon: (type: NotificationType) => string;
  shouldShowNotification: (notification: NotificationData) => boolean;

  // Real-time updates (simulated)
  subscribeToNotifications: () => void;
  unsubscribeFromNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Default preferences
const defaultPreferences: NotificationPreferences = {
  pushEnabled: true,
  emailEnabled: false,
  smsEnabled: false,
  types: {
    order_update: true,
    new_message: true,
    product_like: true,
    price_drop: true,
    new_follower: true,
    review_received: true,
    promotion: false,
    system: true
  },
  quietHours: {
    enabled: false,
    start: '22:00',
    end: '08:00'
  }
};

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [preferences, setPreferences] = useState<NotificationPreferences>(defaultPreferences);
  const [pushToken, setPushToken] = useState<PushToken | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize with some dummy notifications
  useEffect(() => {
    const dummyNotifications: NotificationData[] = [
      {
        id: 'notif_1',
        type: 'order_update',
        title: 'Order Confirmed',
        message: 'Your order #12345 has been confirmed and is being prepared.',
        priority: 'medium',
        data: { orderId: '12345' },
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
        actionUrl: '/orders/12345'
      },
      {
        id: 'notif_2',
        type: 'new_message',
        title: 'New Message',
        message: 'FashionStore sent you a message about your order.',
        priority: 'medium',
        data: { senderId: 'merchant_1', conversationId: 'conv_1' },
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        actionUrl: '/messages/conv_1'
      },
      {
        id: 'notif_3',
        type: 'promotion',
        title: 'Flash Sale!',
        message: '50% off on all summer dresses. Limited time offer!',
        priority: 'high',
        data: { promotionId: 'promo_1', discount: 50 },
        read: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(), // expires in 1 day
        actionUrl: '/promotions/promo_1'
      }
    ];

    setNotifications(dummyNotifications);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = (notification: Omit<NotificationData, 'id' | 'read' | 'createdAt'>) => {
    const newNotification: NotificationData = {
      ...notification,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      read: false,
      createdAt: new Date().toISOString()
    };

    setNotifications(prev => [newNotification, ...prev]);

    // In a real app, send to backend
    // apiClient.post('/notifications', newNotification);
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );

    // In a real app:
    // apiClient.patch(`/notifications/${notificationId}/read`);
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );

    // In a real app:
    // apiClient.patch('/notifications/mark-all-read');
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));

    // In a real app:
    // apiClient.delete(`/notifications/${notificationId}`);
  };

  const clearAllNotifications = () => {
    setNotifications([]);

    // In a real app:
    // apiClient.delete('/notifications/all');
  };

  const registerPushToken = async (token: PushToken): Promise<boolean> => {
    try {
      setLoading(true);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      setPushToken(token);

      // In a real app:
      // await apiClient.post('/notifications/register-token', token);

      return true;

    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to register push token');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const unregisterPushToken = async (): Promise<boolean> => {
    try {
      setLoading(true);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));

      setPushToken(null);

      // In a real app:
      // await apiClient.delete('/notifications/push-token');

      return true;

    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to unregister push token');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const testPushNotification = async (): Promise<boolean> => {
    try {
      setLoading(true);

      // Simulate sending test notification
      await new Promise(resolve => setTimeout(resolve, 1000));

      addNotification({
        type: 'system',
        title: 'Test Notification',
        message: 'This is a test push notification to verify your settings.',
        priority: 'low'
      });

      return true;

    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to send test notification');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences = async (newPreferences: Partial<NotificationPreferences>): Promise<boolean> => {
    try {
      setLoading(true);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      setPreferences(prev => ({ ...prev, ...newPreferences }));

      // In a real app:
      // await apiClient.put('/notifications/preferences', newPreferences);

      return true;

    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to update preferences');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getPreferences = async (): Promise<NotificationPreferences> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));

      // In a real app:
      // const response = await apiClient.get('/notifications/preferences');

      return preferences;

    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to get preferences');
      return defaultPreferences;
    }
  };

  const getNotifications = async (page: number = 1, limit: number = 20): Promise<NotificationData[]> => {
    try {
      // Simulate API call with pagination
      await new Promise(resolve => setTimeout(resolve, 400));

      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;

      // In a real app:
      // const response = await apiClient.get('/notifications', {
      //   params: { page, limit }
      // });

      return notifications.slice(startIndex, endIndex);

    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to get notifications');
      return [];
    }
  };

  const getUnreadNotifications = (): NotificationData[] => {
    return notifications.filter(n => !n.read);
  };

  const getNotificationsByType = (type: NotificationType): NotificationData[] => {
    return notifications.filter(n => n.type === type);
  };

  const formatNotificationTime = (timestamp: string): string => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMs = now.getTime() - notificationTime.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;

    return notificationTime.toLocaleDateString();
  };

  const getNotificationIcon = (type: NotificationType): string => {
    const icons = {
      order_update: '📦',
      new_message: '💬',
      product_like: '❤️',
      price_drop: '💰',
      new_follower: '👥',
      review_received: '⭐',
      promotion: '🎉',
      system: '⚙️'
    };

    return icons[type] || '🔔';
  };

  const shouldShowNotification = (notification: NotificationData): boolean => {
    // Check if notification type is enabled in preferences
    if (!preferences.types[notification.type]) return false;

    // Check quiet hours
    if (preferences.quietHours.enabled) {
      const now = new Date();
      const currentTime = now.getHours() * 60 + now.getMinutes();
      const startTime = timeToMinutes(preferences.quietHours.start);
      const endTime = timeToMinutes(preferences.quietHours.end);

      if (startTime < endTime) {
        // Same day range
        if (currentTime >= startTime && currentTime <= endTime) return false;
      } else {
        // Overnight range
        if (currentTime >= startTime || currentTime <= endTime) return false;
      }
    }

    // Check expiration
    if (notification.expiresAt) {
      const expiresAt = new Date(notification.expiresAt);
      if (new Date() > expiresAt) return false;
    }

    return true;
  };

  const subscribeToNotifications = () => {
    // In a real app, this would set up WebSocket or push notification listeners
    console.log('Subscribed to real-time notifications');
  };

  const unsubscribeFromNotifications = () => {
    // In a real app, this would clean up WebSocket or push notification listeners
    console.log('Unsubscribed from real-time notifications');
  };

  // Helper function to convert HH:MM to minutes
  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    preferences,
    pushToken,
    loading,
    error,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    registerPushToken,
    unregisterPushToken,
    testPushNotification,
    updatePreferences,
    getPreferences,
    getNotifications,
    getUnreadNotifications,
    getNotificationsByType,
    formatNotificationTime,
    getNotificationIcon,
    shouldShowNotification,
    subscribeToNotifications,
    unsubscribeFromNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};