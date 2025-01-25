import BloodGroupDirectory from "@/components/BloodGroupDirectory";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface BloodGroupCount {
  [key: string]: number;
}

const Directory = () => {
  const [donorsCount, setDonorsCount] = useState<number>(0);
  const [bloodGroupCounts, setBloodGroupCounts] = useState<BloodGroupCount>({});
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [searchBloodGroup, setSearchBloodGroup] = useState("");
  const [searchCity, setSearchCity] = useState("");

  const allBloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  const formatBloodGroup = (group: string) => {
    return (
      <div className="flex items-center gap-3">
        <span className={`inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full border-2 
          ${selectedGroup === group 
            ? "border-primary bg-[#FFF1F2] text-primary shadow-lg scale-110 transition-all" 
            : "border-[#FFDEE2] bg-[#FFF5F5] text-primary/70 hover:scale-105 transition-all"} 
          font-semibold text-base md:text-lg`}
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
      <div className="container mx-auto px-4 py-6 md:py-12 space-y-6 md:space-y-8 max-w-7xl">
        {/* Total Donors Count Badge */}

        {/* Total Donors Count Badge */}
        <div className="flex justify-center">
          <div className="bg-white shadow-lg rounded-xl px-6 py-3 border-2 border-primary/20">
            <p className="text-center flex flex-col items-center">
              <span className="text-2xl md:text-3xl font-bold text-primary">{donorsCount}</span>
              <span className="text-gray-600 text-sm md:text-base">
                <span className="block font-medium">Heros</span>
                Total <span className="line-through">Donors</span> Available
              </span>
            </p>
          </div>
        </div>

        {/* Hero Section with Search and Blood Groups */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-red-100 to-red-50 rounded-3xl blur-3xl opacity-50"></div>
          <div className="relative space-y-4 md:space-y-6 py-4 md:py-6">
            <div className="text-center">
              <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-2">Blood Donor Directory</h1>
              <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4">
                Find and connect with blood donors in your area. Use the search below to find donors near you.
              </p>
            </div>

            {/* Search Bar Section */}
            <div className="relative max-w-2xl mx-auto px-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-lg blur-xl"></div>
                <div className="relative bg-white shadow-xl rounded-lg">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary h-5 w-5" />
                  <Input
                    placeholder="Search donors near you (e.g. Andheri, Mumbai, 400053)..."
                    value={searchCity}
                    onChange={(e) => setSearchCity(e.target.value)}
                    className="pl-12 pr-4 py-6 text-base md:text-lg border-2 border-primary/20 focus:border-primary transition-colors rounded-lg"
                  />
                </div>
                {searchCity && (
                  <p className="text-sm text-gray-600 mt-2 ml-2">
                    Showing results near "{searchCity}"
                  </p>
                )}
              </div>
            </div>

            {/* Blood Groups Grid - Now 3 columns on mobile */}
            <div className="mt-6 px-2">
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-2 md:gap-4">
                {allBloodGroups.map((group) => (
                  <Card 
                    key={group} 
                    className={`hover:shadow-xl transition-all cursor-pointer transform hover:-translate-y-1
                      ${selectedGroup === group 
                        ? "ring-2 ring-primary shadow-lg border-primary bg-white" 
                        : "border-[#FFDEE2] hover:border-primary/50 bg-white/80"}`}
                    onClick={() => handleGroupSelect(group)}
                  >
                    <CardContent className="p-2 md:p-4">
                      <div className="flex flex-col items-center justify-center space-y-1">
                        <div className="text-sm font-medium text-gray-800">{formatBloodGroup(group)}</div>
                        <div className="flex flex-col items-center -space-y-1">
                          <p className={`text-lg md:text-2xl font-bold ${selectedGroup === group ? "text-primary" : "text-primary/70"}`}>
                            {bloodGroupCounts[group] || 0}
                          </p>
                          <p className="text-xs text-gray-500">donors</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Donors List Section */}
      <div className="flex justify-center pb-24 md:pb-12 px-4">
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
