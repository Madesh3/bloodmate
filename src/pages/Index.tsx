import { Button } from "@/components/ui/button";
import DonorRegistrationForm from "@/components/DonorRegistrationForm";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container py-8 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">Blood Donation Network</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join our community of blood donors and help save lives. Register now or search for donors in your area.
          </p>
          <Button asChild className="bg-primary hover:bg-red-600">
            <Link to="/directory">Search for Donors</Link>
          </Button>
        </div>

        <div className="flex justify-center mt-8">
          <DonorRegistrationForm />
        </div>
      </div>
    </div>
  );
};

export default Index;