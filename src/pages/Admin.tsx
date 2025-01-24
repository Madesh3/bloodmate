import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import type { Tables } from "@/integrations/supabase/types";

const Admin = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [whatsappToken, setWhatsappToken] = useState("");
  const [phoneNumberId, setPhoneNumberId] = useState("");
  const [businessAccountId, setBusinessAccountId] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    console.log("Auth state:", { user, isAdmin });
    if (!user) {
      navigate('/auth');
      return;
    }
    
    if (!isAdmin) {
      navigate('/');
      toast.error("You don't have permission to access this page");
      return;
    }

    fetchSettings();
  }, [user, isAdmin, navigate]);

  const fetchSettings = async () => {
    try {
      console.log("Fetching settings...");
      
      // Fetch WhatsApp number from profiles
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('whatsapp_number')
        .eq('id', user?.id)
        .single();

      if (profileError) {
        console.error('Profile fetch error:', profileError);
        throw profileError;
      }
      
      console.log("Profile data:", profileData);
      setWhatsappNumber(profileData?.whatsapp_number || "");

      // Fetch WhatsApp API settings from secrets
      const { data: secretsData, error: secretsError } = await supabase
        .from('secrets')
        .select('*')
        .in('name', ['WHATSAPP_API_TOKEN', 'WHATSAPP_PHONE_NUMBER_ID', 'WHATSAPP_BUSINESS_ACCOUNT_ID']);

      if (secretsError && secretsError.code !== 'PGRST116') {
        console.error('Secrets fetch error:', secretsError);
        throw secretsError;
      }

      console.log("Secrets data:", secretsData);

      if (secretsData) {
        secretsData.forEach((secret: Tables<'secrets'>) => {
          switch (secret.name) {
            case 'WHATSAPP_API_TOKEN':
              setWhatsappToken(secret.secret || "");
              break;
            case 'WHATSAPP_PHONE_NUMBER_ID':
              setPhoneNumberId(secret.secret || "");
              break;
            case 'WHATSAPP_BUSINESS_ACCOUNT_ID':
              setBusinessAccountId(secret.secret || "");
              break;
          }
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error("Failed to load settings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      console.log("Saving settings...");
      
      // Update WhatsApp number in profiles
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ whatsapp_number: whatsappNumber })
        .eq('id', user?.id);

      if (profileError) {
        console.error('Profile update error:', profileError);
        throw profileError;
      }

      // Update WhatsApp API settings in secrets
      const secrets = [
        { name: 'WHATSAPP_API_TOKEN', secret: whatsappToken },
        { name: 'WHATSAPP_PHONE_NUMBER_ID', secret: phoneNumberId },
        { name: 'WHATSAPP_BUSINESS_ACCOUNT_ID', secret: businessAccountId }
      ];

      for (const secretData of secrets) {
        console.log("Updating secret:", secretData.name);
        
        const { error } = await supabase
          .from('secrets')
          .upsert(secretData, { 
            onConflict: 'name',
            ignoreDuplicates: false 
          });
        
        if (error) {
          console.error('Secret update error:', error);
          throw error;
        }
      }

      toast.success("Settings updated successfully");
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error("Failed to update settings");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>WhatsApp Configuration</CardTitle>
            <CardDescription>Configure your WhatsApp Business API settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="whatsapp">Admin WhatsApp Number</Label>
              <Input
                id="whatsapp"
                type="text"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="Enter with country code (e.g., +1234567890)"
              />
              <p className="text-sm text-gray-500">
                Enter the number with country code that donors can contact
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="token">WhatsApp API Token</Label>
              <Input
                id="token"
                type="password"
                value={whatsappToken}
                onChange={(e) => setWhatsappToken(e.target.value)}
                placeholder="Enter your WhatsApp API token"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumberId">Phone Number ID</Label>
              <Input
                id="phoneNumberId"
                type="text"
                value={phoneNumberId}
                onChange={(e) => setPhoneNumberId(e.target.value)}
                placeholder="Enter your WhatsApp Phone Number ID"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessAccountId">Business Account ID</Label>
              <Input
                id="businessAccountId"
                type="text"
                value={businessAccountId}
                onChange={(e) => setBusinessAccountId(e.target.value)}
                placeholder="Enter your WhatsApp Business Account ID"
              />
            </div>

            <Button 
              onClick={handleSaveSettings}
              disabled={isSaving}
              className="w-full"
            >
              {isSaving ? 'Saving...' : 'Save Settings'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;