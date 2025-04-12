
export interface User {
  id: string;
  email: string;
}

export interface ShortenedUrl {
  id: string;
  originalUrl: string;
  shortCode: string;
  fullShortUrl: string;
  createdAt: string;
  expiresAt?: string;
  userId: string;
  clickCount: number;
}

export interface ClickData {
  id: string;
  linkId: string;
  timestamp: string;
  deviceType: string;
  browser: string;
  location: string;
  ipAddress: string;
}

export interface TimeSeriesData {
  date: string;
  clicks: number;
}

export interface DeviceBreakdown {
  device: string;
  count: number;
  percentage: number;
}

export interface BrowserBreakdown {
  browser: string;
  count: number;
  percentage: number;
}

export interface LocationBreakdown {
  location: string;
  count: number;
  percentage: number;
}

export interface LinkAnalytics {
  timeSeriesData: TimeSeriesData[];
  deviceBreakdown: DeviceBreakdown[];
  browserBreakdown: BrowserBreakdown[];
  locationBreakdown: LocationBreakdown[];
  totalClicks: number;
}
