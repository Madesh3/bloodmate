import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface DonorEditFormProps {
  editingDonor: any;
  setEditingDonor: (donor: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

const DonorEditForm = ({ 
  editingDonor, 
  setEditingDonor, 
  onSubmit, 
  onCancel 
}: DonorEditFormProps) => {
  return (
    <Card className="p-4 hover:shadow-md transition-shadow bg-white relative">
      <form onSubmit={onSubmit} className="space-y-4">
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
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
        </div>
      </form>
    </Card>
  );
};

export default DonorEditForm;