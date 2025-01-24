import { Link, useNavigate } from "react-router-dom";
import { Heart, Menu, LogOut, Settings } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import MobileNavigation from "./MobileNavigation";
import { useAuth } from "./AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/");
        return;
      }

      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
        toast.error("Error signing out: " + error.message);
        return;
      }
      
      navigate("/");
      toast.success("Signed out successfully");
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast.error("Error signing out: " + (error.message || 'Unknown error'));
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <Heart className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">BloodMate</span>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/" className="text-gray-600 hover:text-gray-900">Home</Link>
              <Link to="/directory" className="text-gray-600 hover:text-gray-900">Directory</Link>
              {user ? (
                <>
                  {isAdmin && (
                    <>
                      <Link to="/admin" className="text-gray-600 hover:text-gray-900">Admin</Link>
                      <Link to="/settings" className="text-gray-600 hover:text-gray-900 flex items-center">
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </Link>
                    </>
                  )}
                  <Button variant="ghost" size="sm" onClick={handleSignOut}>
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

            {/* Mobile Navigation */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col space-y-4 mt-6">
                  <Link to="/" className="text-lg">Home</Link>
                  <Link to="/directory" className="text-lg">Directory</Link>
                  {user ? (
                    <>
                      {isAdmin && (
                        <>
                          <Link to="/admin" className="text-lg">Admin</Link>
                          <Link to="/settings" className="text-lg flex items-center">
                            <Settings className="h-4 w-4 mr-2" />
                            Settings
                          </Link>
                        </>
                      )}
                      <Button variant="ghost" onClick={handleSignOut}>
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
              </SheetContent>
            </Sheet>
          </nav>
        </div>
      </header>

      <main className="flex-1 pb-16 md:pb-0">
        {children}
      </main>

      <MobileNavigation />

      <footer className="bg-gray-50 border-t">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold mb-4">About BloodMate</h3>
              <p className="text-gray-600">Connecting blood donors with those in need, making a difference one donation at a time.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <div className="space-y-2">
                <Link to="/" className="block text-gray-600 hover:text-gray-900">Home</Link>
                <Link to="/directory" className="block text-gray-600 hover:text-gray-900">Directory</Link>
                <Link to="/become-donor" className="block text-gray-600 hover:text-gray-900">Become a Donor</Link>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <p className="text-gray-600">Email: support@bloodmate.com</p>
              <p className="text-gray-600">Phone: (555) 123-4567</p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-gray-600">
            <p>&copy; {new Date().getFullYear()} BloodMate. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
