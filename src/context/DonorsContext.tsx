import { createContext, useContext, useState, ReactNode } from "react";

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
  const [donors, setDonors] = useState<Donor[]>([
    { id: 1, name: "John Doe", bloodGroup: "A+", city: "New York", phone: "+1234567890", email: "john@example.com" },
    { id: 2, name: "Jane Smith", bloodGroup: "O-", city: "Los Angeles", phone: "+1987654321", email: "jane@example.com" },
    { id: 3, name: "Mike Johnson", bloodGroup: "B+", city: "Chicago", phone: "+1122334455", email: "mike@example.com" },
  ]);

  const addDonor = (newDonor: Omit<Donor, "id">) => {
    setDonors(prev => [...prev, { ...newDonor, id: prev.length + 1 }]);
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