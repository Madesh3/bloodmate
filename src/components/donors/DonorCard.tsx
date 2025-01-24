import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, MessageSquare, Phone, Trophy, Medal, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

const getDonorBadge = (donationCount: number) => {
  if (donationCount >= 10) {
    return { icon: Trophy, label: "Platinum Donor", color: "bg-purple-100 text-purple-800" };
  } else if (donationCount >= 5) {
    return { icon: Medal, label: "Gold Donor", color: "bg-yellow-100 text-yellow-800" };
  } else if (donationCount >= 3) {
    return { icon: Star, label: "Silver Donor", color: "bg-gray-100 text-gray-800" };
  }
  return null;
};

interface DonorCardProps {
  donor: any;
  onUpdate: (updatedDonor: any) => void;
  onDelete: (id: string) => void;
  isAuthenticated: boolean;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
}

const DonorCard = ({ 
  donor, 
  onUpdate, 
  onDelete, 
  isAuthenticated,
  isSelected = false,
  onSelect
}: DonorCardProps) => {
  const [editingDonor, setEditingDonor] = useState<any>(null);
  const donorBadge = getDonorBadge(donor.donation_count || 0);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('donors')
        .update({
          name: editingDonor.name,
          city: editingDonor.city,
          phone: editingDonor.phone,
          email: editingDonor.email,
          blood_group: editingDonor.blood_group,
          donation_count: editingDonor.donation_count
        })
        .eq('id', donor.id);

      if (error) throw error;

      onUpdate(editingDonor);
      toast.success("Donor updated successfully");
      setEditingDonor(null);
    } catch (error) {
      console.error('Error updating donor:', error);
      toast.error("Failed to update donor");
    }
  };

  const handleWhatsAppMessage = () => {
    const phoneNumber = donor.phone.replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/${phoneNumber}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleCall = () => {
    const phoneNumber = donor.phone.replace(/\D/g, '');
    window.location.href = `tel:${phoneNumber}`;
  };

  if (editingDonor) {
    return (
      <Card className="p-4 hover:shadow-md transition-shadow bg-white relative">
        <form onSubmit={handleUpdate} className="space-y-4">
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
          <Input
            type="number"
            value={editingDonor.donation_count || 0}
            onChange={(e) => setEditingDonor({ ...editingDonor, donation_count: parseInt(e.target.value) })}
            placeholder="Number of Donations"
            min="0"
            className="mb-2"
          />
          <div className="flex gap-2 mt-4">
            <Button type="submit">Save</Button>
            <Button variant="outline" onClick={() => setEditingDonor(null)}>Cancel</Button>
          </div>
        </form>
      </Card>
    );
  }

  return (
    <Card className="p-4 hover:shadow-md transition-shadow bg-white relative">
      <div className="flex justify-between items-start">
        <div className="flex items-start gap-2">
          {isAuthenticated && onSelect && (
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => onSelect(donor.id)}
              className="mt-1"
            />
          )}
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-medium">{donor.name}</h3>
              {donorBadge && (
                <Badge className={`${donorBadge.color} flex items-center gap-1`}>
                  <donorBadge.icon className="w-3 h-3" />
                  {donorBadge.label}
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-600">{donor.city}</p>
            {donor.donation_count > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                Donations: {donor.donation_count}
              </p>
            )}
          </div>
        </div>
        <span className="text-primary font-bold">{donor.blood_group}</span>
      </div>
      <div className="mt-2 text-sm text-gray-600">
        {isAuthenticated ? (
          <>
            <p>Contact: {donor.phone}</p>
            <p>Email: {donor.email}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditingDonor(donor)}
                className="flex items-center gap-1"
              >
                <Pencil className="w-4 h-4" /> Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleWhatsAppMessage}
                className="flex items-center gap-1"
              >
                <MessageSquare className="w-4 h-4" /> Message
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCall}
                className="flex items-center gap-1"
              >
                <Phone className="w-4 h-4" /> Call Now
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(donor.id)}
                className="flex items-center gap-1"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </Button>
            </div>
          </>
        ) : (
          <p className="text-primary">Sign in to view contact details</p>
        )}
      </div>
    </Card>
  );
};

export default DonorCard;