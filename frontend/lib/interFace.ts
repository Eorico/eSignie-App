// para syang .kt sa android studio

// for user inputs
export interface User {
    email: string;
    name: string;
    draftsAgreement?: number,
    completedAgreement?: number,
    createdAgreement: number,
}

// for authentication process
export interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean, error?: string }>;
    signUp: (email: string, password: string, name: string) => Promise<{ success: boolean, error?: string }>;
    signOut: () => Promise<void>;
    resetPassword: (email: string) => Promise<{ success: boolean, error?: string }>;
    updateProfile: (data: { name?: string; email?: string }) => Promise<{ success: boolean; error?: string }>;
}

// object agreement
export interface Agreement {
  id: string;
  user_email: string; 
  title: string;
  terms: string;
  status: string;
  created_at: string;
  updated_at: string;
}

// object party
export interface Party {
  id: string;
  agreement_id: string;
  name: string;
  role: string;
  address: string;
  idType: string;
  id_number: string;
  id_photo_uri?: string;
  signature_url?: string;
  signed_at?: string;
  created_at: string;
}

export interface Witness extends Party {
  testimony: string;
}

// object inteface ng party inputs
export interface PartyInput {
  name: string;
  role: string;
  id_number: string;
  address: string;
  idType: string;
  id_photo_uri?: string;
}

export interface WitnessInput extends PartyInput {
  testimony?: string;
}
