import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, signInWithPopup, signOut as firebaseSignOut, onIdTokenChanged } from 'firebase/auth';
import { auth, googleAuthProvider } from '../lib/firebase.ts';

export interface DbUser {
  id: number;
  uid: string;
  email: string;
  displayName: string | null;
  role: 'agriculteur' | 'conseiller' | 'cooperative';
  phone: string | null;
  region: string | null;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  dbUser: DbUser | null;
  token: string | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
  refreshDbUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  dbUser: null,
  token: null,
  loading: true,
  signInWithGoogle: async () => {},
  signOutUser: async () => {},
  refreshDbUser: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [dbUser, setDbUser] = useState<DbUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const syncWithBackend = async (idToken: string) => {
    try {
      const res = await fetch('/api/auth/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setDbUser(data.user);
      }
    } catch (err) {
      console.error('Erreur synchronisation profil utilisateur PostgreSQL:', err);
    }
  };

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const idToken = await currentUser.getIdToken();
          setToken(idToken);
          await syncWithBackend(idToken);
        } catch (error) {
          console.error('Erreur récupération token:', error);
        }
      } else {
        setToken(null);
        setDbUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      const idToken = await result.user.getIdToken();
      setToken(idToken);
      await syncWithBackend(idToken);
    } catch (error: any) {
      console.error('Erreur connexion Google:', error);
      throw error;
    }
  };

  const signOutUser = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setDbUser(null);
      setToken(null);
    } catch (error) {
      console.error('Erreur déconnexion:', error);
    }
  };

  const refreshDbUser = async () => {
    if (token) {
      await syncWithBackend(token);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        dbUser,
        token,
        loading,
        signInWithGoogle,
        signOutUser,
        refreshDbUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
