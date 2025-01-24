import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface DonorSearchProps {
  searchBloodGroup: string;
  setSearchBloodGroup: (value: string) => void;
  searchCity: string;
  setSearchCity: (value: string) => void;
}

const DonorSearch = ({
  searchBloodGroup,
  setSearchBloodGroup,
  searchCity,
  setSearchCity
}: DonorSearchProps) => {
  return (
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
  );
};

export default DonorSearch;