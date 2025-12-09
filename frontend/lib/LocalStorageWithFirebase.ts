import AsyncStorage from '@react-native-async-storage/async-storage';
import { Witness, Party, Agreement } from './interFace';
import { RealTimeDataBase } from '@/firebase/firebase';
import { ref, set, update, remove } from 'firebase/database';
import { SubscriptionToRealTimeDatabase } from '@/firebase/firebaseRealtimeSync';

const AGREEMENTS_KEY = '@agreements';
const PARTIES_KEY = '@parties';
const WITNESS_KEY = '@witness';

// Subscribe to real-time database changes
const initializeRealTimeSync = () => {
  try { SubscriptionToRealTimeDatabase("agreements", AGREEMENTS_KEY); } 
  catch(e) { console.error("Failed to subscribe agreements:", e); }
  try { SubscriptionToRealTimeDatabase("parties", PARTIES_KEY); } 
  catch(e) { console.error("Failed to subscribe parties:", e); }
  try { SubscriptionToRealTimeDatabase("witnesses", WITNESS_KEY); } 
  catch(e) { console.error("Failed to subscribe witnesses:", e); }
}
initializeRealTimeSync();

// Helpers
const sanitizeKey = (key: string) => key.replace(/\./g, ',');
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Fetch user_email from an agreement by agreement_id
const getUserEmailFromAgreement = async (agreementId: string): Promise<string | null> => {
  const agreementsData = await AsyncStorage.getItem(AGREEMENTS_KEY);
  const agreements: Agreement[] = agreementsData ? JSON.parse(agreementsData) : [];
  const agreement = agreements.find(a => a.id === agreementId);
  return agreement?.user_email || null;
};

// Firebase sync functions
const syncToFirebase = async (collection: "agreements" | "parties" | "witnesses", data: any) => {
  try {
    const id = sanitizeKey(data.id);
    let path = '';

    if (collection === 'agreements') {
      const userKey = sanitizeKey(data.user_email);
      path = `users/${userKey}/agreements/${id}`;
    } else {
      const userEmail = await getUserEmailFromAgreement(data.agreement_id);
      if (!userEmail) throw new Error('Parent agreement not found for Party/Witness');
      const userKey = sanitizeKey(userEmail);
      path = `users/${userKey}/agreements/${sanitizeKey(data.agreement_id)}/${collection}/${id}`;
    }

    set(ref(RealTimeDataBase, path), data);
  } catch (error) {
    console.error(`Failed to sync ${collection}:`, error);
  }
};

const updateFirebase = async (collection: "agreements" | "parties" | "witnesses", id: string, data: any) => {
  try {
    const safeId = sanitizeKey(id);
    let path = '';

    if (collection === 'agreements') {
      const userKey = sanitizeKey(data.user_email);
      path = `users/${userKey}/agreements/${safeId}`;
    } else {
      const userEmail = await getUserEmailFromAgreement(data.agreement_id);
      if (!userEmail) throw new Error('Parent agreement not found for Party/Witness');
      const userKey = sanitizeKey(userEmail);
      path = `users/${userKey}/agreements/${sanitizeKey(data.agreement_id)}/${collection}/${safeId}`;
    }

    update(ref(RealTimeDataBase, path), data);
  } catch (error) {
    console.error(`Failed to update ${collection}:`, error);
  }
};

const deleteFromFirebase = async (collection: "agreements" | "parties" | "witnesses", id: string, agreementId?: string, userEmail?: string) => {
  try {
    let path = '';

    if (collection === 'agreements') {
      if (!userEmail) throw new Error('Missing user email for deleting agreement');
      path = `users/${sanitizeKey(userEmail)}/agreements/${sanitizeKey(id)}`;
    } else {
      if (!agreementId) throw new Error('Missing agreementId for deleting Party/Witness');
      const email = userEmail || await getUserEmailFromAgreement(agreementId);
      if (!email) throw new Error('Parent agreement not found for Party/Witness');
      path = `users/${sanitizeKey(email)}/agreements/${sanitizeKey(agreementId)}/${collection}/${sanitizeKey(id)}`;
    }

    remove(ref(RealTimeDataBase, path));
  } catch (error) {
    console.error(`Failed to delete ${collection}:`, error);
  }
};

// Agreement with parties and witnesses
export interface AgreementWithPartiesAndWitness extends Agreement {
  parties: Party[];
  witnesses: Witness[];
}

