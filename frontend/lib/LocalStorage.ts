import AsyncStorage from '@react-native-async-storage/async-storage';
import { Witness, Party, Agreement} from './interFace';

const AGREEMENTS_KEY = '@agreements';
const PARTIES_KEY = '@parties';
const WITNESS_KEY ='@witness';

// object na inherited ung agreement
export interface AgreementWithPartiesAndWitness extends Agreement {
  parties: Party[];
  witnesses: Witness[];
}

// id generator
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

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
    try {
      const parties = await this.getAll();
      return parties.filter(p => p.agreement_id === agreementId);
    } catch (error) {
      console.error('Error reading parties:', error);
      return [];
    }
  },

  async createMultiple(data: Omit<Party, 'id' | 'created_at'>[]): Promise<Party[]> {
    try {
      const parties = await this.getAll();
      const now = new Date().toISOString();

      const newParties = data.map(d => ({
        ...d,
        id: generateId(),
        created_at: now,
      }));

      parties.push(...newParties);
      await AsyncStorage.setItem(PARTIES_KEY, JSON.stringify(parties));

      return newParties;
    } catch (error) {
      console.error('Error creating parties:', error);
      throw error;
    }
  },

  async update(id: string, data: Partial<Party>): Promise<void> {
    try {
      const parties = await this.getAll();
      const index = parties.findIndex(p => p.id === id);
      if (index === -1) throw new Error('Party not found');

      parties[index] = { ...parties[index], ...data };
      await AsyncStorage.setItem(PARTIES_KEY, JSON.stringify(parties));
    } catch (error) {
      console.error('Error updating party:', error);
      throw error;
    }
  },

  async deleteByAgreementId(agreementId: string): Promise<void> {
    try {
      const parties = await this.getAll();
      const filtered = parties.filter(p => p.agreement_id !== agreementId);
      await AsyncStorage.setItem(PARTIES_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting parties:', error);
      throw error;
    }
  },
};

export const witnessStorage = {
  async getAll(): Promise<Witness[]> {
    try {
      const data = await AsyncStorage.getItem(WITNESS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading parties:', error);
      return [];
    }
  },

  async getByAgreementId(agreementId: string): Promise<Witness[]> {
    try {
      const witnesses = await this.getAll();
      return witnesses.filter(p => p.agreement_id === agreementId);
    } catch (error) {
      console.error('Error reading witnesses:', error);
      return [];
    }
  },

  async createMultiple(data: Omit<Party, 'id' | 'created_at'>[]): Promise<Witness[]> {
    try {
      const witnesses = await this.getAll();
      const now = new Date().toISOString();

      const newWitness = data.map(d => ({
        ...d,
        id: generateId(),
        testimony: "",
        created_at: now,
      }));

      witnesses.push(...newWitness);
      await AsyncStorage.setItem(WITNESS_KEY, JSON.stringify(witnesses));

      return newWitness;
    } catch (error) {
      console.error('Error creating witnesses:', error);
      throw error;
    }
  },

  async update(id: string, data: Partial<Witness>): Promise<void> {
    try {
      const witnesses = await this.getAll();
      const index = witnesses.findIndex(p => p.id === id);
      if (index === -1) throw new Error('Party not found');

      witnesses[index] = { ...witnesses[index], ...data };
      await AsyncStorage.setItem(WITNESS_KEY, JSON.stringify(witnesses));
    } catch (error) {
      console.error('Error updating party:', error);
      throw error;
    }
  },

  async deleteByAgreementId(agreementId: string): Promise<void> {
    try {
      const witnesses = await this.getAll();
      const filtered = witnesses.filter(p => p.agreement_id !== agreementId);
      await AsyncStorage.setItem(WITNESS_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting witnesses:', error);
      throw error;
    }
  },
};

export const agreementStorage = {
  async getAll(): Promise<Agreement[]> {
    try {
      const data = await AsyncStorage.getItem(AGREEMENTS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading agreements:', error);
      return [];
    }
  },

  async getByUser(email: string): Promise<Agreement[]> {
    try {
      const all = await this.getAll();
      return all.filter(a => a.user_email === email); 
    } catch (error) {
      console.error('Error filtering agreements by user:', error);
      return [];
    }
  },

  async getById(id: string): Promise<AgreementWithPartiesAndWitness | null> {
    try {
      const agreements = await this.getAll();
      const agreement = agreements.find(a => a.id === id);
      if (!agreement) return null;

      const parties = await partyStorage.getByAgreementId(id);
      const witnesses = await witnessStorage.getByAgreementId(id);

      console.log("parties: ", parties.length);
      console.log("witnesses: ", witnesses.length);

      return { ...agreement, parties, witnesses };
    } catch (error) {
      console.error('Error reading agreement:', error);
      return null;
    }
  },

  async create(user_email: string, data: Omit<Agreement, 'id' | 'user_email' | 'created_at' | 'updated_at'>): Promise<Agreement> {
    try {
      const agreements = await this.getAll();
      const now = new Date().toISOString();

      const newAgreement: Agreement = {
        ...data,
        id: generateId(),
        user_email, // 👈 attach user email
        created_at: now,
        updated_at: now,
      };

      agreements.push(newAgreement);
      await AsyncStorage.setItem(AGREEMENTS_KEY, JSON.stringify(agreements));

      return newAgreement;
    } catch (error) {
      console.error('Error creating agreement:', error);
      throw error;
    }
  },

  async update(id: string, data: Partial<Agreement>): Promise<void> {
    try {
      const agreements = await this.getAll();
      const index = agreements.findIndex(a => a.id === id);
      if (index === -1) throw new Error('Agreement not found');

      agreements[index] = { ...agreements[index], ...data, updated_at: new Date().toISOString() };
      await AsyncStorage.setItem(AGREEMENTS_KEY, JSON.stringify(agreements));
    } catch (error) {
      console.error('Error updating agreement:', error);
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const agreements = await this.getAll();
      const filtered = agreements.filter(a => a.id !== id);
      await AsyncStorage.setItem(AGREEMENTS_KEY, JSON.stringify(filtered));
      await partyStorage.deleteByAgreementId(id);
      await witnessStorage.deleteByAgreementId(id);
    } catch (error) {
      console.error('Error deleting agreement:', error);
      throw error;
    }
  },
};