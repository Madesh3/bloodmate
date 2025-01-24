import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
      setAllDonors(allData || []);

      // Apply filters for displayed donors
      let filteredDonors = allData || [];
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
    allDonors // Add allDonors to the return object
  };
};
