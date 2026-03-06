import { apiClient } from "@/services/api";
import React, { createContext, useContext, useReducer, ReactNode, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { SignupRequest } from "@/services/auth.service";
export interface User {
  id: string;
  email: string;
  name: string;
  accountStatus: "inactive" | "active" | "verified";
  createdAt: Date;
  referralCode: string;
}

interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
}
export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

type AuthAction =
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS"; payload: LoginResponse }
  | { type: "LOGIN_FAIL"; payload: string }
  | { type: "LOGOUT" }
  | { type: "SIGNUP_START" }
  | { type: "SIGNUP_SUCCESS" }
  | { type: "SIGNUP_FAIL"; payload: string }
  | { type: "CLEAR_ERROR" };

const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "LOGIN_START":
    case "SIGNUP_START":
      return { ...state, isLoading: true, error: null };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        refreshToken: action.payload.refreshToken,
        error: null,
      };
    case "SIGNUP_SUCCESS":
      // Email not verified yet — do NOT set isAuthenticated
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        error: null,
      };
    case "LOGIN_FAIL":
    case "SIGNUP_FAIL":
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        error: action.payload,
      };
    case "LOGOUT":
      return { ...state, isAuthenticated: false, user: null };
    case "CLEAR_ERROR":
      return { ...state, error: null };
    default:
      return state;
  }
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ requires2FA?: boolean; tempToken?: string }>;
  signup: (email: string, password: string, name: string, phone: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  updateAuthAfter2FA: (token: string, refreshToken: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);


export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);
 useEffect(() => {
  const token = localStorage.getItem("auth_token");
  const user = localStorage.getItem("user");
  const refreshToken = localStorage.getItem("refresh_token");

  if (token && user) {
    dispatch({
      type: "LOGIN_SUCCESS",
      payload: {
        user: JSON.parse(user),
        token,
        refreshToken,
      } as any,
    });
  }
}, []);
  const login = async (email: string, password: string) => {
    dispatch({ type: "LOGIN_START" });

    try {
      const res = await apiClient.post<any>("/auth/login", {
        email,
        password,
      });

      console.log(res.data);

      // Check if 2FA is required
      if (res.data.message === "Enter 2FA code" && res.data.tempToken) {
        dispatch({ type: "CLEAR_ERROR" });
        return { requires2FA: true, tempToken: res.data.tempToken };
      }

      const { token, refreshToken } = res.data;
      // store in localStorage
      localStorage.setItem("auth_token", token);
      localStorage.setItem("refresh_token", refreshToken);
      // Decode token
      const decoded: any = jwtDecode(token);

      // decoded will look like:
      // { userId, iat, exp }

      const user: User = {
        id: decoded.userId,
        email: email,
        name: res.data.user.name,
        accountStatus: res.data.user.accountStatus,
        createdAt: new Date(res.data.user.createdAt),
        referralCode: res.data.user.referralCode ?? "",
      };

      // Update localStorage with the correct user object
      localStorage.setItem("user", JSON.stringify(user));

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          user,
          token,
          refreshToken,
        } as any,
      });

      return { requires2FA: false };
    } catch (error) {
      console.log(error);
      dispatch({
        type: "LOGIN_FAIL",
        payload: error instanceof Error ? error.message : "Login Failed",
      });
      throw error;
    }
  };

  const updateAuthAfter2FA = async (token: string, refreshToken: string) => {
    try {
      // store in localStorage
      localStorage.setItem("auth_token", token);
      localStorage.setItem("refresh_token", refreshToken);
      
      // Decode token to get user info
      const decoded: any = jwtDecode(token);

      // Fetch user details  
      try {
        const userRes = await apiClient.get(`/users/profile`);
        
        const user: User = {
          id: userRes.data.id,
          email: userRes.data.email,
          name: userRes.data.name,
          accountStatus: userRes.data.status,
          createdAt: new Date(userRes.data.created_at),
          referralCode: userRes.data.referral_code ?? "",
        };

        localStorage.setItem("user", JSON.stringify(user));

        dispatch({
          type: "LOGIN_SUCCESS",
          payload: {
            user,
            token,
            refreshToken,
          } as any,
        });
      } catch (err) {
        // If profile fetch fails, create basic user object from token
        const user: User = {
          id: decoded.userId,
          email: "",
          name: "",
          accountStatus: "active",
          createdAt: new Date(),
          referralCode: "",
        };

        localStorage.setItem("user", JSON.stringify(user));

        dispatch({
          type: "LOGIN_SUCCESS",
          payload: {
            user,
            token,
            refreshToken,
          } as any,
        });
      }
    } catch (error) {
      console.error("Failed to update auth after 2FA:", error);
      throw error;
    }
  };

  const signup = async (email: string, password: string, name: string, phone: string) => {
    dispatch({ type: "SIGNUP_START" });
    try {
      const payload: SignupRequest = { email, password, name, phone };
      await apiClient.post("/auth/register", payload);
      // Store email so the verify-email page can pre-fill it
      sessionStorage.setItem("pending_verify_email", email);
      dispatch({ type: "SIGNUP_SUCCESS" });
    } catch (error: any) {
      dispatch({
        type: "SIGNUP_FAIL",
        payload:
          error?.message ||
          (error instanceof Error ? error.message : "Signup failed"),
      });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    dispatch({ type: "LOGOUT" });
  };

  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" });
  };

  const value: AuthContextType = {
    ...state,
    login,
    signup,
    logout,
    clearError,
    updateAuthAfter2FA,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
