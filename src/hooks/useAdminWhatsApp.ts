import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/components/AuthProvider";

export const useAdminWhatsApp = () => {
  const [adminWhatsappNumber, setAdminWhatsappNumber] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchAdminWhatsappNumber();
  }, []);

  const fetchAdminWhatsappNumber = async () => {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('whatsapp_number, is_admin')
        .eq('id', user?.id)
        .single();

      if (profileError) throw profileError;

      if (profileData?.is_admin && profileData?.whatsapp_number) {
        setAdminWhatsappNumber(profileData.whatsapp_number);
        return;
      }

      const { data: adminData, error: adminError } = await supabase
        .from('profiles')
        .select('whatsapp_number')
        .eq('is_admin', true)
        .not('whatsapp_number', 'is', null)
        .maybeSingle();

      if (adminError) throw adminError;

      if (adminData?.whatsapp_number) {
        setAdminWhatsappNumber(adminData.whatsapp_number);
      } else {
        toast.error("Admin WhatsApp number not configured. Please configure it in Settings.");
      }
    } catch (error) {
      console.error('Error fetching admin WhatsApp number:', error);
      toast.error("Failed to load admin contact details. Please try again later.");
    }
  };

  return { adminWhatsappNumber };
};