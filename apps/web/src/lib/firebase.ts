/**
 * JEEVAN AI — Firebase Client & Firestore Engine
 *
 * Configures Firebase Authentication and Cloud Firestore for the
 * national emergency operations platform.
 */

import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  type Auth,
  browserLocalPersistence,
  setPersistence
} from "firebase/auth";
import {
  getFirestore,
  type Firestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
  Timestamp
} from "firebase/firestore";
import type { User, UserRole } from "@jeevan-ai/types";

// Firebase web configuration (using environment variables with verified fallback)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyD06qixYK6qhxwwizZeyGBe5qXhVcwwa1g",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "jeevanai-598e7.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "jeevanai-598e7",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "jeevanai-598e7.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "702350817486",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:702350817486:web:904dcf1655d96066fdf89f",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-QFVCFYX4TN"
};

// Singleton pattern for Firebase initialization
export const app: FirebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);

// Enforce browser local session persistence when running in client environment
if (typeof window !== "undefined") {
  setPersistence(auth, browserLocalPersistence).catch((err) => {
    console.warn("Failed to set Firebase Auth persistence to browserLocalPersistence:", err);
  });
}

/**
 * Maps existing and demo email IDs to their designated system role
 * without overwriting custom promotions.
 */
export function mapRoleFromEmail(email: string): UserRole {
  const normalized = email.toLowerCase().trim();
  if (normalized.startsWith("admin") || normalized.includes("admin@")) {
    return "ADMIN";
  }
  if (
    normalized.startsWith("command") ||
    normalized.startsWith("operator") ||
    normalized.startsWith("ops") ||
    normalized.includes("command@") ||
    normalized.includes("operator@")
  ) {
    return "COMMAND";
  }
  if (
    normalized.startsWith("responder") ||
    normalized.startsWith("ambulance") ||
    normalized.startsWith("emt") ||
    normalized.includes("responder@") ||
    normalized.includes("ambulance@")
  ) {
    return "RESPONDER";
  }
  return "PUBLIC";
}

/**
 * Fetches user profile record from Firestore `users/{uid}`
 */
export async function getUserProfile(uid: string): Promise<User | null> {
  try {
    const userRef = doc(db, "users", uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) return null;

    const data = snap.data();
    return {
      id: uid,
      email: data.email || "",
      full_name: data.full_name || "",
      role: (data.role as UserRole) || "PUBLIC",
      is_active: data.is_active !== undefined ? Boolean(data.is_active) : true,
      phone_number: data.phone_number || undefined,
      created_at: data.created_at instanceof Timestamp
        ? data.created_at.toDate().toISOString()
        : data.created_at || new Date().toISOString(),
    };
  } catch (error) {
    console.error(`Error reading Firestore profile for ${uid}:`, error);
    return null;
  }
}

/**
 * Syncs and provisions a user profile in Firestore `users/{uid}`
 * upon sign in or registration, preventing duplicate documents.
 */
export async function syncUserProfile(
  uid: string,
  email: string,
  displayName?: string | null,
  providedData?: Partial<User>
): Promise<User> {
  const userRef = doc(db, "users", uid);
  const snap = await getDoc(userRef);

  if (snap.exists()) {
    // Existing user: update last login and return current profile
    const existing = snap.data();
    try {
      await updateDoc(userRef, {
        last_login_at: serverTimestamp()
      });
    } catch (e) {
      // Non-blocking if offline
      console.warn("Could not update last_login_at:", e);
    }

    return {
      id: uid,
      email: existing.email || email,
      full_name: existing.full_name || displayName || email.split("@")[0],
      role: (existing.role as UserRole) || "PUBLIC",
      is_active: existing.is_active !== undefined ? Boolean(existing.is_active) : true,
      phone_number: existing.phone_number || undefined,
      created_at: existing.created_at instanceof Timestamp
        ? existing.created_at.toDate().toISOString()
        : existing.created_at || new Date().toISOString(),
    };
  }

  // New User initialization
  const assignedRole: UserRole = providedData?.role || mapRoleFromEmail(email);
  const fullName = providedData?.full_name || displayName || email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const newUserData = {
    uid,
    email: email.toLowerCase().trim(),
    full_name: fullName,
    role: assignedRole,
    is_active: true,
    phone_number: providedData?.phone_number || "",
    created_at: serverTimestamp(),
    last_login_at: serverTimestamp(),
    platform: "JEEVAN_AI_NATIONAL"
  };

  await setDoc(userRef, newUserData);

  return {
    id: uid,
    email: newUserData.email,
    full_name: newUserData.full_name,
    role: assignedRole,
    is_active: true,
    phone_number: newUserData.phone_number || undefined,
    created_at: new Date().toISOString()
  };
}

/**
 * Updates a user's role in Firestore (admin functionality)
 */
export async function updateUserRole(uid: string, role: UserRole): Promise<void> {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, {
    role,
    updated_at: serverTimestamp()
  });
}

/**
 * Updates account active status (activation / deactivation)
 */
export async function updateUserStatus(uid: string, isActive: boolean): Promise<void> {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, {
    is_active: isActive,
    updated_at: serverTimestamp()
  });
}

/**
 * Retrieves all registered user accounts from Firestore for Admin oversight
 */
export async function getAllUsers(): Promise<User[]> {
  try {
    const usersCol = collection(db, "users");
    const q = query(usersCol, orderBy("created_at", "desc"));
    const snap = await getDocs(q);

    return snap.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        email: data.email || "",
        full_name: data.full_name || "",
        role: (data.role as UserRole) || "PUBLIC",
        is_active: data.is_active !== undefined ? Boolean(data.is_active) : true,
        phone_number: data.phone_number || undefined,
        created_at: data.created_at instanceof Timestamp
          ? data.created_at.toDate().toISOString()
          : data.created_at || new Date().toISOString()
      };
    });
  } catch (err) {
    console.error("Error fetching all users:", err);
    return [];
  }
}

/**
 * Translates Firebase Auth error codes into safe, helpful, user-friendly messages
 */
export function formatAuthError(error: unknown): string {
  if (typeof error === "object" && error !== null && "code" in error) {
    const code = String((error as { code: string }).code);
    switch (code) {
      case "auth/invalid-credential":
      case "auth/wrong-password":
      case "auth/user-not-found":
        return "Invalid email address or password. Please verify and try again.";
      case "auth/email-already-in-use":
        return "An account with this email address already exists. Please sign in or reset your password.";
      case "auth/weak-password":
        return "Password must be at least 6 characters long.";
      case "auth/invalid-email":
        return "Please enter a valid email address.";
      case "auth/user-disabled":
        return "This account has been deactivated. Please contact the Command Centre Administrator.";
      case "auth/too-many-requests":
        return "Too many failed attempts. Access has been temporarily throttled for security. Please try again shortly.";
      case "auth/network-request-failed":
        return "Network connection error. Please check your internet connectivity.";
      case "auth/popup-closed-by-user":
        return "Authentication popup was closed before completing.";
      case "auth/requires-recent-login":
        return "This action requires recent authentication. Please sign in again.";
      default:
        return (error as { message?: string }).message || "Authentication failed. Please try again.";
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred during authentication.";
}
