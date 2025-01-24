import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "./AuthProvider";
import DonorCard from "./DonorCard";

const BloodGroupDirectory = () => {
  const [donors, setDonors] = useState([]);
  const [searchBloodGroup, setSearchBloodGroup] = useState("");
  const [searchCity, setSearchCity] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [editingDonor, setEditingDonor] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchDonors();
  }, [searchBloodGroup, searchCity]);

  const fetchDonors = async () => {
    try {
      let query = supabase.from('donors')
        .select('*')
        .order('created_at', { ascending: true });

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

  const handleUpdate = async (e, id) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please sign in to update donors");
      return;
    }

    try {
      const { error } = await supabase
        .from('donors')
        .update({
          name: editingDonor.name,
          city: editingDonor.city,
          phone: editingDonor.phone,
          email: editingDonor.email,
          blood_group: editingDonor.blood_group
        })
        .eq('id', id);

      if (error) throw error;

      setDonors(prevDonors => 
        prevDonors.map(donor => 
          donor.id === id ? { ...donor, ...editingDonor } : donor
        )
      );

      toast.success("Donor updated successfully");
      setEditingDonor(null);
    } catch (error) {
      console.error('Error updating donor:', error);
      toast.error("Failed to update donor");
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading donors...</div>;
  }

  return (
    <div className="w-full max-w-4xl space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <Select value={searchBloodGroup} onValueChange={setSearchBloodGroup}>
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder="Select Blood Group" />
            </SelectTrigger>
            <SelectContent 
              className="bg-white z-[100] relative" 
              position="popper" 
              sideOffset={4}
            >
              <SelectItem value="all">All Blood Groups</SelectItem>
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((group) => (
                <SelectItem key={group} value={group}>
                  {group}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Input
          placeholder="Search by city..."
          value={searchCity}
          onChange={(e) => setSearchCity(e.target.value)}
          className="bg-white"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {donors.map((donor) => (
          <DonorCard
            key={donor.id}
            donor={donor}
            editingDonor={editingDonor}
            setEditingDonor={setEditingDonor}
            handleUpdate={handleUpdate}
            handleDelete={handleDelete}
            user={user}
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