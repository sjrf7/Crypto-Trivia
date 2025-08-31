
'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { Notification } from '@/lib/types';
import { useFarcasterUser } from './use-farcaster-user';

interface NotificationsContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: () => void;
  clearAll: () => void;
  unreadCount: number;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const { farcasterUser } = useFarcasterUser();
  const fid = farcasterUser?.fid;
  const storageKey = `notifications_${fid}`;

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!fid) {
      setNotifications([]);
      return;
    }
    try {
      const item = window.localStorage.getItem(storageKey);
      if (item) {
        const parsedNotifications: Notification[] = JSON.parse(item);
        setNotifications(parsedNotifications);
        setUnreadCount(parsedNotifications.filter(n => !n.read).length);
      } else {
        setNotifications([]);
      }
    } catch (error) {
      console.error("Failed to read notifications from localStorage", error);
      setNotifications([]);
    }
  }, [fid, storageKey]);

  const saveToLocalStorage = (items: Notification[]) => {
    if(fid) {
        window.localStorage.setItem(storageKey, JSON.stringify(items));
    }
  }

  const addNotification = useCallback((notificationData: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    if (!fid) return;

    const newNotification: Notification = {
      id: new Date().toISOString() + Math.random(),
      timestamp: Date.now(),
      read: false,
      ...notificationData,
    };

    setNotifications(prev => {
      const updatedNotifications = [newNotification, ...prev].slice(0, 50); // Keep max 50 notifications
      saveToLocalStorage(updatedNotifications);
      setUnreadCount(updatedNotifications.filter(n => !n.read).length);
      return updatedNotifications;
    });

  }, [fid, storageKey]);

  const markAsRead = useCallback(() => {
    if (!fid) return;

    setNotifications(prev => {
        const updated = prev.map(n => ({...n, read: true}));
        saveToLocalStorage(updated);
        setUnreadCount(0);
        return updated;
    });
  }, [fid, storageKey]);

  const clearAll = useCallback(() => {
    if (!fid) return;
    setNotifications([]);
    setUnreadCount(0);
    saveToLocalStorage([]);
  }, [fid, storageKey]);

  const value = {
    notifications,
    addNotification,
    markAsRead,
    clearAll,
    unreadCount,
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
}
