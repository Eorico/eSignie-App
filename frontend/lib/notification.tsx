import { createContext, useContext, useState, ReactNode } from "react";

type Notification = {
  id: string;
  message: string;
  timestamp: string;
};

type NotifContextType = {
  notifications: Notification[];
  addNotification: (message: string) => void;
  clearNotifications: () => void;
};

const NotifContext = createContext<NotifContextType | undefined>(undefined);

export const NotifProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (message: string) => {
    const newNotif: Notification = {
      id: Math.random().toString(36).substr(2, 9),  
      message,
      timestamp: new Date().toLocaleTimeString(),
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const clearNotifications = () => setNotifications([]);

  return (
    <NotifContext.Provider value={{ notifications, addNotification, clearNotifications }}>
      {children}
    </NotifContext.Provider>
  );
};

export const useNotif = () => {
  const context = useContext(NotifContext);
  if (!context) {
    throw new Error("useNotif must be used within a NotifProvider");
  }
  return context;
};
