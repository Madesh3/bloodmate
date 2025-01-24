import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";

interface BulkMessageControlProps {
  selectedDonors: string[];
  donors: any[];
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

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        throw profileError;
      }

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

      if (adminError) {
        console.error('Error fetching admin profile:', adminError);
        throw adminError;
      }

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

  const getRandomDelay = () => Math.floor(Math.random() * (15000 - 8000 + 1) + 8000);

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

      // Send messages with random delays
      for (let i = 0; i < selectedDonorsList.length; i++) {
        const donor = selectedDonorsList[i];
        const phoneNumber = donor.phone.replace(/\D/g, '');
        const message = encodeURIComponent(`Need blood donation. Please contact admin at: wa.me/${adminWhatsappNumber}`);
        
        // Update progress
        setProgress(Math.round(((i + 1) / selectedDonorsList.length) * 100));
        
        // Use the WhatsApp API URL format
        const whatsappUrl = `https://api.whatsapp.com/send/?phone=${phoneNumber}&text=${message}&type=phone_number&app_absent=0`;
        window.open(whatsappUrl, '_blank');
        
        toast.success(`Opening WhatsApp for ${donor.name} (${i + 1}/${selectedDonorsList.length})`);
        
        // Add random delay between messages
        if (i < selectedDonorsList.length - 1) {
          const delay = getRandomDelay();
          toast.info(`Waiting ${Math.round(delay/1000)} seconds before sending next message...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }

      toast.success(`WhatsApp opened for all ${selectedDonors.length} donors`);
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