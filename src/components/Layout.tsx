import { Link, useNavigate } from "react-router-dom";
import { Heart, Menu } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import MobileNavigation from "./MobileNavigation";
import { useAuth } from "./AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import DesktopNav from "./navigation/DesktopNav";
import MobileMenu from "./navigation/MobileMenu";
import Footer from "./navigation/Footer";

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
            
            <DesktopNav user={user} isAdmin={isAdmin} onSignOut={handleSignOut} />

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <MobileMenu user={user} isAdmin={isAdmin} onSignOut={handleSignOut} />
              </SheetContent>
            </Sheet>
          </nav>
        </div>
      </header>

      <main className="flex-1 pb-16 md:pb-0">
        {children}
      </main>

      <MobileNavigation />
      <Footer />
    </div>
  );
};

export default Layout;