import BloodGroupDirectory from "@/components/BloodGroupDirectory";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Directory = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container py-8 space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Blood Donor Directory</h1>
          <Button asChild variant="outline">
            <Link to="/">Back to Home</Link>
          </Button>
        </div>
        
        <div className="flex justify-center">
          <BloodGroupDirectory />
        </div>
      </div>
    </div>
  );
};

export default Directory;