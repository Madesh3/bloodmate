import { Home, Users, Heart } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const MobileNavigation = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t md:hidden">
      <nav className="flex justify-around items-center h-16">
        <Link 
          to="/" 
          className={`flex flex-col items-center space-y-1 ${
            isActive('/') ? 'text-primary' : 'text-gray-500'
          }`}
        >
          <Home size={24} />
          <span className="text-xs">Home</span>
        </Link>
        <Link 
          to="/directory" 
          className={`flex flex-col items-center space-y-1 ${
            isActive('/directory') ? 'text-primary' : 'text-gray-500'
          }`}
        >
          <Users size={24} />
          <span className="text-xs">Directory</span>
        </Link>
        <Link 
          to="/become-donor" 
          className={`flex flex-col items-center space-y-1 ${
            isActive('/become-donor') ? 'text-primary' : 'text-gray-500'
          }`}
        >
          <Heart size={24} />
          <span className="text-xs">Donate</span>
        </Link>
      </nav>
    </div>
  );
};

export default MobileNavigation;