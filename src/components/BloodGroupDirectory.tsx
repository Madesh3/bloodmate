import { useState, useEffect } from "react";
import { useAuth } from "./AuthProvider";
import DonorsList from "./donors/DonorsList";
import BulkMessageControl from "./donors/BulkMessageControl";
import { useDonors } from "@/hooks/useDonors";
import { useDonorSelection } from "@/hooks/useDonorSelection";

interface BloodGroupDirectoryProps {
  onDonorsCountChange?: (count: number) => void;
  onBloodGroupCountsChange?: (counts: { [key: string]: number }) => void;
  searchBloodGroup?: string;
  setSearchBloodGroup?: (value: string) => void;
  searchCity?: string;
  setSearchCity?: (value: string) => void;
}

const BloodGroupDirectory = ({ 
  onDonorsCountChange,
  onBloodGroupCountsChange,
  searchBloodGroup: externalSearchBloodGroup,
  setSearchBloodGroup: externalSetSearchBloodGroup,
  searchCity: externalSearchCity,
  setSearchCity: externalSetSearchCity
}: BloodGroupDirectoryProps) => {
  const [internalSearchBloodGroup, setInternalSearchBloodGroup] = useState("");
  const [internalSearchCity, setInternalSearchCity] = useState("");
  const { user } = useAuth();

  // Use external or internal state based on props
  const searchBloodGroup = externalSearchBloodGroup ?? internalSearchBloodGroup;
  const setSearchBloodGroup = externalSetSearchBloodGroup ?? setInternalSearchBloodGroup;
  const searchCity = externalSearchCity ?? internalSearchCity;
  const setSearchCity = externalSetSearchCity ?? setInternalSearchCity;

  const { donors, isLoading, handleDelete, setDonors, fetchTotalDonorsCount, allDonors } = useDonors(searchBloodGroup, searchCity);
  const { selectedDonors, setSelectedDonors, handleDonorSelect, handleSelectAll } = useDonorSelection(donors);

  useEffect(() => {
    const getTotalCount = async () => {
      const count = await fetchTotalDonorsCount();
      if (onDonorsCountChange) {
        onDonorsCountChange(count);
      }
    };
    getTotalCount();
  }, [fetchTotalDonorsCount, onDonorsCountChange]);

  useEffect(() => {
    const counts = allDonors.reduce((acc: { [key: string]: number }, donor) => {
      const group = donor.blood_group;
      acc[group] = (acc[group] || 0) + 1;
      return acc;
    }, {});

    onBloodGroupCountsChange?.(counts);
  }, [allDonors, onBloodGroupCountsChange]);

  const handleUpdate = (updatedDonor: any) => {
    setDonors(prevDonors => 
      prevDonors.map(donor => 
        donor.id === updatedDonor.id ? { ...donor, ...updatedDonor } : donor
      )
    );
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading donors...</div>;
  }

  return (
    <div className="w-full max-w-4xl space-y-6">
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