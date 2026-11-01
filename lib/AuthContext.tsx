import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithPopup, signOut as fbSignOut } from 'firebase/auth';
import { auth, googleProvider, testConnection, DEFAULT_ADMIN_EMAIL } from './firebase';
import { subscribeAdminEmails } from './firestoreService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  adminEmails: string[];
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAdmin: false,
  adminEmails: [DEFAULT_ADMIN_EMAIL],
  signInWithGoogle: async () => {},
  signOut: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [adminEmails, setAdminEmails] = useState<string[]>([DEFAULT_ADMIN_EMAIL, 'tayebkjl@gmail.com']);

  useEffect(() => {
    // Validate connection once
    testConnection();

    // Listen to admin emails
    const unsubAdmins = subscribeAdminEmails((emails) => {
      setAdminEmails(emails);
    });

    // Listen to Auth state
    const unsubAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => {
      unsubAdmins();
      unsubAuth();
    };
  }, []);

  const isAdmin = Boolean(
    user?.email &&
      (user.email.toLowerCase() === DEFAULT_ADMIN_EMAIL.toLowerCase() ||
        adminEmails.some((e) => e.toLowerCase() === user.email?.toLowerCase()))
  );

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      if (err.code !== 'auth/popup-closed-by-user') {
        console.error('Google Sign In Error:', err);
        alert('গুগল লগইনে সমস্যা হয়েছে: ' + (err.message || 'Error'));
      }
    }
  };

  const signOut = async () => {
    try {
      await fbSignOut(auth);
    } catch (err) {
      console.error('Sign Out Error:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin,
        adminEmails,
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
