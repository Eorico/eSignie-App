import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { agreementStorage } from "@/lib/LocalStorageWithFirebase";
import { User, AuthContextType } from "@/lib/interFace";
import { auth, RealTimeDataBase } from '../../../firebase/firebase';
import { 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    updateProfile as firebaseUpdateProfile
} from 'firebase/auth';
import { ref, set, update } from 'firebase/database';
import { SubscriptionToRealTimeDatabase } from "@/firebase/firebaseRealtimeSync";

const authContext = createContext<AuthContextType | undefined>(undefined);

const USERKEY = '@users';
const CURRENTUSERKEY = '@current_user';
const LOGIN_HISTORY_KEY = "@login_history";

// Utility to make email safe for Realtime Database keys
const sanitizeKey = (key: string) => key.replace(/\./g, ',');

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const loadUser = async () => {
        try {
            const userData = await AsyncStorage.getItem(CURRENTUSERKEY);
            if (userData) {
                setUser(JSON.parse(userData));
            } else {
                const remember = await AsyncStorage.getItem('rememberMe');
                const storedEmail = await AsyncStorage.getItem('email');
                const storedPassword = await AsyncStorage.getItem('password');

                if (remember === 'true' && storedEmail && storedPassword) {
                    const result = await login(storedEmail, storedPassword);
                    if (result.success) {
                        console.log('User logged in from remember me');
                    } else {
                        console.error(`Auto login failed: ${result.error}`);
                    }
                }
            }
        } catch (error) {
            console.error(`Error loading user: ${error}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUser();

        SubscriptionToRealTimeDatabase('agreements', USERKEY);
        SubscriptionToRealTimeDatabase('current_user', CURRENTUSERKEY);
        SubscriptionToRealTimeDatabase('login_history', LOGIN_HISTORY_KEY);
    }, []);

    const signUp = async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);

            if (auth.currentUser) {
                await firebaseUpdateProfile(auth.currentUser, { displayName: name })
            }

            const usersData = await AsyncStorage.getItem(USERKEY);
            const users = usersData ? JSON.parse(usersData) : {};

            if (users[email]) {
                return { success: false, error: `Email already exists!` };
            }

            users[email] = { email, password, name };
            await AsyncStorage.setItem(USERKEY, JSON.stringify(users));
            await AsyncStorage.removeItem(CURRENTUSERKEY);

            const defaultAgreement = await agreementStorage.create(email, {
                    title: `Welcome to E-Signie: ${name}`,
                    terms: "This is your first saved Agreement.",
                    status: "Default",
            });

            // Save user to Realtime Database with safe key
            const userKey = sanitizeKey(email);
            await set(ref(RealTimeDataBase, `users/${userKey}`), {
                email,
                name,
                createdAgreement: false,
                agreements: [defaultAgreement]
            });

            return { success: true };
        } catch (error) {
            console.error("Sign up error:", error);
            return { success: false, error: `Failed to create account!` };
        }
    };

    const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const firebaseUser = userCredential.user;

            const usersData = await AsyncStorage.getItem(USERKEY);
            const users = usersData ? JSON.parse(usersData) : {};

            users[email].password = password;
            await AsyncStorage.setItem(USERKEY, JSON.stringify(users));

            const allAgreements = await agreementStorage.getAll();
            const userAgreements = allAgreements.filter((a) => a.user_email === email);

            const loggedUser = {
                uid: firebaseUser.uid,
                email: users[email].email,
                name: users[email].name,
                agreements: userAgreements,
                createdAgreement: users[email].createdAgreement || false,
            };

            await AsyncStorage.setItem(CURRENTUSERKEY, JSON.stringify(loggedUser));
            setUser(loggedUser);

            // Record login history
            try {
                const historyRaw = await AsyncStorage.getItem(LOGIN_HISTORY_KEY);
                const history = historyRaw ? JSON.parse(historyRaw) : [];

                const loginRecord = {
                    email: email,
                    timestamp: new Date().toISOString(),
                    device: "Mobile",
                };
                history.push(loginRecord);

                if (history.length > 20) history.shift();

                await AsyncStorage.setItem(LOGIN_HISTORY_KEY, JSON.stringify(history));
            } catch (historyError) {
                console.log("Failed to record login history:", historyError);
            }

            // Update last login in Realtime Database
            const userKey = sanitizeKey(email);
            await update(ref(RealTimeDataBase, `users/${userKey}`), {
                lastLogin: new Date().toISOString(),
                name: users[email].name
            });

            return { success: true };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: `Failed to login!` };
        }
    };

    const signOut = async () => {
        try {
            await AsyncStorage.removeItem(CURRENTUSERKEY);
            setUser(null);
        } catch (error) {
            console.error(`Error signing out: ${error}`);
        }
    };

    const resetPassword = async (email: string, newPassword?: string): Promise<{ success: boolean; error?: string }> => {
        try {
            await sendPasswordResetEmail(auth, email);

            const usersData = await AsyncStorage.getItem(USERKEY);
            const users = usersData ? JSON.parse(usersData) : {};

            if (!users[email]) return { success: false, error: `Email does not exist!` };

            if (newPassword) {
                users[email].password = newPassword;
                await AsyncStorage.setItem(USERKEY, JSON.stringify(users));

                const userKey = sanitizeKey(email);
                await set(ref(RealTimeDataBase, `users/${userKey}`), users[email]);
            }

            return { success: true };
        } catch (error) {
            console.error("Failed to reset password:", error);
            return { success: false, error: `Failed to reset password!` };
        }
    };

    const updateProfile = async (data: { name?: string; email?: string }): Promise<{ success: boolean; error?: string }> => {
        try {
            if (!user) return { success: false, error: 'No user logged in' };

            const usersData = await AsyncStorage.getItem(USERKEY);
            const users = usersData ? JSON.parse(usersData) : {};

            if (data.name) users[user.email].name = data.name;
            if (data.email) {
                users[data.email] = users[user.email];
                delete users[user.email];
            }

            await AsyncStorage.setItem(USERKEY, JSON.stringify(users));

            const updatedUser = { ...user, ...data };
            await AsyncStorage.setItem(CURRENTUSERKEY, JSON.stringify(updatedUser));
            setUser(updatedUser);

            const userKey = sanitizeKey(data.email || user.email);
            await update(ref(RealTimeDataBase, `users/${userKey}`), updatedUser);

            return { success: true };
        } catch (error) {
            console.error('Update profile error:', error);
            return { success: false, error: 'Failed to update profile' };
        }
    };

    return (
        <authContext.Provider value={{ user, loading, login, signUp, signOut, resetPassword, updateProfile }}>
            {children}
        </authContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(authContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
}
