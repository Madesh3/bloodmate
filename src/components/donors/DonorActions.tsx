import { Button } from "@/components/ui/button";
import { Pencil, Trash2, MessageSquare, Phone } from "lucide-react";

interface DonorActionsProps {
  onEdit: () => void;
  onWhatsApp: () => void;
  onCall: () => void;
  onDelete: () => void;
}

const DonorActions = ({ onEdit, onWhatsApp, onCall, onDelete }: DonorActionsProps) => {
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onEdit}
        className="flex items-center gap-1"
      >
        <Pencil className="w-4 h-4" /> Edit
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onWhatsApp}
        className="flex items-center gap-1"
      >
        <MessageSquare className="w-4 h-4" /> Message
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onCall}
        className="flex items-center gap-1"
      >
        <Phone className="w-4 h-4" /> Call Now
      </Button>
      <Button
        variant="destructive"
        size="sm"
        onClick={onDelete}
        className="flex items-center gap-1"
      >
        <Trash2 className="w-4 h-4" /> Delete
      </Button>
    </div>
  );
};

export default DonorActions;