import { Link } from "react-router-dom";
import { Settings, LogOut } from "lucide-react";
import { Button } from "../ui/button";

interface MobileMenuProps {
  user: any;
  isAdmin: boolean;
  onSignOut: () => void;
}

const MobileMenu = ({ user, isAdmin, onSignOut }: MobileMenuProps) => {
  return (
    <div className="flex flex-col space-y-4 mt-6">
      {isAdmin && (
        <Button asChild variant="ghost" className="justify-start">
          <Link to="/settings" className="flex items-center">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Link>
        </Button>
      )}
      <Link to="/" className="text-lg">Home</Link>
      <Link to="/directory" className="text-lg">Directory</Link>
      {user ? (
        <>
          {isAdmin && (
            <Link to="/admin" className="text-lg">Admin</Link>
          )}
          <Button variant="ghost" onClick={onSignOut} className="justify-start">
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </>
      ) : (
        <>
          <Link to="/auth" className="text-lg">Sign In</Link>
          <Button asChild>
            <Link to="/become-donor">Become a Donor</Link>
          </Button>
        </>
      )}
    </div>
  );
};

export default MobileMenu;