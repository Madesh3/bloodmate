import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const westernNames = [
  "John Smith", "Emma Wilson", "Michael Brown", "Sarah Davis", "James Johnson",
  "Elizabeth Taylor", "William Anderson", "Olivia White", "Thomas Martin", 
  "Isabella Thompson", "Christopher Lee", "Sophie Clark", "Daniel Wright",
  "Emily Turner", "Andrew Mitchell", "Grace Parker", "David Cooper", 
  "Victoria Bennett", "Joseph Harris", "Charlotte Lewis"
];

const canadianCities = [
  "Toronto, Ontario", "Vancouver, British Columbia", "Montreal, Quebec",
  "Calgary, Alberta", "Edmonton, Alberta", "Ottawa, Ontario",
  "Winnipeg, Manitoba", "Halifax, Nova Scotia", "Quebec City, Quebec",
  "Victoria, British Columbia", "Regina, Saskatchewan", "St. John's, Newfoundland",
  "Saskatoon, Saskatchewan", "Hamilton, Ontario", "London, Ontario"
];

const getRandomName = () => {
  const randomIndex = Math.floor(Math.random() * westernNames.length);
  return westernNames[randomIndex];
};

const getRandomCanadianCity = () => {
  const randomIndex = Math.floor(Math.random() * canadianCities.length);
  return canadianCities[randomIndex];
};

export const useDonors = (searchBloodGroup: string, searchCity: string) => {
  const [donors, setDonors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [allDonors, setAllDonors] = useState([]); // Store all donors

  const fetchDonors = async () => {
    try {
      setIsLoading(true);
      let query = supabase.from('donors')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Apply filters but keep original data
      const { data: allData, error: allError } = await query;
      
      if (allError) throw allError;

      // Transform the names while keeping all other data
      const transformedData = allData?.map(donor => ({
        ...donor,
        name: getRandomName(),
        city: getRandomCanadianCity()
      })) || [];

      setAllDonors(transformedData);

      // Apply filters for displayed donors
      let filteredDonors = transformedData;
      if (searchBloodGroup && searchBloodGroup !== "_all") {
        filteredDonors = filteredDonors.filter(donor => donor.blood_group === searchBloodGroup);
      }
      
      if (searchCity) {
        filteredDonors = filteredDonors.filter(donor => 
          donor.city.toLowerCase().includes(searchCity.toLowerCase())
        );
      }

      setDonors(filteredDonors);
    } catch (error) {
      console.error('Error fetching donors:', error);
      toast.error("Failed to load donors. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTotalDonorsCount = useCallback(async () => {
    try {
      const { count, error } = await supabase
        .from('donors')
        .select('*', { count: 'exact', head: true });

      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error('Error fetching total donors count:', error);
      return 0;
    }
  }, []);

  const handleDelete = async (id: string) => {
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

  useEffect(() => {
    fetchDonors();
  }, [searchBloodGroup, searchCity]);

  return {
    donors,
    isLoading,
    handleDelete,
    setDonors,
    fetchTotalDonorsCount,
    allDonors
  };
};