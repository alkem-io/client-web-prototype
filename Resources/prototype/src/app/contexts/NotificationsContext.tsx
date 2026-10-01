import React, { createContext, useContext, useState, useCallback } from "react";

export type NotificationsTab = "notifications" | "activity";

interface NotificationsContextValue {
  isOpen: boolean;
  initialTab: NotificationsTab;
  openNotifications: (tab?: NotificationsTab) => void;
  closeNotifications: () => void;
}

const NotificationsContext = createContext<NotificationsContextValue>({
  isOpen: false,
  initialTab: "notifications",
  openNotifications: () => {},
  closeNotifications: () => {}
});

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [initialTab, setInitialTab] = useState<NotificationsTab>("notifications");

  const openNotifications = useCallback((tab: NotificationsTab = "notifications") => {
    setInitialTab(tab);
    setIsOpen(true);
  }, []);
  const closeNotifications = useCallback(() => setIsOpen(false), []);

  return (
    <NotificationsContext.Provider
      value={{ isOpen, initialTab, openNotifications, closeNotifications }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationsContext);
}
