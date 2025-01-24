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
  const [searchBloodGroup, setSearchBloodGroup] = useState("");
  const [searchCity, setSearchCity] = useState("");
  const [totalDonorsCount, setTotalDonorsCount] = useState(0);
  const { user } = useAuth();

  const { donors, isLoading, handleDelete, setDonors, fetchTotalDonorsCount, allDonors } = useDonors(searchBloodGroup, searchCity);
  const { selectedDonors, setSelectedDonors, handleDonorSelect, handleSelectAll } = useDonorSelection(donors);

  // Fetch total donors count on component mount
  useEffect(() => {
    const getTotalCount = async () => {
      const count = await fetchTotalDonorsCount();
      setTotalDonorsCount(count);
      onDonorsCountChange?.(count);
    };
    getTotalCount();
  }, [fetchTotalDonorsCount, onDonorsCountChange]);

  // Update blood group counts using allDonors instead of filtered donors
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
        totalDonorsCount={totalDonorsCount}
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