import BloodGroupDirectory from "@/components/BloodGroupDirectory";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import DonorSearch from "@/components/donors/DonorSearch";

interface BloodGroupCount {
  [key: string]: number;
}

const Directory = () => {
  const [donorsCount, setDonorsCount] = useState<number>(0);
  const [bloodGroupCounts, setBloodGroupCounts] = useState<BloodGroupCount>({});
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [searchBloodGroup, setSearchBloodGroup] = useState("");
  const [searchCity, setSearchCity] = useState("");

  // All blood groups that we want to display
  const allBloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  const formatBloodGroup = (group: string) => {
    return (
      <div className="flex items-center gap-3">
        <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full border-2 
          ${selectedGroup === group 
            ? "border-primary bg-[#FFF1F2] text-primary shadow-lg" 
            : "border-[#FFDEE2] bg-[#FFF5F5] text-primary/70"} 
          font-semibold transition-all`}
        >
          {group}
        </span>
      </div>
    );
  };

  const handleGroupSelect = (group: string) => {
    if (selectedGroup === group) {
      setSelectedGroup("");
      setSearchBloodGroup("_all"); // Reset filter
    } else {
      setSelectedGroup(group);
      setSearchBloodGroup(group); // Apply filter
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 max-w-7xl">
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Blood Donor Directory</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find and connect with blood donors in your area. Use the search below to find donors near you.
          </p>
        </div>

        {/* Search Bar Section */}
        <div className="max-w-2xl mx-auto">
          <DonorSearch
            searchCity={searchCity}
            setSearchCity={setSearchCity}
            donorsCount={donorsCount}
            totalDonorsCount={donorsCount}
          />
        </div>
        
        {/* Blood Group Cards */}
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
          <Card className="col-span-3 sm:col-span-4 border-2 border-[#FFDEE2] bg-[#FDE1D3] hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-800">Total Donors</p>
                <p className="text-3xl font-bold text-primary">{donorsCount}</p>
              </div>
            </CardContent>
          </Card>
          {allBloodGroups.map((group) => (
            <Card 
              key={group} 
              className={`hover:shadow-lg transition-all cursor-pointer
                ${selectedGroup === group 
                  ? "ring-2 ring-primary shadow-lg border-primary" 
                  : "border-[#FFDEE2] hover:border-primary/50"}`}
              onClick={() => handleGroupSelect(group)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-gray-800">{formatBloodGroup(group)}</div>
                  <p className={`text-2xl font-bold ${selectedGroup === group ? "text-primary" : "text-primary/70"}`}>
                    {bloodGroupCounts[group] || 0}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      <div className="flex justify-center">
        <BloodGroupDirectory 
          onDonorsCountChange={setDonorsCount}
          onBloodGroupCountsChange={setBloodGroupCounts}
          searchBloodGroup={searchBloodGroup}
          setSearchBloodGroup={setSearchBloodGroup}
        />
      </div>
    </div>
  );
};

export default Directory;