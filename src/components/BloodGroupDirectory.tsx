import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "./AuthProvider";
import DonorCard from "./donors/DonorCard";
import DonorSearch from "./donors/DonorSearch";
import { Button } from "./ui/button";
import { MessageSquare } from "lucide-react";

const BloodGroupDirectory = () => {
  const [donors, setDonors] = useState([]);
  const [selectedDonors, setSelectedDonors] = useState([]);
  const [searchBloodGroup, setSearchBloodGroup] = useState("");
  const [searchCity, setSearchCity] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSendingMessages, setIsSendingMessages] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchDonors();
  }, [searchBloodGroup, searchCity]);

  const fetchDonors = async () => {
    try {
      let query = supabase.from('donors')
        .select('*')
        .order('created_at', { ascending: false });

      if (searchBloodGroup && searchBloodGroup !== "all") {
        query = query.eq('blood_group', searchBloodGroup);
      }
      
      if (searchCity) {
        query = query.ilike('city', `%${searchCity}%`);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      setDonors(data || []);
    } catch (error) {
      console.error('Error fetching donors:', error);
      toast.error("Failed to load donors. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!user) {
      toast.error("Please sign in to delete donors");
      return;
    }

    try {
      const { error } = await supabase
        .from('donors')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success("Donor deleted successfully");
      fetchDonors();
    } catch (error) {
      console.error('Error deleting donor:', error);
      toast.error("Failed to delete donor");
    }
  };

  const handleUpdate = (updatedDonor) => {
    setDonors(prevDonors => 
      prevDonors.map(donor => 
        donor.id === updatedDonor.id ? { ...donor, ...updatedDonor } : donor
      )
    );
  };

  const handleDonorSelect = (donorId) => {
    setSelectedDonors(prev => {
      if (prev.includes(donorId)) {
        return prev.filter(id => id !== donorId);
      } else {
        return [...prev, donorId];
      }
    });
  };

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const handleBulkWhatsApp = async () => {
    if (selectedDonors.length === 0) {
      toast.error("Please select at least one donor");
      return;
    }

    setIsSendingMessages(true);
    const message = encodeURIComponent("Need blood donation. Please contact if available.");
    const selectedDonorsList = donors.filter(donor => selectedDonors.includes(donor.id));

    try {
      // Store messages in the database
      const messages = selectedDonorsList.map(donor => ({
        donor_id: donor.id,
        message_text: "Need blood donation. Please contact if available.",
        message_type: 'whatsapp'
      }));

      const { error } = await supabase
        .from('messages')
        .insert(messages);

      if (error) throw error;

      // Send WhatsApp messages one by one with a delay
      for (const donor of selectedDonorsList) {
        const phoneNumber = donor.phone.replace(/\D/g, '');
        window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
        toast.success(`Opening WhatsApp for ${donor.name}`);
        // Add a 2-second delay between each message
        await delay(2000);
      }

      toast.success(`WhatsApp opened for all ${selectedDonors.length} donors`);
      setSelectedDonors([]); // Clear selection after sending
    } catch (error) {
      console.error('Error sending messages:', error);
      toast.error("Failed to send messages");
    } finally {
      setIsSendingMessages(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading donors...</div>;
  }

  return (
    <div className="w-full max-w-4xl space-y-6">
      <DonorSearch
        searchBloodGroup={searchBloodGroup}
        setSearchBloodGroup={setSearchBloodGroup}
        searchCity={searchCity}
        setSearchCity={setSearchCity}
      />

      {user && selectedDonors.length > 0 && (
        <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow">
          <span>{selectedDonors.length} donors selected</span>
          <Button
            onClick={handleBulkWhatsApp}
            className="flex items-center gap-2"
            disabled={isSendingMessages}
          >
            <MessageSquare className="w-4 h-4" />
            {isSendingMessages ? 'Sending Messages...' : 'Send WhatsApp to Selected'}
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {donors.map((donor) => (
          <DonorCard
            key={donor.id}
            donor={donor}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            isAuthenticated={!!user}
            isSelected={selectedDonors.includes(donor.id)}
            onSelect={handleDonorSelect}
          />
        ))}
      </div>

      {donors.length === 0 && (
        <p className="text-center text-gray-500">No donors found matching your criteria.</p>
      )}
    </div>
  );
};

export default BloodGroupDirectory;
