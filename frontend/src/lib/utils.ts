import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


// Definim tipul pentru starea noastră
export type AccountType = 'personal' | 'business' | '';

interface AuthState {
  accountType: AccountType;
  setAccountType: (type: AccountType) => void; // Pentru a schimba tipul contului
}

// Creăm store-ul cu persist middleware
export const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      // Starea inițială
      accountType: "",

      // Acțiune pentru a schimba tipul contului (folosită în formularul Auth)
      setAccountType: (type) => set({ accountType: type }),
    }),
    {
      name: 'auth-storage', // Numele cheii în localStorage
      storage: createJSONStorage(() => localStorage), // Specificăm localStorage
    }
  )
);