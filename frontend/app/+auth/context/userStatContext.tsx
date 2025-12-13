import React, { createContext, useContext, useState, ReactNode } from "react";
import { User } from "@/lib/interFace";
import { RealTimeDataBase } from "@/firebase/firebase";
import { ref, update } from 'firebase/database';

const sanitizeKey = (key: string) => key.replace(/\./g, ",");

type UserStatContextType = {
  userStat: User ;
  setUserStat: React.Dispatch<React.SetStateAction<User>>;
  incrementStat: (stat: keyof User, amount?: number) => void;
};

const UserStatContext = createContext<UserStatContextType | undefined>(undefined);

export const UserStatProvider = ({ children }: { children: ReactNode }) => {
  const [userStat, setUserStat] = useState<User>({
    name: '',
    email: '',
    draftsAgreement: 0,
    completedAgreement: 0,
    createdAgreement: 0
  });

  const incrementStat = (stat: keyof User, amount = 1) => {
    setUserStat(prev => {
      const updated = {
        ...prev,
        [stat]: Number(prev[stat] || 0) + amount
      };

      if (prev.email) {
        const userKey = sanitizeKey(prev.email);
        update(ref(RealTimeDataBase, `users/${userKey}/stats`), {
          draftsAgreement: updated.draftsAgreement,
          completedAgreement: updated.completedAgreement,
          createdAgreement: updated.createdAgreement,
        });
      }

      return updated;
    });
  };

  return (
    <UserStatContext.Provider value={{ userStat, setUserStat, incrementStat }}>
      {children}
    </UserStatContext.Provider>
  );
};

export const useUserStat = () => {
  const context = useContext(UserStatContext);
  if (!context) throw new Error("useUserStat must be used within UserStatProvider");
  return context;
};