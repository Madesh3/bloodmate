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
  const { user } = useAuth();

  useEffect(() => {
    fetchAdminWhatsappNumber();
  }, []);

  const fetchAdminWhatsappNumber = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('whatsapp_number')
        .eq('is_admin', true)
        .maybeSingle();

      if (error) throw error;
      
      if (data?.whatsapp_number) {
        setAdminWhatsappNumber(data.whatsapp_number);
      } else {
        console.log('No WhatsApp number found:', data);
        toast.error("Admin WhatsApp number not configured. Please configure it in Settings.");
      }
    } catch (error) {
      console.error('Error fetching admin WhatsApp number:', error);
      toast.error("Failed to load admin contact details. Please try again later.");
    }
  };

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const handleBulkWhatsApp = async () => {
    if (!adminWhatsappNumber) {
      toast.error("Admin WhatsApp number not configured. Please configure it in Settings.");
      return;
    }

    if (selectedDonors.length === 0) {
      toast.error("Please select at least one donor");
      return;
    }

    setIsSendingMessages(true);
    const message = encodeURIComponent(`Need blood donation. Please contact admin at: wa.me/${adminWhatsappNumber}`);
    const selectedDonorsList = donors.filter(donor => selectedDonors.includes(donor.id));

    try {
      const messages = selectedDonorsList.map(donor => ({
        donor_id: donor.id,
        message_text: `Need blood donation. Please contact admin at: wa.me/${adminWhatsappNumber}`,
        message_type: 'whatsapp'
      }));

      const { error } = await supabase
        .from('messages')
        .insert(messages);

      if (error) throw error;

      for (const donor of selectedDonorsList) {
        const phoneNumber = donor.phone.replace(/\D/g, '');
        window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
        toast.success(`Opening WhatsApp for ${donor.name}`);
        await delay(2000);
      }

      toast.success(`WhatsApp opened for all ${selectedDonors.length} donors`);
      onComplete();
    } catch (error) {
      console.error('Error sending messages:', error);
      toast.error("Failed to send messages. Please try again later.");
    } finally {
      setIsSendingMessages(false);
    }
  };

  return (
    <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow">
      <span>{selectedDonors.length} donors selected</span>
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