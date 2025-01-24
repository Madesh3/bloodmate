import { Donor } from '../types/donor';

const DONORS_KEY = 'blood_donors';

const getStoredDonors = (): Donor[] => {
  const stored = localStorage.getItem(DONORS_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const insertDonor = (donor: Omit<Donor, "id" | "createdAt">) => {
  const donors = getStoredDonors();
  const newDonor: Donor = {
    ...donor,
    id: Date.now(),
    createdAt: new Date().toISOString()
  };
  
  donors.push(newDonor);
  localStorage.setItem(DONORS_KEY, JSON.stringify(donors));
  return { changes: 1 };
};

export const getAllDonors = (): Donor[] => {
  return getStoredDonors();
};

export const getDonorsByBloodGroup = (bloodGroup: string): Donor[] => {
  const donors = getStoredDonors();
  return donors.filter(donor => donor.bloodGroup === bloodGroup);
};

export const getDonorsByCity = (city: string): Donor[] => {
  const donors = getStoredDonors();
  return donors.filter(donor => 
    donor.city.toLowerCase().includes(city.toLowerCase())
  );
};