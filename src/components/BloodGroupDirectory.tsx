import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "./AuthProvider";
import DonorSearch from "./donors/DonorSearch";
import DonorsList from "./donors/DonorsList";
import BulkMessageControl from "./donors/BulkMessageControl";

const BloodGroupDirectory = () => {
  const [donors, setDonors] = useState([]);
  const [selectedDonors, setSelectedDonors] = useState([]);
  const [searchBloodGroup, setSearchBloodGroup] = useState("_all");
  const [searchCity, setSearchCity] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchDonors();
  }, [searchBloodGroup, searchCity]);

  // Reset selected donors when filters change
  useEffect(() => {
    setSelectedDonors([]);
  }, [searchBloodGroup, searchCity]);

  const fetchDonors = async () => {
    try {
      let query = supabase.from('donors')
        .select('*')
        .order('created_at', { ascending: false });

      if (searchBloodGroup && searchBloodGroup !== "_all") {
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

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allDonorIds = donors.map(donor => donor.id);
      setSelectedDonors(allDonorIds);
    } else {
      setSelectedDonors([]);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading donors...</div>;
  }

  const areAllSelected = donors.length > 0 && selectedDonors.length === donors.length;

  return (
    <div className="w-full max-w-4xl space-y-6">
      <DonorSearch
        searchBloodGroup={searchBloodGroup}
        setSearchBloodGroup={setSearchBloodGroup}
        searchCity={searchCity}
        setSearchCity={setSearchCity}
        onSelectAll={handleSelectAll}
        allSelected={areAllSelected}
        donorsCount={donors.length}
      />

      {user && selectedDonors.length > 0 && (
        <BulkMessageControl
          selectedDonors={selectedDonors}
          donors={donors}
          onComplete={() => setSelectedDonors([])}
        />
      )}

      <DonorsList
        donors={donors}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        isAuthenticated={!!user}
        selectedDonors={selectedDonors}
        onSelect={handleDonorSelect}
      />
    </div>
  );
};

export default BloodGroupDirectory;