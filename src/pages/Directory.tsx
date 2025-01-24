import BloodGroupDirectory from "@/components/BloodGroupDirectory";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

interface BloodGroupCount {
  [key: string]: number;
}

const Directory = () => {
  const [donorsCount, setDonorsCount] = useState<number>(0);
  const [bloodGroupCounts, setBloodGroupCounts] = useState<BloodGroupCount>({});

  const formatBloodGroup = (group: string) => {
    if (group === "_all") return "All Groups";
    
    // Split the blood group into letter and symbol (if any)
    const letter = group.charAt(0);
    const symbol = group.slice(1);
    
    return (
      <span className="inline-flex items-baseline">
        <span className="text-primary text-lg font-semibold">{letter}</span>
        <span className="text-gray-700 text-sm font-medium">{symbol}</span>
      </span>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Blood Donor Directory</h1>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600">Total Donors</p>
              <p className="text-2xl font-bold">{donorsCount}</p>
            </CardContent>
          </Card>
          {Object.entries(bloodGroupCounts).map(([group, count]) => (
            <Card key={group}>
              <CardContent className="p-4">
                <p className="text-sm text-gray-600">{formatBloodGroup(group)}</p>
                <p className="text-2xl font-bold">{count}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      <div className="flex justify-center">
        <BloodGroupDirectory 
          onDonorsCountChange={setDonorsCount}
          onBloodGroupCountsChange={setBloodGroupCounts}
        />
      </div>
    </div>
  );
};

export default Directory;