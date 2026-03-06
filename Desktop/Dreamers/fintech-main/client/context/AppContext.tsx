import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useState,
} from "react";

export interface AppState {
  theme: "dark" | "light";
  sidebarOpen: boolean;
  notifications: Notification[];
  currentPage: string;
  isActivationModalOpen: boolean;
  hasSkippedActivation: boolean;
}

export interface Notification {
  id: string;
  type: "success" | "error" | "info" | "warning";
  message: string;
  timestamp: Date;
  duration?: number;
}

type AppAction =
  | { type: "TOGGLE_THEME" }
  | { type: "TOGGLE_SIDEBAR" }
  | { type: "ADD_NOTIFICATION"; payload: Notification }
  | { type: "REMOVE_NOTIFICATION"; payload: string }
  | { type: "SET_CURRENT_PAGE"; payload: string }
  | { type: "SET_ACTIVATION_MODAL_OPEN"; payload: boolean }
  | { type: "SET_SKIPPED_ACTIVATION"; payload: boolean };

const initialState: AppState = {
  theme: "dark",
  sidebarOpen: true,
  notifications: [],
  currentPage: "dashboard",
  isActivationModalOpen: false,
  hasSkippedActivation: false,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "TOGGLE_THEME":
      return {
        ...state,
        theme: state.theme === "dark" ? "light" : "dark",
      };
    case "TOGGLE_SIDEBAR":
      return { ...state, sidebarOpen: !state.sidebarOpen };
    case "ADD_NOTIFICATION":
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
      };
    case "REMOVE_NOTIFICATION":
      return {
        ...state,
        notifications: state.notifications.filter(
          (n) => n.id !== action.payload
        ),
      };
    case "SET_CURRENT_PAGE":
      return { ...state, currentPage: action.payload };
    case "SET_ACTIVATION_MODAL_OPEN":
      return { ...state, isActivationModalOpen: action.payload };
    case "SET_SKIPPED_ACTIVATION":
      return { ...state, hasSkippedActivation: action.payload };
    default:
      return state;
  }
}

interface AppContextType extends AppState {
  toggleTheme: () => void;
  toggleSidebar: () => void;
  addNotification: (notification: Omit<Notification, "id" | "timestamp">) => void;
  removeNotification: (id: string) => void;
  setCurrentPage: (page: string) => void;
  setActivationModalOpen: (isOpen: boolean) => void;
  setSkippedActivation: (hasSkipped: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const toggleTheme = () => {
    dispatch({ type: "TOGGLE_THEME" });
  };

  const toggleSidebar = () => {
    dispatch({ type: "TOGGLE_SIDEBAR" });
  };

  const addNotification = (
    notification: Omit<Notification, "id" | "timestamp">
  ) => {
    const id = Math.random().toString(36).substr(2, 9);
    dispatch({
      type: "ADD_NOTIFICATION",
      payload: {
        ...notification,
        id,
        timestamp: new Date(),
      },
    });

    // Auto-remove notification if duration is set
    if (notification.duration) {
      setTimeout(() => {
        dispatch({ type: "REMOVE_NOTIFICATION", payload: id });
      }, notification.duration);
    }
  };

  const removeNotification = (id: string) => {
    dispatch({ type: "REMOVE_NOTIFICATION", payload: id });
  };

  const setCurrentPage = (page: string) => {
    dispatch({ type: "SET_CURRENT_PAGE", payload: page });
  };

  const setActivationModalOpen = (isOpen: boolean) => {
    dispatch({ type: "SET_ACTIVATION_MODAL_OPEN", payload: isOpen });
  };

  const setSkippedActivation = (hasSkipped: boolean) => {
    dispatch({ type: "SET_SKIPPED_ACTIVATION", payload: hasSkipped });
    // Also close the modal when skipping
    if (hasSkipped) {
      setActivationModalOpen(false);
    }
  };

  const value: AppContextType = {
    ...state,
    toggleTheme,
    toggleSidebar,
    addNotification,
    removeNotification,
    setCurrentPage,
    setActivationModalOpen,
    setSkippedActivation,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
