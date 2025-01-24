import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Admin = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [donors, setDonors] = useState([]);
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

    fetchDonors();
    fetchWhatsappSettings();
  }, [user, isAdmin, navigate]);

  const fetchDonors = async () => {
    try {
      const { data, error } = await supabase
        .from('donors')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDonors(data || []);
    } catch (error) {
      console.error('Error fetching donors:', error);
      toast.error("Failed to load donors");
    } finally {
      setIsLoading(false);
    }
  };

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
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('donors')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setDonors(donors.filter(donor => donor.id !== id));
      toast.success("Donor deleted successfully");
    } catch (error) {
      console.error('Error deleting donor:', error);
      toast.error("Failed to delete donor");
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
      <div className="space-y-8">
        {/* WhatsApp Settings Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">WhatsApp Settings</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 mb-1">
                WhatsApp Number
              </label>
              <Input
                id="whatsapp"
                type="text"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="Enter with country code (e.g., +1234567890)"
              />
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
            </div>
            <Button 
              onClick={handleSaveWhatsappSettings}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </div>

        {/* Donors Management Section */}
        <div className="bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold p-6 border-b">Manage Donors</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Blood Group</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {donors.map((donor) => (
                <TableRow key={donor.id}>
                  <TableCell>{donor.name}</TableCell>
                  <TableCell>{donor.blood_group}</TableCell>
                  <TableCell>{donor.city}</TableCell>
                  <TableCell>
                    <div>
                      <p>{donor.phone}</p>
                      <p className="text-sm text-gray-500">{donor.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(donor.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {donors.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No donors found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;