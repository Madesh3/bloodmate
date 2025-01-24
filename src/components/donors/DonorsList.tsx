import DonorCard from "./DonorCard";

interface DonorsListProps {
  donors: any[];
  onUpdate: (donor: any) => void;
  onDelete: (id: string) => void;
  isAuthenticated: boolean;
  selectedDonors: string[];
  onSelect: (id: string) => void;
}

const DonorsList = ({ 
  donors, 
  onUpdate, 
  onDelete, 
  isAuthenticated,
  selectedDonors,
  onSelect
}: DonorsListProps) => {
  if (donors.length === 0) {
    return <p className="text-center text-gray-500">No donors found matching your criteria.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {donors.map((donor) => (
        <DonorCard
          key={donor.id}
          donor={donor}
          onUpdate={onUpdate}
          onDelete={onDelete}
          isAuthenticated={isAuthenticated}
          isSelected={selectedDonors.includes(donor.id)}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
};

export default DonorsList;