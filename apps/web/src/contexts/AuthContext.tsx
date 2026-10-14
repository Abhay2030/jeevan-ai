"use client";

/**
 * JEEVAN AI — Authentication Context (Firebase Auth + Cloud Firestore)
 *
 * Provides global state for the authenticated user, role-based metadata,
 * session persistence, profile synchronization, and security lifecycle methods.
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  onAuthStateChanged,
  type User as FirebaseUser
} from "firebase/auth";
import type { User, LoginCredentials, UserRole } from "@jeevan-ai/types";
import {
  auth,
  getUserProfile,
  syncUserProfile,
  formatAuthError
} from "../lib/firebase";

export interface RegisterPayload {
  email: string;
  password: string;
  fullName: string;
  role?: UserRole;
  phoneNumber?: string;
}

export interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Sync profile from Firestore or provision if first-time sign in
  const syncCurrentUser = useCallback(async (fbUser: FirebaseUser | null) => {
    if (!fbUser) {
      setUser(null);
      setFirebaseUser(null);
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
      }
      setIsLoading(false);
      return;
    }

    try {
      setFirebaseUser(fbUser);
      // Retrieve ID token for API authorization header compatibility
      const token = await fbUser.getIdToken();
      if (typeof window !== "undefined") {
        localStorage.setItem("access_token", token);
      }

      // Fetch or initialize user profile in Firestore
      const profile = await syncUserProfile(
        fbUser.uid,
        fbUser.email || "",
        fbUser.displayName
      );

      setUser(profile);
    } catch (error) {
      console.error("Failed to sync user profile with Firestore:", error);
      // Fallback user object if Firestore read times out or is offline
      if (fbUser.email) {
        setUser({
          id: fbUser.uid,
          email: fbUser.email,
          full_name: fbUser.displayName || fbUser.email.split("@")[0],
          role: "PUBLIC",
          is_active: true,
          created_at: new Date().toISOString()
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Listen to Firebase Authentication state transitions
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      await syncCurrentUser(fbUser);
    });

    return () => unsubscribe();
  }, [syncCurrentUser]);

  // Login handler
  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        credentials.email.trim(),
        credentials.password
      );

      // Force refresh token and profile sync
      const token = await userCredential.user.getIdToken(true);
      if (typeof window !== "undefined") {
        localStorage.setItem("access_token", token);
      }

      const profile = await syncUserProfile(
        userCredential.user.uid,
        userCredential.user.email || credentials.email,
        userCredential.user.displayName
      );

      setUser(profile);
      setFirebaseUser(userCredential.user);
    } catch (error) {
      const errorMsg = formatAuthError(error);
      throw new Error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // Registration handler
  const register = async (payload: RegisterPayload) => {
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        payload.email.trim(),
        payload.password
      );

      // Update Firebase Auth display name
      if (payload.fullName) {
        await updateProfile(userCredential.user, {
          displayName: payload.fullName
        });
      }

      // Persist profile to Firestore with chosen role
      const profile = await syncUserProfile(
        userCredential.user.uid,
        payload.email.trim(),
        payload.fullName,
        {
          full_name: payload.fullName,
          role: payload.role || "PUBLIC",
          phone_number: payload.phoneNumber
        }
      );

      // Send verification email in the background
      try {
        await sendEmailVerification(userCredential.user);
      } catch (e) {
        console.warn("Email verification could not be dispatched:", e);
      }

      const token = await userCredential.user.getIdToken();
      if (typeof window !== "undefined") {
        localStorage.setItem("access_token", token);
      }

      setUser(profile);
      setFirebaseUser(userCredential.user);
    } catch (error) {
      const errorMsg = formatAuthError(error);
      throw new Error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // Logout handler
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn("Sign out error:", e);
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
      }
      setUser(null);
      setFirebaseUser(null);
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
  };

  // Password reset handler
  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email.trim());
    } catch (error) {
      const errorMsg = formatAuthError(error);
      throw new Error(errorMsg);
    }
  };

  // Re-send verification email
  const sendVerification = async () => {
    if (!auth.currentUser) throw new Error("No authenticated user found.");
    try {
      await sendEmailVerification(auth.currentUser);
    } catch (error) {
      const errorMsg = formatAuthError(error);
      throw new Error(errorMsg);
    }
  };

  // Manual profile refresh
  const refreshProfile = async () => {
    if (!auth.currentUser) return;
    const profile = await getUserProfile(auth.currentUser.uid);
    if (profile) setUser(profile);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        isLoading,
        login,
        register,
        logout,
        resetPassword,
        sendVerificationEmail: sendVerification,
        refreshProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
