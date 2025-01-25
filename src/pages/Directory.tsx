import BloodGroupDirectory from "@/components/BloodGroupDirectory";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { Input } from "@/components/ui/input";

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
        <span className={`inline-flex items-center justify-center w-12 h-12 rounded-full border-2 
          ${selectedGroup === group 
            ? "border-primary bg-[#FFF1F2] text-primary shadow-lg scale-110 transition-all" 
            : "border-[#FFDEE2] bg-[#FFF5F5] text-primary/70 hover:scale-105 transition-all"} 
          font-semibold text-lg`}
        >
          {group}
        </span>
      </div>
    );
  };

  const handleGroupSelect = (group: string) => {
    if (selectedGroup === group) {
      setSelectedGroup("");
      setSearchBloodGroup("_all");
    } else {
      setSelectedGroup(group);
      setSearchBloodGroup(group);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-red-50">
      <div className="container mx-auto px-4 py-12 space-y-12 max-w-7xl">
        {/* Hero Section with Search */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-red-100 to-red-50 rounded-3xl blur-3xl opacity-50"></div>
          <div className="relative space-y-8 py-8">
            <div className="text-center space-y-4">
              <h1 className="text-5xl font-bold text-gray-900 mb-2">Blood Donor Directory</h1>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Find and connect with blood donors in your area. Use the search below to find donors near you.
              </p>
            </div>

            {/* Search Bar Section */}
            <div className="max-w-2xl mx-auto">
              <div className="flex flex-col space-y-4">
                <Input
                  type="text"
                  placeholder="Search by city..."
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  className="w-full px-4 py-2 text-lg"
                />
                <div className="text-sm text-gray-500 text-center">
                  {donorsCount} donors available
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Blood Group Stats Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800 text-center">Blood Groups Available</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {allBloodGroups.map((group) => (
              <Card 
                key={group} 
                className={`hover:shadow-xl transition-all cursor-pointer transform hover:-translate-y-1
                  ${selectedGroup === group 
                    ? "ring-2 ring-primary shadow-lg border-primary bg-white" 
                    : "border-[#FFDEE2] hover:border-primary/50 bg-white/80"}`}
                onClick={() => handleGroupSelect(group)}
              >
                <CardContent className="p-4">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="text-sm font-medium text-gray-800">{formatBloodGroup(group)}</div>
                    <p className={`text-2xl font-bold ${selectedGroup === group ? "text-primary" : "text-primary/70"}`}>
                      {bloodGroupCounts[group] || 0}
                    </p>
                    <p className="text-xs text-gray-500">donors</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
      
      <div className="flex justify-center pb-12">
        <BloodGroupDirectory 
          onDonorsCountChange={setDonorsCount}
          onBloodGroupCountsChange={setBloodGroupCounts}
          searchBloodGroup={searchBloodGroup}
          setSearchBloodGroup={setSearchBloodGroup}
          searchCity={searchCity}
          setSearchCity={setSearchCity}
        />
      </div>
    </div>
  );
};

export default Directory;