import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "./AuthProvider";

const BloodGroupDirectory = () => {
  const [donors, setDonors] = useState([]);
  const [searchBloodGroup, setSearchBloodGroup] = useState("");
  const [searchCity, setSearchCity] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        let query = supabase.from('donors').select('*');

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

    fetchDonors();
  }, [searchBloodGroup, searchCity]);

  if (isLoading) {
    return <div className="text-center py-8">Loading donors...</div>;
  }

  return (
    <div className="w-full max-w-4xl space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
        <div className="relative">
          <Select value={searchBloodGroup} onValueChange={setSearchBloodGroup}>
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder="Select Blood Group" />
            </SelectTrigger>
            <SelectContent className="bg-white z-50 shadow-lg">
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
          <Card key={donor.id} className="p-4 hover:shadow-md transition-shadow bg-white">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{donor.name}</h3>
                <p className="text-sm text-gray-600">{donor.city}</p>
              </div>
              <span className="text-primary font-bold">{donor.blood_group}</span>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              {user ? (
                <>
                  <p>Contact: {donor.phone}</p>
                  <p>Email: {donor.email}</p>
                </>
              ) : (
                <p className="text-primary">Sign in to view contact details</p>
              )}
            </div>
          </Card>
        ))}
      </div>

      {donors.length === 0 && (
        <p className="text-center text-gray-500">No donors found matching your criteria.</p>
      )}
    </div>
  );
};

export default BloodGroupDirectory;