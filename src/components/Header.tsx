
import React from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import { BarChart3, Link2, LogOut } from "lucide-react";

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 py-4">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md gradient-bg flex items-center justify-center">
            <Link2 className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold gradient-text">DecoID</span>
        </Link>
        
        {user && (
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              Logged in as <span className="font-medium">{user.email}</span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={logout}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Log out
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
