import BloodGroupDirectory from "@/components/BloodGroupDirectory";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState } from "react";

const Directory = () => {
  const [donorsCount, setDonorsCount] = useState<number>(0);

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Blood Donor Directory</h1>
          <p className="text-gray-600">Total donors: {donorsCount}</p>
        </div>
        <Button asChild variant="outline">
          <Link to="/">Back to Home</Link>
        </Button>
      </div>
      
      <div className="flex justify-center">
        <BloodGroupDirectory onDonorsCountChange={setDonorsCount} />
      </div>
    </div>
  );
};

export default Directory;