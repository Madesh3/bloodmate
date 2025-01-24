import DonorRegistrationForm from "@/components/DonorRegistrationForm";

const BecomeDonor = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Become a Blood Donor</h1>
        <p className="text-gray-600 text-center mb-8">
          Join our community of blood donors and help save lives. Fill out the form below to register as a donor.
        </p>
        <DonorRegistrationForm />
      </div>
    </div>
  );
};

export default BecomeDonor;