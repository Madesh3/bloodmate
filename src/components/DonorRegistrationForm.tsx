import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useDonors } from "@/context/DonorsContext";

const DonorRegistrationForm = () => {
  const { addDonor } = useDonors();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    bloodGroup: "",
    city: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addDonor(formData);
    toast.success("Registration successful! Thank you for being a donor.");
    setFormData({ name: "", phone: "", email: "", bloodGroup: "", city: "" });
  };

  return (
    <Card className="w-full max-w-md p-6 shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Full Name</label>
          <Input
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="John Doe"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Phone Number</label>
          <Input
            required
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+1234567890"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          <Input
            required
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="john@example.com"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Blood Group</label>
          <Select
            required
            value={formData.bloodGroup}
            onValueChange={(value) => setFormData({ ...formData, bloodGroup: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Blood Group" />
            </SelectTrigger>
            <SelectContent>
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((group) => (
                <SelectItem key={group} value={group}>
                  {group}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">City</label>
          <Input
            required
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            placeholder="Your City"
          />
        </div>

        <Button type="submit" className="w-full bg-primary hover:bg-red-600">
          Register as Donor
        </Button>
      </form>
    </Card>
  );
};

export default DonorRegistrationForm;