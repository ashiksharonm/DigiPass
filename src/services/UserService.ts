import { db } from './firebase';
import {
    doc,
    setDoc,
    getDoc,
    updateDoc,
    collection,
    addDoc,
    query,
    where,
    getDocs,
    serverTimestamp,
    orderBy
} from 'firebase/firestore';
import { User, BusPass, TravelRecord } from './mockData';

export const UserService = {
    // User Profile
    async createUserProfile(user: User) {
        try {
            const userRef = doc(db, 'users', user.id);
            await setDoc(userRef, {
                ...user,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            }, { merge: true });
        } catch (error) {
            console.error('Error creating user profile:', error);
            throw error;
        }
    },

    async getUserProfile(userId: string): Promise<User | null> {
        try {
            const userRef = doc(db, 'users', userId);
            const docSnap = await getDoc(userRef);
            if (docSnap.exists()) {
                return docSnap.data() as User;
            }
            return null;
        } catch (error) {
            console.error('Error getting user profile:', error);
            throw error;
        }
    },

    async updateUserProfile(userId: string, data: Partial<User>) {
        try {
            const userRef = doc(db, 'users', userId);
            await updateDoc(userRef, {
                ...data,
                updatedAt: serverTimestamp()
            });
        } catch (error) {
            console.error('Error updating user profile:', error);
            throw error;
        }
    },

    // Bus Passes
    async createPass(pass: BusPass) {
        try {
            // Create a new document in 'passes' collection
            // We use the pass ID as the document ID for easier reference
            const passRef = doc(db, 'passes', pass.id);
            await setDoc(passRef, {
                ...pass,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });
            return pass.id;
        } catch (error) {
            console.error('Error creating pass:', error);
            throw error;
        }
    },

    async getUserPasses(userId: string): Promise<BusPass[]> {
        try {
            const q = query(
                collection(db, 'passes'),
                where('userId', '==', userId),
                orderBy('createdAt', 'desc')
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => doc.data() as BusPass);
        } catch (error) {
            console.error('Error getting user passes:', error);
            throw error;
        }
    },

    // Travel Records
    async addTravelRecord(record: TravelRecord) {
        try {
            const recordRef = doc(db, 'travelRecords', record.id);
            await setDoc(recordRef, {
                ...record,
                timestamp: serverTimestamp()
            });
        } catch (error) {
            console.error('Error adding travel record:', error);
            throw error;
        }
    },

    async getUserTravelHistory(userId: string): Promise<TravelRecord[]> {
        try {
            const q = query(
                collection(db, 'travelRecords'),
                where('userId', '==', userId),
                orderBy('date', 'desc')
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => doc.data() as TravelRecord);
        } catch (error) {
            console.error('Error getting travel history:', error);
            throw error;
        }
    }
};
