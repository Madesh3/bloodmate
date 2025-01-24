import { useState, useEffect } from "react";

export const useDonorSelection = (donors: any[]) => {
  const [selectedDonors, setSelectedDonors] = useState<string[]>([]);

  useEffect(() => {
    setSelectedDonors([]);
  }, [donors]);

  const handleDonorSelect = (donorId: string) => {
    setSelectedDonors(prev => {
      if (prev.includes(donorId)) {
        return prev.filter(id => id !== donorId);
      } else {
        return [...prev, donorId];
      }
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allDonorIds = donors.map(donor => donor.id);
      setSelectedDonors(allDonorIds);
    } else {
      setSelectedDonors([]);
    }
  };

  return {
    selectedDonors,
    setSelectedDonors,
    handleDonorSelect,
    handleSelectAll
  };
};