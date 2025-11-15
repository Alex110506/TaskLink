import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- TIPURILE PENTRU STORE ---

// Definim tipul pentru starea noastră
export type AccountType = "personal" | "business" | "";

// Definim interfața User (fără parolă), bazată pe schema Mongoose
export interface User {
  fullName: string;
  email: string;
  phoneNumber: string;
  bio: string;
  job: string;
  yearsExperience: number;
  skills: string;
  location: string;
}

export interface Business {
  name: string;
  field: string;
  about: string;
  email: string;
  phone: string;
  location: string;
}

// Definim starea completă a store-ului
interface AuthState {
  accountType: AccountType;
  user: User | null; // Adăugăm user-ul, care poate fi null
  businessUser: Business | null; // Adăugăm user-ul, care poate fi null
  setAccountType: (type: AccountType) => void; // Pentru a schimba tipul contului
  setPersonal: (user: User | null) => void; // Acțiune pentru a seta sau reseta user-ul
  setBusinessUser: (businessUser: Business | null) => void; // Acțiune pentru a seta sau reseta user-ul
}

// Creăm store-ul cu persist middleware
export const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      // Starea inițială
      accountType: "personal",
      user: null, // Starea inițială pentru user este null // Acțiune pentru a schimba tipul contului (folosită în formularul Auth)
      businessUser: null,
      setAccountType: (type) => set({ accountType: type }),

      // Acțiune pentru a seta user-ul (la login) sau a-l reseta (la logout)
      setPersonal: (user) => set({ user: user }),
      setBusinessUser: (business) => set({ businessUser: business }),
    }),
    {
      name: "auth-storage", // Numele cheii în localStorage
      storage: createJSONStorage(() => localStorage), // Specificăm localStorage
    }
  )
);
