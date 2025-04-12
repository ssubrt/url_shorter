
import React, { createContext, useContext, useState, useEffect } from "react";
import { ShortenedUrl, LinkAnalytics } from "../types";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "./AuthContext";
import axios from "axios";

interface UrlContextType {
  urls: ShortenedUrl[];
  isLoading: boolean;
  shortenUrl: (originalUrl: string, customAlias?: string, expiresAt?: string) => Promise<ShortenedUrl>;
  getAnalytics: (urlId: string) => Promise<LinkAnalytics>;
  generateQrCode: (url: string) => Promise<string>;
}

// Mock data for demonstration
const mockUrls: ShortenedUrl[] = [
  {
    id: "1",
    originalUrl: "https://www.google.com",
    shortCode: "abc123",
    fullShortUrl: "https://deco.id/abc123",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    userId: "user-1",
    clickCount: 145
  },
  {
    id: "2",
    originalUrl: "https://www.github.com",
    shortCode: "def456",
    fullShortUrl: "https://deco.id/def456",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    userId: "user-1",
    clickCount: 89
  },
  {
    id: "3",
    originalUrl: "https://www.microsoft.com",
    shortCode: "ghi789",
    fullShortUrl: "https://deco.id/ghi789",
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    userId: "user-1",
    clickCount: 37
  }
];

const generateRandomString = (length: number) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const API_URL = "http://localhost:8080/api";

const UrlContext = createContext<UrlContextType | undefined>(undefined);

export const UrlProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [urls, setUrls] = useState<ShortenedUrl[]>(mockUrls);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();


  const shortenUrl = async (
    originalUrl: string,
    customAlias?: string,
    expiresAt?: string
  ): Promise<ShortenedUrl> => {
    setIsLoading(true);
    try {
       // Simulate API call
       await new Promise(resolve => setTimeout(resolve, 1000));
      
       if (!user) {
         throw new Error("You must be logged in to shorten URLs");
       }
 
       const shortCode = customAlias || generateRandomString(6);
       
       // Check if custom alias is already in use
       if (customAlias && urls.some(url => url.shortCode === customAlias)) {
         throw new Error("This custom alias is already in use. Please try another one.");
       }
 
       const newUrl: ShortenedUrl = {
         id: `url-${Date.now()}`,
         originalUrl,
         shortCode,
         fullShortUrl: `https://deco.id/${shortCode}`,
         createdAt: new Date().toISOString(),
         expiresAt: expiresAt ? new Date(expiresAt).toISOString() : undefined,
         userId: user.id,
         clickCount: 0
       };
 
       setUrls(prevUrls => [newUrl, ...prevUrls]);
       
       toast({
         title: "URL shortened successfully",
         description: `Your short URL: deco.id/${shortCode}`,
       });
       
       return newUrl;
     } catch (error) {
       toast({
         title: "Error shortening URL",
         description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getAnalytics = async (urlId: string): Promise<LinkAnalytics> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Find the URL to get the click count
      const url = urls.find(u => u.id === urlId);
      if (!url) {
        throw new Error("URL not found");
      }

      // Generate mock analytics data based on the URL's click count
      const totalClicks = url.clickCount;
      
      // Generate time series data for the last 14 days
      const timeSeriesData: LinkAnalytics["timeSeriesData"] = [];
      for (let i = 13; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        // Random click count that sums approximately to totalClicks
        const clicks = i === 0 
          ? Math.floor(totalClicks * 0.1) 
          : Math.floor(Math.random() * (totalClicks / 20));
        
        timeSeriesData.push({ date: dateStr, clicks });
      }

      // Device breakdown
      const deviceBreakdown: LinkAnalytics["deviceBreakdown"] = [
        { device: "Desktop", count: Math.floor(totalClicks * 0.6), percentage: 60 },
        { device: "Mobile", count: Math.floor(totalClicks * 0.3), percentage: 30 },
        { device: "Tablet", count: Math.floor(totalClicks * 0.1), percentage: 10 }
      ];

      // Browser breakdown
      const browserBreakdown: LinkAnalytics["browserBreakdown"] = [
        { browser: "Chrome", count: Math.floor(totalClicks * 0.5), percentage: 50 },
        { browser: "Safari", count: Math.floor(totalClicks * 0.2), percentage: 20 },
        { browser: "Firefox", count: Math.floor(totalClicks * 0.15), percentage: 15 },
        { browser: "Edge", count: Math.floor(totalClicks * 0.1), percentage: 10 },
        { browser: "Other", count: Math.floor(totalClicks * 0.05), percentage: 5 }
      ];

      // Location breakdown
      const locationBreakdown: LinkAnalytics["locationBreakdown"] = [
        { location: "United States", count: Math.floor(totalClicks * 0.4), percentage: 40 },
        { location: "India", count: Math.floor(totalClicks * 0.2), percentage: 20 },
        { location: "United Kingdom", count: Math.floor(totalClicks * 0.15), percentage: 15 },
        { location: "Germany", count: Math.floor(totalClicks * 0.1), percentage: 10 },
        { location: "Canada", count: Math.floor(totalClicks * 0.05), percentage: 5 },
        { location: "Other", count: Math.floor(totalClicks * 0.1), percentage: 10 }
      ];

      return {
        timeSeriesData,
        deviceBreakdown,
        browserBreakdown,
        locationBreakdown,
        totalClicks
      };
    } catch (error) {
      
      toast({
        title: "Error fetching analytics",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const generateQrCode = async (url: string): Promise<string> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // In a real app, you would call an API to generate a QR code
      // For now, we'll just return a mock QR code image URL
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
      
      
      toast({
        title: "QR Code generated",
        description: "QR Code has been generated successfully",
      });
      
      return qrCodeUrl;
    } catch (error) {
      let errorMessage = "Failed to generate QR code";
      
      if (axios.isAxiosError(error) && error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      
      toast({
        title: "Error generating QR Code",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <UrlContext.Provider
      value={{
        urls,
        isLoading,
        shortenUrl,
        getAnalytics,
        generateQrCode
      }}
    >
      {children}
    </UrlContext.Provider>
  );
};

export const useUrl = () => {
  const context = useContext(UrlContext);
  if (context === undefined) {
    throw new Error("useUrl must be used within a UrlProvider");
  }
  return context;
};