// Party Storage
export const partyStorage = {
  async getAll(): Promise<Party[]> {
    try {
      const data = await AsyncStorage.getItem(PARTIES_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading parties:', error);
      return [];
    }
  },
  async getByAgreementId(agreementId: string): Promise<Party[]> {
    const parties = await this.getAll();
    return parties.filter(p => p.agreement_id === agreementId);
  },
  async createMultiple(data: Omit<Party, 'id' | 'created_at'>[]): Promise<Party[]> {
    const parties = await this.getAll();
    const now = new Date().toISOString();
    const newParties = data.map(d => ({ ...d, id: generateId(), created_at: now }));
    parties.push(...newParties);
    await AsyncStorage.setItem(PARTIES_KEY, JSON.stringify(parties));
    newParties.forEach(p => syncToFirebase('parties', p));
    return newParties;
  },
  async update(id: string, data: Partial<Party>): Promise<void> {
    const parties = await this.getAll();
    const index = parties.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Party not found');
    parties[index] = { ...parties[index], ...data };
    await AsyncStorage.setItem(PARTIES_KEY, JSON.stringify(parties));
    await syncToFirebase('parties', parties[index]);
  },
  async deleteByAgreementId(agreementId: string, user_email: string): Promise<void> {
    const parties = await this.getAll();
    const toDelete = parties.filter(p => p.agreement_id === agreementId);
    const remaining = parties.filter(p => p.agreement_id !== agreementId);
    await AsyncStorage.setItem(PARTIES_KEY, JSON.stringify(remaining));
    for (const p of toDelete){
      await deleteFromFirebase('parties', p.id, agreementId, user_email)
    }
  }
};

// Witness Storage
export const witnessStorage = {
  async getAll(): Promise<Witness[]> {
    const data = await AsyncStorage.getItem(WITNESS_KEY);
    return data ? JSON.parse(data) : [];
  },
  async getByAgreementId(agreementId: string): Promise<Witness[]> {
    const witnesses = await this.getAll();
    return witnesses.filter(w => w.agreement_id === agreementId);
  },
  async createMultiple(data: Omit<Witness, 'id' | 'created_at'>[]): Promise<Witness[]> {
    const witnesses = await this.getAll();
    const now = new Date().toISOString();
    const newWitness = data.map(d => ({ ...d, id: generateId(), testimony: d.testimony || '', created_at: now }));
    witnesses.push(...newWitness);
    await AsyncStorage.setItem(WITNESS_KEY, JSON.stringify(witnesses));
    newWitness.forEach(w => syncToFirebase('witnesses', w));
    return newWitness;
  },
  async update(id: string, data: Partial<Witness>): Promise<void> {
    const witnesses = await this.getAll();
    const index = witnesses.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Witness not found');
    witnesses[index] = { ...witnesses[index], ...data };
    await AsyncStorage.setItem(WITNESS_KEY, JSON.stringify(witnesses));
    await syncToFirebase('witnesses', witnesses[index]);
  },
  async deleteByAgreementId(agreementId: string, user_email: string): Promise<void> {
    const witnesses = await this.getAll();
    const toDelete = witnesses.filter(w => w.agreement_id === agreementId);
    const remaining = witnesses.filter(w => w.agreement_id !== agreementId);
    await AsyncStorage.setItem(WITNESS_KEY, JSON.stringify(remaining));
    for (const w of toDelete) {
      await deleteFromFirebase('witnesses', w.id, agreementId, user_email)
    }
  }
};

// Agreement Storage
export const agreementStorage = {
  async getAll(): Promise<Agreement[]> {
    const data = await AsyncStorage.getItem(AGREEMENTS_KEY);
    return data ? JSON.parse(data) : [];
  },
  async getByUser(email: string): Promise<Agreement[]> {
    const all = await this.getAll();
    return all.filter(a => a.user_email === email);
  },
  async getById(id: string): Promise<AgreementWithPartiesAndWitness | null> {
    const agreements = await this.getAll();
    const agreement = agreements.find(a => a.id === id);
    if (!agreement) return null;
    const parties = await partyStorage.getByAgreementId(id);
    const witnesses = await witnessStorage.getByAgreementId(id);
    return { ...agreement, parties, witnesses };
  },
  async create(user_email: string, data: Omit<Agreement, 'id' | 'user_email' | 'created_at' | 'updated_at'>): Promise<Agreement> {
    const agreements = await this.getAll();
    const now = new Date().toISOString();
    const newAgreement: Agreement = { ...data, id: generateId(), user_email, created_at: now, updated_at: now };
    agreements.push(newAgreement);
    await AsyncStorage.setItem(AGREEMENTS_KEY, JSON.stringify(agreements));
    await syncToFirebase('agreements', newAgreement);
    return newAgreement;
  },
  async update(id: string, data: Partial<Agreement>): Promise<void> {
    const agreements = await this.getAll();
    const index = agreements.findIndex(a => a.id === id);
    if (index === -1) throw new Error('Agreement not found');
    agreements[index] = { ...agreements[index], ...data, updated_at: new Date().toISOString() };
    await AsyncStorage.setItem(AGREEMENTS_KEY, JSON.stringify(agreements));
    await syncToFirebase('agreements', agreements[index]);
  },
  async delete(id: string): Promise<void> {
    const agreements = await this.getAll();
    const agreement = agreements.find(a => a.id === id);
    if (!agreement) return;

    const user_email = agreement.user_email

    const remaining = agreements.filter(a => a.id !== id);
    await AsyncStorage.setItem(AGREEMENTS_KEY, JSON.stringify(remaining));
    await deleteFromFirebase('agreements', id, undefined, agreement.user_email);
    await partyStorage.deleteByAgreementId(id, user_email);
    await witnessStorage.deleteByAgreementId(id, user_email);
  }
};
