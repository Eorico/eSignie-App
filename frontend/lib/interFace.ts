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
  id_number: string;
  id_photo_url?: string;
  signature_url?: string;
  signed_at?: string;
  created_at: string;
}

export interface Witness extends Party {
  
}


// object inteface ng party inputs
export interface PartyInput {
  name: string;
  role: string;
  id_number: string;
  address: string;
  idType: string;
}

export interface WitnessInput extends PartyInput {
  testimony?: string;
}