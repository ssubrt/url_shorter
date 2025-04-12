
import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "../types";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

// Mock authentication - no real API calls
const mockUser = {
  id: "123",
  email: "user@example.com",
  name: "Mock User"
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUserProfile(token);
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchUserProfile = async (token: string) => {
    try {
      // Mock response - no actual API call
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
      setUser({...mockUser});
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      localStorage.removeItem("token");
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Mock response - no actual API call
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
      const token = "mock-token-" + Math.random().toString(36).substring(2);
      localStorage.setItem("token", token);
      setUser({...mockUser, email});
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
    } catch (error) {
      let errorMessage = "Please check your credentials";
      
      if (axios.isAxiosError(error) && error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };


  const signUp = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Mock response - no actual API call
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
      const token = "mock-token-" + Math.random().toString(36).substring(2);
      localStorage.setItem("token", token);
      setUser({...mockUser, email});
      
      toast({
        title: "Sign up successful",
        description: "Your account has been created!",
      });
    } catch (error) {
      let errorMessage = "Failed to create account";
      
      if (axios.isAxiosError(error) && error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      
      toast({
        title: "Sign up failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        signUp,
        logout,
        isAuthenticated: !!user,
      }}
    >
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
