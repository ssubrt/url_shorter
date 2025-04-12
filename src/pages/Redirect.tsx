
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";

const Redirect: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!code) {
      setError("Invalid URL");
      return;
    }

    // In a real application, this would be an API call to your backend
    // For demo purposes, we'll simulate a redirect after a delay
    const redirectWithTracking = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        // In a real app, this would redirect to the actual URL from the database
        // For demo, we'll redirect to a default URL
        window.location.href = "https://example.com";
      } catch (error) {
        setError("An error occurred while redirecting");
        console.error("Redirect error:", error);
      }
    };

    redirectWithTracking();
  }, [code]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Oops!</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <a
            href="/"
            className="text-brand-600 hover:text-brand-700 font-medium"
          >
            Return to homepage
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-brand-600 mx-auto mb-6" />
        <h1 className="text-xl font-semibold text-gray-800 mb-2">Redirecting you...</h1>
        <p className="text-gray-600">Please wait while we take you to your destination</p>
      </div>
    </div>
  );
};

export default Redirect;
