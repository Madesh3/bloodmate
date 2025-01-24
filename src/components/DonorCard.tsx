import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil, Trash2, MessageSquare, Mail } from "lucide-react";

interface DonorCardProps {
  donor: {
    id: string;
    name: string;
    city: string;
    phone: string;
    email: string;
    blood_group: string;
  };
  editingDonor: any;
  setEditingDonor: (donor: any) => void;
  handleUpdate: (e: React.FormEvent, id: string) => void;
  handleDelete: (id: string) => void;
  user: any;
}

const DonorCard = ({
  donor,
  editingDonor,
  setEditingDonor,
  handleUpdate,
  handleDelete,
  user
}: DonorCardProps) => {
  const getWhatsAppLink = (phone: string) => {
    const message = encodeURIComponent("We need Blood, can you help?");
    const cleanPhone = phone.replace(/\D/g, '');
    return `https://wa.me/${cleanPhone}?text=${message}`;
  };

  return (
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
                <div className="mt-4 flex gap-2 items-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingDonor(donor)}
                  >
                    <Pencil className="w-4 h-4 mr-1" /> Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(donor.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-1" /> Delete
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.location.href = `mailto:${donor.email}`}
                  >
                    <Mail className="w-4 h-4 mr-1" /> Email
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(getWhatsAppLink(donor.phone), '_blank')}
                    className="bg-green-500 text-white hover:bg-green-600"
                  >
                    <MessageSquare className="w-4 h-4 mr-1" /> WhatsApp
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
  );
};

export default DonorCard;