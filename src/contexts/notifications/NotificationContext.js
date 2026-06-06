import { createContext, useContext } from "react";
import { NotificationsProvider } from "./NotificationsProvider";

export const NotificationContext = createContext()

export const useNotifications = () => useContext(NotificationContext)

