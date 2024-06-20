// src/contexts/NotificationContext.js
import React, { createContext, useState } from "react";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [unreadMessages, setUnreadMessages] = useState({});

  return (
    <NotificationContext.Provider value={{ unreadMessages, setUnreadMessages }}>
      {children}
    </NotificationContext.Provider>
  );
};
