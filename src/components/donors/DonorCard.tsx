import { useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import DonorBadge from "./DonorBadge";
import DonorEditForm from "./DonorEditForm";
import DonorActions from "./DonorActions";

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
      <DonorEditForm
        editingDonor={editingDonor}
        setEditingDonor={setEditingDonor}
        onSubmit={handleUpdate}
        onCancel={() => setEditingDonor(null)}
      />
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
              <DonorBadge donationCount={donor.donation_count || 0} />
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
            <DonorActions
              onEdit={() => setEditingDonor(donor)}
              onWhatsApp={handleWhatsAppMessage}
              onCall={handleCall}
              onDelete={() => onDelete(donor.id)}
            />
          </>
        ) : (
          <p className="text-primary">Sign in to view contact details</p>
        )}
      </div>
    </Card>
  );
};

export default DonorCard;