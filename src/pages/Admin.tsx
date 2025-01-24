import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Admin = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [whatsappDelay, setWhatsappDelay] = useState("10");
  const [maxBulkMessages, setMaxBulkMessages] = useState("15");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    if (!isAdmin) {
      navigate('/');
      toast.error("You don't have permission to access this page");
      return;
    }

    fetchWhatsappSettings();
  }, [user, isAdmin, navigate]);

  const fetchWhatsappSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('whatsapp_number, whatsapp_delay, max_bulk_messages')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      
      setWhatsappNumber(data?.whatsapp_number || "");
      setWhatsappDelay(data?.whatsapp_delay?.toString() || "10");
      setMaxBulkMessages(data?.max_bulk_messages?.toString() || "15");
    } catch (error) {
      console.error('Error fetching WhatsApp settings:', error);
      toast.error("Failed to load WhatsApp settings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveWhatsappSettings = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          whatsapp_number: whatsappNumber,
          whatsapp_delay: parseInt(whatsappDelay),
          max_bulk_messages: parseInt(maxBulkMessages)
        })
        .eq('id', user?.id);

      if (error) throw error;
      toast.success("WhatsApp settings updated successfully");
    } catch (error) {
      console.error('Error updating WhatsApp settings:', error);
      toast.error("Failed to update WhatsApp settings");
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
        {/* WhatsApp API Configuration Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-6">WhatsApp API Configuration</h2>
          <div className="space-y-6">
            <div>
              <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 mb-1">
                WhatsApp Business Phone Number
              </label>
              <Input
                id="whatsapp"
                type="text"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="Enter with country code (e.g., +1234567890)"
              />
              <p className="mt-1 text-sm text-gray-500">
                This number must be registered with WhatsApp Business API
              </p>
            </div>

            <div>
              <label htmlFor="delay" className="block text-sm font-medium text-gray-700 mb-1">
                Message Delay (seconds)
              </label>
              <Input
                id="delay"
                type="number"
                min="5"
                max="30"
                value={whatsappDelay}
                onChange={(e) => setWhatsappDelay(e.target.value)}
                placeholder="Delay between messages (5-30 seconds)"
              />
              <p className="mt-1 text-sm text-gray-500">
                Minimum delay between consecutive messages
              </p>
            </div>

            <div>
              <label htmlFor="maxMessages" className="block text-sm font-medium text-gray-700 mb-1">
                Maximum Bulk Messages
              </label>
              <Input
                id="maxMessages"
                type="number"
                min="1"
                max="50"
                value={maxBulkMessages}
                onChange={(e) => setMaxBulkMessages(e.target.value)}
                placeholder="Maximum number of messages in bulk"
              />
              <p className="mt-1 text-sm text-gray-500">
                Maximum number of messages that can be sent in one batch
              </p>
            </div>

            <Button 
              onClick={handleSaveWhatsappSettings}
              disabled={isSaving}
              className="w-full"
            >
              {isSaving ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;