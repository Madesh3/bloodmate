import { Link } from "react-router-dom";
import { Settings, LogOut } from "lucide-react";
import { Button } from "../ui/button";

interface DesktopNavProps {
  user: any;
  isAdmin: boolean;
  onSignOut: () => void;
}

const DesktopNav = ({ user, isAdmin, onSignOut }: DesktopNavProps) => {
  return (
    <div className="hidden md:flex items-center space-x-6">
      {isAdmin && (
        <Button asChild variant="ghost" size="sm">
          <Link to="/settings" className="flex items-center">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Link>
        </Button>
      )}
      <Link to="/" className="text-gray-600 hover:text-gray-900">Home</Link>
      <Link to="/directory" className="text-gray-600 hover:text-gray-900">Directory</Link>
      {user ? (
        <>
          {isAdmin && (
            <Link to="/admin" className="text-gray-600 hover:text-gray-900">Admin</Link>
          )}
          <Button variant="ghost" size="sm" onClick={onSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </>
      ) : (
        <>
          <Button asChild variant="ghost">
            <Link to="/auth">Sign In</Link>
          </Button>
          <Button asChild>
            <Link to="/become-donor">Become a Donor</Link>
          </Button>
        </>
      )}
    </div>
  );
};

export default DesktopNav;