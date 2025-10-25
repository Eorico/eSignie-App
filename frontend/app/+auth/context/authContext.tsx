import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { agreementStorage } from "@/lib/LocalStorage";

// for user inputs
interface User {
    email: string;
    name: string;
}

// for authentication process
interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean, error?: string }>;
    signUp: (email: string, password: string, name: string) => Promise<{ success: boolean, error?: string }>;
    signOut: () => Promise<void>;
    resetPassword: (email: string) => Promise<{ success: boolean, error?: string }>;
}

// instace of authContextType
const authContext = createContext<AuthContextType | undefined>(undefined);

// global variables yan
const USERKEY = '@users';
const CURRENTUSERKEY = '@current_user';

// function for the logic
export function AuthProvider ({children}:{children: React.ReactNode}) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const loadUser = async () => {
        try {
            const userData = await AsyncStorage.getItem(CURRENTUSERKEY);
            if (userData) {
                setUser(JSON.parse(userData));
            }
        } catch (error) {
            console.error(`Error loading user: ${error}`);
        } finally {
            setLoading(false);
        }
    }

    useEffect(()=>{
        loadUser();
    }, []);

    // logic for signup
    const signUp = async (email: string, password: string, name: string): Promise<{success: boolean, error?: string}> => {
        try {
            const usersData = await AsyncStorage.getItem(USERKEY);
            const users = usersData?JSON.parse(usersData) : {};

            if (users[email]) {
                return {success: false, error: `Email already exist!`};
            }

            users[email] = { email, password, name };
            await AsyncStorage.setItem(USERKEY, JSON.stringify(users))

            await AsyncStorage.removeItem(CURRENTUSERKEY);

            await agreementStorage.create(email, {
                title: `Welcome to E-Signie: ${name}`,
                terms: "This is you first saved Agreement.",
                status: "Active",
            });
            

            return { success: true };
        } catch (error) {
            console.error("Sign up error:", error)
            return { success: false, error: `Failed to create account!` };
        }
    };
    // logic for login
    const login = async (email: string, password: string,): Promise<{success: boolean, error?: string}> => {
        try {
            const usersData = await AsyncStorage.getItem(USERKEY);
            const users = usersData?JSON.parse(usersData) : {}; 

            if (!users[email]) {
                return {success: false, error:`User not found!`};
            } else if (users[email].password !== password) {
                return {success: false, error: `Invalid passsword`};
            }

            const allAgreements = await agreementStorage.getAll();
            const userAgreements = allAgreements.filter(
                (a) => a.user_email === email
            );

            const loggedUser = {
                email: users[email].email, 
                name: users[email].name,
                agreements: userAgreements,
            };

            await AsyncStorage.setItem(CURRENTUSERKEY, JSON.stringify(loggedUser));
            setUser(loggedUser);

            return {success: true};
        } catch (error) {
            console.error('Login error:', error)
            return {success: false, error: `Failed to login!`}
        }
    };
    // logic for logout
    const signOut = async () => {
        try {
            await AsyncStorage.removeItem(CURRENTUSERKEY);
            setUser(null);
        } catch (error) {
            console.error(`Error signing out: ${error}`);
        }
    };
    // logic for reset password
    const resetPassword = async (email: string): Promise<{success: boolean, error?: string}> => {
        try {
            const usersData = await AsyncStorage.getItem(USERKEY);
            const users = usersData?JSON.parse(usersData) : {}; 
            
            if (!users[email]) {
                return {success: false, error:`Email does not exist!`};
            }

            return {success: true};
        } catch (error) {
            return {success: false, error: `Failed to reset password!`};
        }
    };

    // calling the instance variable to return it as a tags
    return (
        <authContext.Provider value={{user, loading, login, signUp, signOut, resetPassword}}>
            {children}
        </authContext.Provider>
    );
}

// exporting the instance function
export function useAuth() {
    const context = useContext(authContext);
    if (context === undefined) {
        throw new Error('userAuth must be used with in an AuthProvider')
    }

    return context;
}
