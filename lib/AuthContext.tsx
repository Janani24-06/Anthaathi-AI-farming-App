import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

interface UserProfile {
  uid: string;
  name: string;
  phone: string;
  language: string;
  location: string;
  createdAt?: string;
}

interface AuthContextValue {
  user: UserProfile | null;
  firebaseUser: User | null;
  isLoading: boolean;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  logout: () => Promise<void>;
  setUserProfile: (profile: UserProfile) => void;
  bypassLogin: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fUser) => {
      setFirebaseUser(fUser);
      if (fUser) {
        // Fetch profile from Firestore
        const docRef = doc(db, 'users', fUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUser(docSnap.data() as UserProfile);
        } else {
          // Create basic profile if it doesn't exist
          const basicProfile: UserProfile = {
            uid: fUser.uid,
            name: '',
            phone: fUser.phoneNumber || '',
            language: 'en',
            location: '',
            createdAt: new Date().toISOString(),
          };
          await setDoc(docRef, basicProfile);
          setUser(basicProfile);
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!firebaseUser || !user) return;
    const updated = { ...user, ...data };
    const docRef = doc(db, 'users', firebaseUser.uid);
    await updateDoc(docRef, data);
    setUser(updated);
  };

  const logout = async () => {
    await auth.signOut();
  };

  const setUserProfile = (profile: UserProfile) => {
    setUser(profile);
  };

  const bypassLogin = () => {
    const demoProfile: UserProfile = {
      uid: 'demo_user',
      name: 'Demo Farmer',
      phone: '+91 99999 99999',
      language: 'en',
      location: 'Demo Farm, Madurai',
      createdAt: new Date().toISOString(),
    };
    setUser(demoProfile);
    setIsLoading(false);
  };

  const value = useMemo(() => ({
    user,
    firebaseUser,
    isLoading,
    updateProfile,
    logout,
    setUserProfile,
    bypassLogin
  }), [user, firebaseUser, isLoading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
