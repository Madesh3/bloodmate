import { Button } from "@/components/ui/button";
import DonorRegistrationForm from "@/components/DonorRegistrationForm";
import { Link } from "react-router-dom";
import { Heart, Users, Hospital } from "lucide-react";

const Index = () => {
  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="container mx-auto px-4">
        <div className="text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
            Save Lives Through
            <span className="text-primary"> Blood Donation</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join our community of blood donors and help save lives. Register now or search for donors in your area.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-primary hover:bg-red-600">
              <Link to="/directory">Find Donors</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="#register">Become a Donor</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Donate Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Blood Donation Matters</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Save Lives</h3>
              <p className="text-gray-600">Your donation can save up to three lives and help countless others.</p>
            </div>
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Community Support</h3>
              <p className="text-gray-600">Join a community of donors making a difference in people's lives.</p>
            </div>
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <Hospital className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Emergency Ready</h3>
              <p className="text-gray-600">Help maintain a stable blood supply for medical emergencies.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Form Section */}
      <section id="register" className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Register as a Donor</h2>
          <DonorRegistrationForm />
        </div>
      </section>
    </div>
  );
};

export default Index;