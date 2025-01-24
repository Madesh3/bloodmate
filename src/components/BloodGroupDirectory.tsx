import { useState, useEffect } from "react";
import { useAuth } from "./AuthProvider";
import DonorSearch from "./donors/DonorSearch";
import DonorsList from "./donors/DonorsList";
import BulkMessageControl from "./donors/BulkMessageControl";
import { useDonors } from "@/hooks/useDonors";
import { useDonorSelection } from "@/hooks/useDonorSelection";

interface BloodGroupDirectoryProps {
  onDonorsCountChange?: (count: number) => void;
  onBloodGroupCountsChange?: (counts: { [key: string]: number }) => void;
}

const BloodGroupDirectory = ({ 
  onDonorsCountChange,
  onBloodGroupCountsChange 
}: BloodGroupDirectoryProps) => {
  const [searchBloodGroup, setSearchBloodGroup] = useState("_all");
  const [searchCity, setSearchCity] = useState("");
  const { user } = useAuth();

  const { donors, isLoading, handleDelete, setDonors } = useDonors(searchBloodGroup, searchCity);
  const { selectedDonors, setSelectedDonors, handleDonorSelect, handleSelectAll } = useDonorSelection(donors);

  // Update donors count and blood group counts whenever donors array changes
  useEffect(() => {
    onDonorsCountChange?.(donors.length);

    // Calculate blood group counts
    const counts = donors.reduce((acc: { [key: string]: number }, donor) => {
      const group = donor.blood_group;
      acc[group] = (acc[group] || 0) + 1;
      return acc;
    }, {});

    onBloodGroupCountsChange?.(counts);
  }, [donors, onDonorsCountChange, onBloodGroupCountsChange]);

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