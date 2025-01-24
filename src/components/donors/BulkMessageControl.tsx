import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import type { Tables } from "@/integrations/supabase/types";

interface BulkMessageControlProps {
  selectedDonors: string[];
  donors: Tables<'donors'>[];
  onComplete: () => void;
}

const BulkMessageControl = ({ selectedDonors, donors, onComplete }: BulkMessageControlProps) => {
  const [isSendingMessages, setIsSendingMessages] = useState(false);
  const [adminWhatsappNumber, setAdminWhatsappNumber] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
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

  const sendWhatsAppMessage = async (phoneNumber: string, message: string) => {
    try {
      // Fetch WhatsApp API credentials from secrets
      const { data: secretsData, error: secretsError } = await supabase
        .from('secrets')
        .select('*')
        .in('name', ['WHATSAPP_API_TOKEN', 'WHATSAPP_PHONE_NUMBER_ID']);

      if (secretsError) throw secretsError;

      const apiToken = secretsData?.find((s: Tables<'secrets'>) => s.name === 'WHATSAPP_API_TOKEN')?.secret;
      const phoneNumberId = secretsData?.find((s: Tables<'secrets'>) => s.name === 'WHATSAPP_PHONE_NUMBER_ID')?.secret;

      if (!apiToken || !phoneNumberId) {
        throw new Error('WhatsApp API credentials not configured');
      }

      const response = await fetch(`https://graph.facebook.com/v17.0/${phoneNumberId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: phoneNumber,
          type: "template",
          template: {
            name: "blood_donation_request",
            language: {
              code: "en"
            },
            components: [
              {
                type: "body",
                parameters: [
                  {
                    type: "text",
                    text: adminWhatsappNumber || ""
                  }
                ]
              }
            ]
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`WhatsApp API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      throw error;
    }
  };

  const handleBulkWhatsApp = async () => {
    if (!adminWhatsappNumber) {
      toast.error("Admin WhatsApp number not configured. Please configure it in Settings.");
      return;
    }

    if (selectedDonors.length === 0) {
      toast.error("Please select at least one donor");
      return;
    }

    if (selectedDonors.length > 15) {
      toast.error("For safety, please select 15 or fewer donors at a time");
      return;
    }

    setIsSendingMessages(true);
    const selectedDonorsList = donors.filter(donor => selectedDonors.includes(donor.id));

    try {
      const messages = selectedDonorsList.map(donor => ({
        donor_id: donor.id,
        message_text: `Need blood donation. Please contact admin at: wa.me/${adminWhatsappNumber}`,
        message_type: 'whatsapp'
      }));

      // Log messages to database first
      const { error } = await supabase
        .from('messages')
        .insert(messages);

      if (error) throw error;

      // Send messages with delays
      for (let i = 0; i < selectedDonorsList.length; i++) {
        const donor = selectedDonorsList[i];
        const phoneNumber = donor.phone.replace(/\D/g, '');
        
        setProgress(Math.round(((i + 1) / selectedDonorsList.length) * 100));
        
        try {
          await sendWhatsAppMessage(
            phoneNumber,
            `Need blood donation. Please contact admin at: wa.me/${adminWhatsappNumber}`
          );
          toast.success(`Message sent to ${donor.name} (${i + 1}/${selectedDonorsList.length})`);
        } catch (error) {
          toast.error(`Failed to send message to ${donor.name}`);
        }
        
        // Add delay between messages
        if (i < selectedDonorsList.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      toast.success(`Messages sent to all ${selectedDonors.length} donors`);
      onComplete();
    } catch (error) {
      console.error('Error sending messages:', error);
      toast.error("Failed to send messages. Please try again later.");
    } finally {
      setIsSendingMessages(false);
      setProgress(0);
    }
  };

  return (
    <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow">
      <div className="flex flex-col">
        <span>{selectedDonors.length} donors selected</span>
        {progress > 0 && <span className="text-sm text-gray-500">Progress: {progress}%</span>}
      </div>
      <Button
        onClick={handleBulkWhatsApp}
        className="flex items-center gap-2 bg-rose-400 hover:bg-rose-500 text-white"
        disabled={isSendingMessages || selectedDonors.length === 0}
      >
        <MessageSquare className="w-4 h-4" />
        {isSendingMessages ? 'Sending Messages...' : 'Send WhatsApp to Selected'}
      </Button>
    </div>
  );
};

export default BulkMessageControl;