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
    return (
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full border-2 border-[#FFDEE2] bg-[#FDE1D3] text-primary font-semibold">
          {group}
        </span>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Blood Donor Directory</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card className="sm:col-span-4">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">Total Donors</p>
                <p className="text-2xl font-bold">{donorsCount}</p>
              </div>
            </CardContent>
          </Card>
          {Object.entries(bloodGroupCounts).map(([group, count]) => (
            <Card key={group}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">{formatBloodGroup(group)}</div>
                  <p className="text-2xl font-bold">{count}</p>
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
        />
      </div>
    </div>
  );
};

export default Directory;