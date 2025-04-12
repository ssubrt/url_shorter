
import React, { useEffect, useState } from "react";
import { useParams, Link as RouterLink, Navigate } from "react-router-dom";
import Header from "@/components/Header";
import { useUrl } from "@/context/UrlContext";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShortenedUrl, LinkAnalytics } from "@/types";
import { ArrowLeft, Copy, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { BarChart, LineChart, PieChart, Cell, Legend, Tooltip, ResponsiveContainer, 
  XAxis, YAxis, CartesianGrid, Bar, Line, Pie } from "recharts";

const Analytics: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { urls, getAnalytics, isLoading } = useUrl();
  const { isAuthenticated } = useAuth();
  const [url, setUrl] = useState<ShortenedUrl | null>(null);
  const [analytics, setAnalytics] = useState<LinkAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const foundUrl = urls.find(u => u.id === id);
      if (foundUrl) {
        setUrl(foundUrl);
        loadAnalytics(id);
      } else {
        setLoading(false);
      }
    }
  }, [id, urls]);

  const loadAnalytics = async (urlId: string) => {
    setLoading(true);
    try {
      const data = await getAnalytics(urlId);
      setAnalytics(data);
    } catch (error) {
      console.error("Error loading analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-6 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </main>
      </div>
    );
  }

  if (!url) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-6">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">URL Not Found</h2>
            <p className="mb-6 text-gray-600">
              The URL you're looking for doesn't exist or you don't have access to it.
            </p>
            <Button asChild>
              <RouterLink to="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </RouterLink>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied to clipboard",
        description: "The URL has been copied to your clipboard",
      });
    });
  };

  // Colors for charts
  const COLORS = ['#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe', '#ede9fe'];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="mb-6">
          <Button variant="outline" size="sm" asChild>
            <RouterLink to="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </RouterLink>
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Link Analytics</h1>
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Original URL:</span>
              <a 
                href={url.originalUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-brand-600 hover:underline flex items-center gap-1"
              >
                <span className="truncate max-w-xs">{url.originalUrl}</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Short URL:</span>
              <span className="text-brand-600 font-medium">{url.fullShortUrl}</span>
              <button
                onClick={() => handleCopy(url.fullShortUrl)}
                className="text-gray-500 hover:text-gray-700"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {analytics ? (
          <div className="space-y-8">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    Total Clicks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{analytics.totalClicks}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    Creation Date
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-medium">
                    {new Date(url.createdAt).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    Expiration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-medium">
                    {url.expiresAt 
                      ? new Date(url.expiresAt).toLocaleDateString()
                      : "Never"
                    }
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Clicks Over Time */}
            <Card>
              <CardHeader>
                <CardTitle>Clicks Over Time</CardTitle>
                <CardDescription>
                  Number of clicks on your shortened URL over the last 14 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={analytics.timeSeriesData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={(date) => {
                          const d = new Date(date);
                          return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                        }}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => [value, 'Clicks']}
                        labelFormatter={(label) => {
                          const d = new Date(label);
                          return d.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="clicks" 
                        stroke="#8b5cf6" 
                        strokeWidth={2}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Device, Browser and Location Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Device Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Device Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={analytics.deviceBreakdown}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          fill="#8884d8"
                          paddingAngle={5}
                          dataKey="count"
                          label={({ device, percentage }) => `${device}: ${percentage}%`}
                        >
                          {analytics.deviceBreakdown.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value, name, props) => [`${value} clicks (${props.payload.percentage}%)`, props.payload.device]} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Browser Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Browser Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={analytics.browserBreakdown}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="browser" />
                        <YAxis />
                        <Tooltip formatter={(value, name, props) => [`${value} clicks (${props.payload.percentage}%)`, props.payload.browser]} />
                        <Bar dataKey="count" fill="#8b5cf6">
                          {analytics.browserBreakdown.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Location Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Location Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        layout="vertical"
                        data={analytics.locationBreakdown}
                        margin={{ top: 20, right: 30, left: 80, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis 
                          type="category" 
                          dataKey="location" 
                          width={80}
                        />
                        <Tooltip formatter={(value, name, props) => [`${value} clicks (${props.payload.percentage}%)`, props.payload.location]} />
                        <Bar dataKey="count" fill="#8b5cf6">
                          {analytics.locationBreakdown.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Loading analytics data...</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Analytics;
