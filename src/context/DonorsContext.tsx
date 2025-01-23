import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getAllDonors, insertDonor } from "@/utils/db";

interface Donor {
  id: number;
  name: string;
  bloodGroup: string;
  city: string;
  phone: string;
  email: string;
}

interface DonorsContextType {
  donors: Donor[];
  addDonor: (donor: Omit<Donor, "id">) => void;
}

const DonorsContext = createContext<DonorsContextType | undefined>(undefined);

export function DonorsProvider({ children }: { children: ReactNode }) {
  const [donors, setDonors] = useState<Donor[]>([]);

  useEffect(() => {
    // Load initial donors from database
    const loadedDonors = getAllDonors();
    setDonors(loadedDonors);
  }, []);

  const addDonor = (newDonor: Omit<Donor, "id">) => {
    const result = insertDonor(newDonor);
    if (result.changes > 0) {
      // Refresh donors list after successful insertion
      const updatedDonors = getAllDonors();
      setDonors(updatedDonors);
    }
  };

  return (
    <DonorsContext.Provider value={{ donors, addDonor }}>
      {children}
    </DonorsContext.Provider>
  );
}

export function useDonors() {
  const context = useContext(DonorsContext);
  if (context === undefined) {
    throw new Error("useDonors must be used within a DonorsProvider");
  }
  return context;
}