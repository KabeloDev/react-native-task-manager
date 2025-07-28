import React, { useEffect, useState } from "react";
import { ID, Models } from "react-native-appwrite";
import { account } from "./appwrite";

type AuthContextType = {
    user: Models.User<Models.Preferences> | null;
    signIn: (email: string, password: string) => Promise<String | null>;
    signUp: (email: string, password: string) => Promise<String | null>;
    signOut: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
    const getUser = async () => {
        try {
            const userData = await account.get();
            setUser(userData);
        } catch (error) {
            setUser(null);
        }
    }

    useEffect(() => {getUser()}, []);

    const signUp = async (email: string, password: string) => {
        try {
            await account.create(ID.unique(), email, password);
            await signIn(email, password);
            return null;
        } catch (error) {
            console.error("Sign Up Error:", error);
            throw error;
        }
    }

    const signIn = async (email: string, password: string) => {
        try {
            await account.createEmailPasswordSession(email, password);
            await getUser();
            return null;
        } catch (error) {
            console.error("Sign In Error:", error);
            return "Sign In failed. Please check your credentials.";
        }
    }
    
    const signOut = async () => {
        try {
            await account.deleteSession("current");
            setUser(null);
        } catch (error) {
            console.error("Sign Out Error:", error);
        }
    }

    return <AuthContext.Provider value={{ user, signUp, signIn, signOut }}>
        {children}
    </AuthContext.Provider>;
}

export function useAuth() {
    const context = React.useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}