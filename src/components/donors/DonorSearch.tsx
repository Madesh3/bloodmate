import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/components/AuthProvider";

interface DonorSearchProps {
  searchBloodGroup: string;
  setSearchBloodGroup: (value: string) => void;
  searchCity: string;
  setSearchCity: (value: string) => void;
  onSelectAll?: (checked: boolean) => void;
  allSelected?: boolean;
  donorsCount: number;
}

const DonorSearch = ({
  searchBloodGroup,
  setSearchBloodGroup,
  searchCity,
  setSearchCity,
  onSelectAll,
  allSelected,
  donorsCount
}: DonorSearchProps) => {
  const { user } = useAuth();

  return (
    <div className="space-y-4">
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
              <SelectItem value="_all">All Blood Groups</SelectItem>
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
            Select all {donorsCount} donors
          </label>
        </div>
      )}
    </div>
  );
};

export default DonorSearch;