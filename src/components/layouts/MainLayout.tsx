
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Compass, ShoppingBag, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  // Determine if we're on a specific page
  const isRoute = (route: string) => location.pathname === route;
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Header */}
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
        <div className="container flex h-14 items-center justify-between">
          <h1 className="text-xl font-semibold text-leaf-700">
            Bloom
          </h1>
          
          {user && (
            <Avatar 
              className="cursor-pointer h-9 w-9 border border-border"
              onClick={() => navigate('/profile')}
            >
              <AvatarImage src={user.photoURL} alt={user.name} />
              <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
          )}
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-1 container pb-20">
        {children}
      </main>
      
      {/* Bottom Navigation */}
      {user && (
        <nav className="sticky bottom-0 z-10 bg-background border-t">
          <div className="container flex justify-around py-2">
            <button 
              onClick={() => navigate('/explore')}
              className={`nav-item ${isRoute('/explore') ? 'active' : ''}`}
            >
              <Compass size={24} />
              <span className="text-xs">Explore</span>
            </button>
            
            <button 
              onClick={() => navigate('/sell')}
              className={`nav-item ${isRoute('/sell') ? 'active' : ''}`}
            >
              <ShoppingBag size={24} />
              <span className="text-xs">Sell</span>
            </button>
            
            <button 
              onClick={() => navigate('/community')}
              className={`nav-item ${isRoute('/community') ? 'active' : ''}`}
            >
              <Users size={24} />
              <span className="text-xs">Community</span>
            </button>
          </div>
        </nav>
      )}
    </div>
  );
};

export default MainLayout;
