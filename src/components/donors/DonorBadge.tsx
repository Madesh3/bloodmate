import { Trophy, Medal, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const getDonorBadge = (donationCount: number) => {
  if (donationCount >= 10) {
    return { icon: Trophy, label: "Platinum Donor", color: "bg-purple-100 text-purple-800" };
  } else if (donationCount >= 5) {
    return { icon: Medal, label: "Gold Donor", color: "bg-yellow-100 text-yellow-800" };
  } else if (donationCount >= 3) {
    return { icon: Star, label: "Silver Donor", color: "bg-gray-100 text-gray-800" };
  }
  return null;
};

interface DonorBadgeProps {
  donationCount: number;
}

const DonorBadge = ({ donationCount }: DonorBadgeProps) => {
  const badge = getDonorBadge(donationCount);
  
  if (!badge) return null;
  
  return (
    <Badge className={`${badge.color} flex items-center gap-1`}>
      <badge.icon className="w-3 h-3" />
      {badge.label}
    </Badge>
  );
};

export default DonorBadge;