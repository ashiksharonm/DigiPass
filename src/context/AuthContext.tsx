import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut as firebaseSignOut,
    User as FirebaseUser
} from 'firebase/auth';
import { auth } from '../services/firebase';
import { UserService } from '../services/UserService';
import { User, BusPass, TravelRecord } from '../services/mockData';

interface AuthContextType {
    user: User | null;
    firebaseUser: FirebaseUser | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    signIn: (email: string, password: string) => Promise<boolean>;
    signUp: (userData: Partial<User>, password?: string) => Promise<boolean>;
    signOut: () => Promise<void>;
    passes: BusPass[];
    addPass: (pass: BusPass) => Promise<void>;
    travelRecords: TravelRecord[];
    addTravelRecord: (record: TravelRecord) => Promise<void>;
    refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [passes, setPasses] = useState<BusPass[]>([]);
    const [travelRecords, setTravelRecords] = useState<TravelRecord[]>([]);

    // Monitor Auth State
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setFirebaseUser(currentUser);
            if (currentUser) {
                await fetchUserData(currentUser.uid);
            } else {
                setUser(null);
                setPasses([]);
                setTravelRecords([]);
            }
            setIsLoading(false);
        });

        return unsubscribe;
    }, []);

    const fetchUserData = async (uid: string) => {
        try {
            const userProfile = await UserService.getUserProfile(uid);
            if (userProfile) {
                setUser(userProfile);
                const userPasses = await UserService.getUserPasses(uid);
                setPasses(userPasses);
                const userTravel = await UserService.getUserTravelHistory(uid);
                setTravelRecords(userTravel);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const signIn = async (email: string, password: string): Promise<boolean> => {
        try {
            setIsLoading(true);
            await signInWithEmailAndPassword(auth, email, password);
            // onAuthStateChanged will handle the rest
            return true;
        } catch (error) {
            console.error('Sign in error:', error);
            setIsLoading(false);
            return false;
        }
    };

    const signUp = async (userData: Partial<User>, password?: string): Promise<boolean> => {
        try {
            setIsLoading(true);
            // Create auth user
            const { user: newUser } = await createUserWithEmailAndPassword(auth, userData.email!, password || '123456');

            // Create profile
            const userProfile: User = {
                id: newUser.uid,
                name: userData.name || 'User',
                email: userData.email || '',
                phone: userData.phone || '',
                address: userData.address || '',
                gender: userData.gender || '',
                role: userData.role || 'passenger',
                createdAt: new Date().toISOString(),
            };

            await UserService.createUserProfile(userProfile);

            // Update local state is handled by onAuthStateChanged -> fetchUserData
            return true;
        } catch (error) {
            console.error('Sign up error:', error);
            setIsLoading(false);
            return false;
        }
    };

    const signOut = async () => {
        try {
            await firebaseSignOut(auth);
        } catch (error) {
            console.error('Sign out error:', error);
        }
    };

    const addPass = async (pass: BusPass) => {
        try {
            await UserService.createPass(pass);
            // Refresh passes
            if (user) {
                const updatedPasses = await UserService.getUserPasses(user.id);
                setPasses(updatedPasses);
            }
        } catch (error) {
            console.error('Error adding pass:', error);
        }
    };

    const addTravelRecord = async (record: TravelRecord) => {
        try {
            await UserService.addTravelRecord(record);
            if (user) {
                const updatedRecords = await UserService.getUserTravelHistory(user.id);
                setTravelRecords(updatedRecords);
            }
        } catch (error) {
            console.error('Error adding travel record:', error);
        }
    };

    const refreshUserData = async () => {
        if (firebaseUser) {
            await fetchUserData(firebaseUser.uid);
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            firebaseUser,
            isAuthenticated: !!user,
            isLoading,
            signIn,
            signUp,
            signOut,
            passes,
            addPass,
            travelRecords,
            addTravelRecord,
            refreshUserData,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
