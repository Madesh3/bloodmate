import BloodGroupDirectory from "@/components/BloodGroupDirectory";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Directory = () => {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
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
  );
};

export default Directory;