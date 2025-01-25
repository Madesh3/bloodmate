import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/components/AuthProvider";
import { Search } from "lucide-react";

interface DonorSearchProps {
  searchBloodGroup: string;
  setSearchBloodGroup: (value: string) => void;
  searchCity: string;
  setSearchCity: (value: string) => void;
  onSelectAll?: (checked: boolean) => void;
  allSelected?: boolean;
  donorsCount: number;
  totalDonorsCount: number;
}

const DonorSearch = ({
  searchCity,
  setSearchCity,
  onSelectAll,
  allSelected,
  donorsCount,
  totalDonorsCount
}: DonorSearchProps) => {
  const { user } = useAuth();

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            placeholder="Search by city, area or pincode..."
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
            className="bg-white pl-10 w-full"
          />
        </div>
      </div>
      {user && donorsCount > 0 && (
        <div className="flex items-center space-x-2 bg-white p-2 rounded-lg">
          <Checkbox
            id="selectAll"
            checked={allSelected}
            onCheckedChange={onSelectAll}
          />
          <label
            htmlFor="selectAll"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Select all {donorsCount} {donorsCount === 1 ? 'donor' : 'donors'} 
            {donorsCount !== totalDonorsCount && ` (filtered from ${totalDonorsCount} total)`}
          </label>
        </div>
      )}
    </div>
  );
};

export default DonorSearch;