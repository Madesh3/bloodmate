import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Settings = () => {
  const { user, isAdmin } = useAuth();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeSettings = async () => {
      if (user) {
        await fetchWhatsappNumber();
      }
      setIsInitialized(true);
    };

    initializeSettings();
  }, [user]);

  const fetchWhatsappNumber = async () => {
    try {
      console.log('Fetching WhatsApp number for user:', user?.id);
      const { data, error } = await supabase
        .from('profiles')
        .select('whatsapp_number')
        .eq('id', user?.id)
        .single();

      if (error) {
        console.error('Error fetching WhatsApp number:', error);
        throw error;
      }
      
      console.log('Fetched WhatsApp number:', data?.whatsapp_number);
      setWhatsappNumber(data?.whatsapp_number || "");
    } catch (error: any) {
      console.error('Error fetching WhatsApp number:', error);
      toast.error("Failed to load WhatsApp number");
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;
      toast.success("Password updated successfully");
      setPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      console.error('Error updating password:', error);
      toast.error("Failed to update password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleWhatsappUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!whatsappNumber) {
      toast.error("Please enter a WhatsApp number");
      return;
    }

    setIsLoading(true);
    try {
      console.log('Updating WhatsApp number for user:', user?.id, 'to:', whatsappNumber);
      const { error } = await supabase
        .from('profiles')
        .update({ whatsapp_number: whatsappNumber })
        .eq('id', user?.id);

      if (error) {
        console.error('Error updating WhatsApp number:', error);
        throw error;
      }

      console.log('WhatsApp number updated successfully');
      toast.success("WhatsApp number updated successfully");
    } catch (error: any) {
      console.error('Error updating WhatsApp number:', error);
      toast.error("Failed to update WhatsApp number");
    } finally {
      setIsLoading(false);
    }
  };

  // Wait for initialization before redirecting
  if (!isInitialized) {
    return <div>Loading...</div>;
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/auth" state={{ from: "/settings" }} />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <div className="space-y-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">WhatsApp Settings</h2>
          <form onSubmit={handleWhatsappUpdate} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700">
                WhatsApp Number
              </label>
              <Input
                id="whatsapp"
                type="text"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="Enter with country code (e.g., +1234567890)"
              />
              <p className="text-sm text-muted-foreground">
                This number will be used to send notifications to donors
              </p>
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update WhatsApp Number"}
            </Button>
          </form>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Update Password</h2>
          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                minLength={6}
              />
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Settings;