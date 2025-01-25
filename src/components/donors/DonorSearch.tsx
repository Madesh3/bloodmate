import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/components/AuthProvider";
import { Search } from "lucide-react";

interface DonorSearchProps {
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
      <div className="relative max-w-2xl mx-auto">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-lg blur-xl"></div>
          <div className="relative bg-white shadow-xl rounded-lg">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary h-5 w-5" />
            <Input
              placeholder="Search donors near you"
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              className="pl-12 pr-4 py-6 text-lg border-2 border-primary/20 focus:border-primary transition-colors rounded-lg"
            />
          </div>
          {searchCity && (
            <p className="text-sm text-gray-600 mt-2 ml-2">
              Showing results near "{searchCity}"
            </p>
          )}
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