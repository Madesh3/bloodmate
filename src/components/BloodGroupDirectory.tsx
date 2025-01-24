import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "./AuthProvider";

const BloodGroupDirectory = () => {
  const [donors, setDonors] = useState([]);
  const [searchBloodGroup, setSearchBloodGroup] = useState("");
  const [searchCity, setSearchCity] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [editingDonor, setEditingDonor] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchDonors();
  }, [searchBloodGroup, searchCity]);

  const fetchDonors = async () => {
    try {
      let query = supabase.from('donors')
        .select('*')
        .order('created_at', { ascending: true });

      if (searchBloodGroup && searchBloodGroup !== "all") {
        query = query.eq('blood_group', searchBloodGroup);
      }
      
      if (searchCity) {
        query = query.ilike('city', `%${searchCity}%`);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      setDonors(data || []);
    } catch (error) {
      console.error('Error fetching donors:', error);
      toast.error("Failed to load donors. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!user) {
      toast.error("Please sign in to delete donors");
      return;
    }

    try {
      const { error } = await supabase
        .from('donors')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success("Donor deleted successfully");
      fetchDonors();
    } catch (error) {
      console.error('Error deleting donor:', error);
      toast.error("Failed to delete donor");
    }
  };

  const handleUpdate = async (e, id) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please sign in to update donors");
      return;
    }

    try {
      const { error } = await supabase
        .from('donors')
        .update({
          name: editingDonor.name,
          city: editingDonor.city,
          phone: editingDonor.phone,
          email: editingDonor.email,
          blood_group: editingDonor.blood_group
        })
        .eq('id', id);

      if (error) throw error;

      setDonors(prevDonors => 
        prevDonors.map(donor => 
          donor.id === id ? { ...donor, ...editingDonor } : donor
        )
      );

      toast.success("Donor updated successfully");
      setEditingDonor(null);
    } catch (error) {
      console.error('Error updating donor:', error);
      toast.error("Failed to update donor");
    }
  };

  const getWhatsAppLink = (phone: string) => {
    const message = encodeURIComponent("We need Blood, can you help?");
    const cleanPhone = phone.replace(/\D/g, '');
    return `https://wa.me/${cleanPhone}?text=${message}`;
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading donors...</div>;
  }

  return (
    <div className="w-full max-w-4xl space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <Select value={searchBloodGroup} onValueChange={setSearchBloodGroup}>
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder="Select Blood Group" />
            </SelectTrigger>
            <SelectContent 
              className="bg-white z-[100] relative" 
              position="popper" 
              sideOffset={4}
            >
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
          className="bg-white"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {donors.map((donor) => (
          <Card key={donor.id} className="p-4 hover:shadow-md transition-shadow bg-white relative">
            {editingDonor?.id === donor.id ? (
              <form onSubmit={(e) => handleUpdate(e, donor.id)} className="space-y-4">
                <Input
                  value={editingDonor.name}
                  onChange={(e) => setEditingDonor({ ...editingDonor, name: e.target.value })}
                  placeholder="Name"
                  className="mb-2"
                />
                <Input
                  value={editingDonor.city}
                  onChange={(e) => setEditingDonor({ ...editingDonor, city: e.target.value })}
                  placeholder="City"
                  className="mb-2"
                />
                <Input
                  value={editingDonor.phone}
                  onChange={(e) => setEditingDonor({ ...editingDonor, phone: e.target.value })}
                  placeholder="Phone"
                  className="mb-2"
                />
                <Input
                  value={editingDonor.email}
                  onChange={(e) => setEditingDonor({ ...editingDonor, email: e.target.value })}
                  placeholder="Email"
                  type="email"
                  className="mb-2"
                />
                <Select
                  value={editingDonor.blood_group}
                  onValueChange={(value) => setEditingDonor({ ...editingDonor, blood_group: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Blood Group" />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-[100] relative">
                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((group) => (
                      <SelectItem key={group} value={group}>
                        {group}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex gap-2 mt-4">
                  <Button type="submit">Save</Button>
                  <Button variant="outline" onClick={() => setEditingDonor(null)}>Cancel</Button>
                </div>
              </form>
            ) : (
              <>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{donor.name}</h3>
                    <p className="text-sm text-gray-600">{donor.city}</p>
                  </div>
                  <span className="text-primary font-bold">{donor.blood_group}</span>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  {user ? (
                    <>
                      <p>Contact: {donor.phone}</p>
                      <p>Email: {donor.email}</p>
                      <div className="mt-4 flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingDonor(donor)}
                          className="flex items-center gap-1"
                        >
                          <Pencil className="w-4 h-4" /> Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(donor.id)}
                          className="flex items-center gap-1"
                        >
                          <Trash2 className="w-4 h-4" /> Delete
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.location.href = `mailto:${donor.email}`}
                          className="flex items-center gap-1"
                        >
                          <MessageSquare className="w-4 h-4" /> Message
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="flex items-center gap-1 bg-green-500 text-white hover:bg-green-600"
                        >
                          <a
                            href={getWhatsAppLink(donor.phone)}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <MessageSquare className="w-4 h-4" /> Contact Now
                          </a>
                        </Button>
                      </div>
                    </>
                  ) : (
                    <p className="text-primary">Sign in to view contact details</p>
                  )}
                </div>
              </>
            )}
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