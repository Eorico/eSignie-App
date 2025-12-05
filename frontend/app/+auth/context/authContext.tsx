import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { agreementStorage } from "@/lib/LocalStorage";
import { User, AuthContextType } from "@/lib/interFace";

// instance of authContextType
const authContext = createContext<AuthContextType | undefined>(undefined);

// global variables
const USERKEY = '@users';
const CURRENTUSERKEY = '@current_user';
const LOGIN_HISTORY_KEY = "@login_history";
// function for the logic
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
    }, []);

    // logic for signup
    const signUp = async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
        try {
            const usersData = await AsyncStorage.getItem(USERKEY);
            const users = usersData ? JSON.parse(usersData) : {};

            if (users[email]) {
                return { success: false, error: `Email already exist!` };
            }

            users[email] = { email, password, name };
            await AsyncStorage.setItem(USERKEY, JSON.stringify(users));
            await AsyncStorage.removeItem(CURRENTUSERKEY);

            await agreementStorage.create(email, {
                title: `Welcome to E-Signie: ${name}`,
                terms: "This is your first saved Agreement.",
                status: "Default",
            });

            return { success: true };
        } catch (error) {
            console.error("Sign up error:", error);
            return { success: false, error: `Failed to create account!` };
        }
    };

    // logic for login
    const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
        try {
            const usersData = await AsyncStorage.getItem(USERKEY);
            const users = usersData ? JSON.parse(usersData) : {};

            if (!users[email]) {
                return { success: false, error: `User not found!` };
            } else if (users[email].password !== password) {
                return { success: false, error: `Invalid password` };
            }

            const allAgreements = await agreementStorage.getAll();
            const userAgreements = allAgreements.filter(
                (a) => a.user_email === email
            );

            const loggedUser = {
                email: users[email].email,
                name: users[email].name,
                agreements: userAgreements,
                createdAgreement: users[email].createdAgreement || false,
            };

            await AsyncStorage.setItem(CURRENTUSERKEY, JSON.stringify(loggedUser));
            setUser(loggedUser);

            //record login history
            try {
                const historyRaw = await AsyncStorage.getItem(LOGIN_HISTORY_KEY);
                const history = historyRaw ? JSON.parse(historyRaw) : [];

                const loginRecord = {
                    email: email,
                    timestamp: new Date().toISOString(),
                    device: "Mobile",
                };
                history.push(loginRecord);
                
                if (history.length > 20) {
                    history.shift();
                }

                await AsyncStorage.setItem(LOGIN_HISTORY_KEY, JSON.stringify(history));
            } catch (historyError) {
                console.log("Failed to record login history:", historyError);
                
            }



            return { success: true };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: `Failed to login!` };
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
    const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
        try {
            const usersData = await AsyncStorage.getItem(USERKEY);
            const users = usersData ? JSON.parse(usersData) : {};

            if (!users[email]) {
                return { success: false, error: `Email does not exist!` };
            }

            return { success: true };
        } catch (error) {
            return { success: false, error: `Failed to reset password!` };
        }
    };

    // logic for update profile
    const updateProfile = async (data: { name?: string; email?: string }): Promise<{ success: boolean; error?: string }> => {
        try {
            if (!user) {
                return { success: false, error: 'No user logged in' };
            }

            const usersData = await AsyncStorage.getItem(USERKEY);
            const users = usersData ? JSON.parse(usersData) : {};

            // update user data
            if (data.name) {
                users[user.email].name = data.name;
            }
            if (data.email) {
                users[data.email] = users[user.email];
                delete users[user.email];
            }

            await AsyncStorage.setItem(USERKEY, JSON.stringify(users));

            // update current user
            const updatedUser = { ...user, ...data };
            await AsyncStorage.setItem(CURRENTUSERKEY, JSON.stringify(updatedUser));
            setUser(updatedUser);

            return { success: true };
        } catch (error) {
            console.error('Update profile error:', error);
            return { success: false, error: 'Failed to update profile' };
        }
    };

    // calling the instance variable to return it as a tags
    return (
        <authContext.Provider value={{ user, loading, login, signUp, signOut, resetPassword, updateProfile }}>
            {children}
        </authContext.Provider>
    );
}

// exporting the instance function
export function useAuth() {
    const context = useContext(authContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
}