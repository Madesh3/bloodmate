import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getDonorsByBloodGroup, getDonorsByCity, getAllDonors } from "@/utils/db";

const BloodGroupDirectory = () => {
  const [donors, setDonors] = useState([]);
  const [searchBloodGroup, setSearchBloodGroup] = useState("");
  const [searchCity, setSearchCity] = useState("");

  useEffect(() => {
    if (searchBloodGroup && searchBloodGroup !== "all") {
      const filteredDonors = getDonorsByBloodGroup(searchBloodGroup);
      setDonors(filteredDonors);
    } else if (searchCity) {
      const filteredDonors = getDonorsByCity(searchCity);
      setDonors(filteredDonors);
    } else {
      const allDonors = getAllDonors();
      setDonors(allDonors);
    }
  }, [searchBloodGroup, searchCity]);

  return (
    <div className="w-full max-w-4xl space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Select value={searchBloodGroup} onValueChange={setSearchBloodGroup}>
            <SelectTrigger>
              <SelectValue placeholder="Select Blood Group" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Blood Groups</SelectItem>
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((group) => (
                <SelectItem key={group} value={group}>
                  {group}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Input
          placeholder="Search by city..."
          value={searchCity}
          onChange={(e) => setSearchCity(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {donors.map((donor) => (
          <Card key={donor.id} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{donor.name}</h3>
                <p className="text-sm text-gray-600">{donor.city}</p>
              </div>
              <span className="text-primary font-bold">{donor.bloodGroup}</span>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              <p>Contact: {donor.phone}</p>
              <p>Email: {donor.email}</p>
            </div>
          </Card>
        ))}
      </div>

      {donors.length === 0 && (
        <p className="text-center text-gray-500">No donors found matching your criteria.</p>
      )}
    </div>
  );
};

export default BloodGroupDirectory;