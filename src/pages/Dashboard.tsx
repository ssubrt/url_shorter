
import React, { useState } from "react";
import { useUrl } from "@/context/UrlContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Calendar as CalendarIcon, Loader2, Plus, Link, Copy, QrCode, ExternalLink, BarChart, RefreshCw } from "lucide-react";
import Header from "@/components/Header";
import { Navigate } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import { ShortenedUrl } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const Dashboard: React.FC = () => {
  const { urls, isLoading, shortenUrl, generateQrCode } = useUrl();
  const { isAuthenticated } = useAuth();
  const [originalUrl, setOriginalUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [selectedUrl, setSelectedUrl] = useState<ShortenedUrl | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await shortenUrl(
        originalUrl, 
        customAlias || undefined, 
        date ? date.toISOString() : undefined
      );
      setOriginalUrl("");
      setCustomAlias("");
      setDate(undefined);
    } catch (error) {
      console.error("Error shortening URL:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied to clipboard",
        description: "The URL has been copied to your clipboard",
      });
    });
  };

  const handleQrCode = async (url: ShortenedUrl) => {
    try {
      const qrCodeUrl = await generateQrCode(url.fullShortUrl);
      setQrUrl(qrCodeUrl);
      setSelectedUrl(url);
    } catch (error) {
      console.error("Error generating QR code:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">Link Analytics Dashboard</h1>
        
        {/* URL Shortener Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Create Short Link</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Long URL</label>
                <Input
                  value={originalUrl}
                  onChange={(e) => setOriginalUrl(e.target.value)}
                  placeholder="https://example.com/your-long-url"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Custom Alias (optional)</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md text-gray-500 text-sm">
                      deco.id/
                    </span>
                    <Input
                      value={customAlias}
                      onChange={(e) => setCustomAlias(e.target.value)}
                      placeholder="custom-alias"
                      className="rounded-l-none"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Expiration Date (optional)</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="gradient-bg"
                disabled={submitting || !originalUrl}
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Shortening...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Shorten URL
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        
        
        {/* URLs Table */}
        <Card>
          <CardHeader>
            <CardTitle>Your Shortened URLs</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : urls.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Link className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p>No URLs yet. Create your first shortened link above!</p>
                {/* <p>No URLs found. {searchTerm ? "Try a different search term." : "Create your first shortened link above!"}</p> */}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Original URL</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Short URL</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Created</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Expires</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Clicks</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {urls.map((url) => (
                      <tr
                        key={url.id}
                        className="border-b border-gray-200 hover:bg-gray-50"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <ExternalLink className="h-4 w-4 text-gray-400 flex-shrink-0" />
                            <span className="truncate max-w-[150px]">
                              {url.originalUrl}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className="text-brand-600 font-medium">{url.fullShortUrl}</span>
                            <button
                              onClick={() => handleCopy(url.fullShortUrl)}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              <Copy className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {new Date(url.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {url.expiresAt
                            ? new Date(url.expiresAt).toLocaleDateString()
                            : "Never"}
                        </td>
                        <td className="py-3 px-4 font-medium">{url.clickCount}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleQrCode(url)}
                              title="Generate QR Code"
                            >
                              <QrCode className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              title="View Analytics"
                              onClick={() => window.location.href = `/analytics/${url.id}`}
                            >
                              <BarChart className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* QR Code Dialog */}
        <Dialog open={qrUrl !== null} onOpenChange={(open) => !open && setQrUrl(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>QR Code for {selectedUrl?.shortCode}</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center justify-center p-4">
              {qrUrl && (
                <img 
                  src={qrUrl} 
                  alt="QR Code" 
                  className="w-48 h-48 mb-4"
                />
              )}
              <p className="text-sm text-gray-500 mb-4">
                Scan this QR code to access your shortened URL
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQrUrl(null)}
                >
                  Close
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    if (qrUrl) {
                      window.open(qrUrl, '_blank');
                    }
                  }}
                >
                  Download
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default Dashboard;
