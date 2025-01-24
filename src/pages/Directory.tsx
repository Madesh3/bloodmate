import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useAuth } from "@/components/AuthProvider";
import { Send, MessageSquare } from "lucide-react";

const Directory = () => {
  const [searchBloodGroup, setSearchBloodGroup] = useState("");
  const [searchCity, setSearchCity] = useState("");
  const { isAdmin } = useAuth();
  const adminPhone = "9777128214"; // Admin WhatsApp number

  const { data: donors, isLoading } = useQuery({
    queryKey: ["donors", searchBloodGroup, searchCity],
    queryFn: async () => {
      let query = supabase.from("donors").select("*");

      if (searchBloodGroup && searchBloodGroup !== "all") {
        query = query.eq("blood_group", searchBloodGroup);
      }
      
      if (searchCity) {
        query = query.ilike("city", `%${searchCity}%`);
      }

      const { data, error } = await query.order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  const handleSendWhatsApp = async (donor: any) => {
    try {
      // Create message record in database
      const { error: messageError } = await supabase
        .from("messages")
        .insert({
          donor_id: donor.id,
          message_text: `Hello ${donor.name}, we need blood donors with ${donor.blood_group} blood group. Please contact us if you're available.`,
          status: 'pending',
          message_type: 'whatsapp'
        });

      if (messageError) throw messageError;

      // Call the Edge Function to get WhatsApp URL
      const { data, error } = await supabase.functions.invoke('send-whatsapp', {
        body: {
          phone: donor.phone,
          message: `Hello ${donor.name}, we need blood donors with ${donor.blood_group} blood group. Please contact us at ${adminPhone} if you're available.`
        }
      });

      if (error) throw error;

      // Open WhatsApp in new window
      window.open(data.url, '_blank');
      
      // Update message status
      await supabase
        .from("messages")
        .update({ status: 'sent' })
        .eq('donor_id', donor.id)
        .order('created_at', { ascending: false })
        .limit(1);

      toast.success("WhatsApp message initiated");
    } catch (error) {
      console.error("Error sending WhatsApp message:", error);
      toast.error("Failed to send WhatsApp message");
    }
  };

  const handleSendBulkWhatsApp = async () => {
    try {
      if (!donors || donors.length === 0) {
        toast.error("No donors found matching the criteria");
        return;
      }

      // Send messages to all filtered donors
      for (const donor of donors) {
        await handleSendWhatsApp(donor);
      }

      toast.success(`Sent messages to ${donors.length} donors`);
    } catch (error) {
      console.error("Error sending bulk WhatsApp messages:", error);
      toast.error("Failed to send some WhatsApp messages");
    }
  };

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="relative">
          <Select value={searchBloodGroup} onValueChange={setSearchBloodGroup}>
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder="Select Blood Group" />
            </SelectTrigger>
            <SelectContent className="bg-white z-[100] relative">
              <SelectItem value="all">All Blood Groups</SelectItem>
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((group) => (
                <SelectItem key={group} value={group}>
                  {group}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-4">
          <Input
            placeholder="Search by city..."
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
            className="bg-white flex-1"
          />
          {isAdmin && (donors?.length ?? 0) > 0 && (
            <Button
              onClick={handleSendBulkWhatsApp}
              className="flex items-center gap-2 whitespace-nowrap"
            >
              <MessageSquare className="h-4 w-4" />
              Notify All
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {donors?.map((donor) => (
          <Card key={donor.id} className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{donor.name}</h3>
                <p className="text-red-600 font-bold">{donor.blood_group}</p>
                <p className="text-gray-600">{donor.city}</p>
                <p className="text-gray-600">{donor.phone}</p>
                <p className="text-gray-600">{donor.email}</p>
              </div>
              {isAdmin && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleSendWhatsApp(donor)}
                  title="Send WhatsApp Message"
                >
                  <Send className="h-4 w-4" />
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      {(!donors || donors.length === 0) && (
        <div className="text-center py-8 text-gray-500">
          No donors found matching your search criteria
        </div>
      )}
    </div>
  );
};

export default Directory;