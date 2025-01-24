import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { sendWhatsAppMessage } from "@/utils/whatsapp";
import { useAdminWhatsApp } from "@/hooks/useAdminWhatsApp";
import MessageProgress from "./MessageProgress";

interface BulkMessageControlProps {
  selectedDonors: string[];
  donors: Tables<'donors'>[];
  onComplete: () => void;
}

const BulkMessageControl = ({ selectedDonors, donors, onComplete }: BulkMessageControlProps) => {
  const [isSendingMessages, setIsSendingMessages] = useState(false);
  const [progress, setProgress] = useState(0);
  const { adminWhatsappNumber } = useAdminWhatsApp();

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
        message_text: `Blood donation request sent to ${donor.name}`,
        message_type: 'whatsapp'
      }));

      const { error } = await supabase.from('messages').insert(messages);
      if (error) throw error;

      for (let i = 0; i < selectedDonorsList.length; i++) {
        const donor = selectedDonorsList[i];
        setProgress(Math.round(((i + 1) / selectedDonorsList.length) * 100));
        
        try {
          await sendWhatsAppMessage(
            donor.phone,
            donor.name,
            adminWhatsappNumber
          );
          toast.success(`Message sent to ${donor.name} (${i + 1}/${selectedDonorsList.length})`);
        } catch (error: any) {
          toast.error(`Failed to send message to ${donor.name}: ${error.message}`);
        }
        
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
      <MessageProgress progress={progress} selectedCount={selectedDonors.length} />
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