'use client'
import React, { createContext, useContext, useReducer, useEffect } from "react";
import { AuthState, LoginCredentials, SignupCredentials, User } from "../types/auth";
import { useToast } from "@/hooks/use-toast";

type AuthAction =
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS"; payload: { user: User; token: string } }
  | { type: "LOGIN_FAILURE"; payload: string }
  | { type: "SIGNUP_START" }
  | { type: "SIGNUP_SUCCESS"; payload: { user: User; token: string } }
  | { type: "SIGNUP_FAILURE"; payload: string }
  | { type: "LOGOUT" }
  | { type: "CLEAR_ERROR" };

interface AuthContextType {
  state: AuthState;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN_START":
    case "SIGNUP_START":
      return { ...state, isLoading: true, error: null };
    case "LOGIN_SUCCESS":
    case "SIGNUP_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case "LOGIN_FAILURE":
    case "SIGNUP_FAILURE":
      return { ...state, isLoading: false, error: action.payload, isAuthenticated: false };
    case "LOGOUT":
      return { ...initialState, token: null, isAuthenticated: false };
    case "CLEAR_ERROR":
      return { ...state, error: null };
    default:
      return state;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const { toast } = useToast();

  // Initialize state from localStorage once on the client side
  useEffect(() => {
    // Initialize with localStorage values on client-side only
    const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
    
    if (token) {
      try {
        // For the MVP, we're just simulating a valid JWT with mock data
        // In production, we'd verify the token with the backend
        const mockUser: User = {
          id: "user-123",
          email: "user@example.com",
          name: "Demo User"
        };
        dispatch({ type: "LOGIN_SUCCESS", payload: { user: mockUser, token } });
      } catch (error) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem("token");
        }
        dispatch({ type: "LOGOUT" });
      }
    }
  }, []);

  const login = async (credentials: LoginCredentials) => {
    dispatch({ type: "LOGIN_START" });
    try {
      // Mock API call for now
      // In a real app, this would be: const response = await api.post('/auth/login', credentials)
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      // Mock successful login
      const mockResponse = {
        user: { id: "user-123", email: credentials.email, name: "Demo User" },
        token: "mockJWTtoken123456789",
      };
      
      if (typeof window !== 'undefined') {
        localStorage.setItem("token", mockResponse.token);
      }
      dispatch({ type: "LOGIN_SUCCESS", payload: mockResponse });
      toast({
        title: "Login successful",
        description: `Welcome back, ${mockResponse.user.name}!`,
      });
    } catch (error) {
      dispatch({ type: "LOGIN_FAILURE", payload: "Invalid email or password" });
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Invalid email or password. Please try again."
      });
    }
  };

  const signup = async (credentials: SignupCredentials) => {
    dispatch({ type: "SIGNUP_START" });
    try {
      // Mock API call for now
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      // Mock successful signup
      const mockResponse = {
        user: { id: "user-" + Math.floor(Math.random() * 1000), email: credentials.email, name: credentials.name },
        token: "mockJWTtoken" + Math.floor(Math.random() * 1000000),
      };
      
      if (typeof window !== 'undefined') {
        localStorage.setItem("token", mockResponse.token);
      }
      dispatch({ type: "SIGNUP_SUCCESS", payload: mockResponse });
      toast({
        title: "Signup successful",
        description: `Welcome to Hushh, ${credentials.name}!`,
      });
    } catch (error) {
      dispatch({ type: "SIGNUP_FAILURE", payload: "Signup failed. Please try again." });
      toast({
        variant: "destructive",
        title: "Signup failed",
        description: "Could not create your account. Please try again."
      });
    }
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem("token");
    }
    dispatch({ type: "LOGOUT" });
    toast({
      title: "Logged out",
      description: "You have been successfully logged out."
    });
  };

  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" });
  };

  return (
    <AuthContext.Provider value={{ state, login, signup, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
