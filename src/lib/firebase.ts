import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { Firestore, getFirestore, initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "***REMOVED_FIREBASE_API_KEY***",
  authDomain: "isic-2024.firebaseapp.com",
  projectId: "isic-2024",
  storageBucket: "isic-2024.firebasestorage.app",
  messagingSenderId: "517220804621",
  appId: "1:517220804621:web:ddc33641e52d40fe850d44",
  measurementId: "G-JLTW5ZJ3T4"
};

// Initialize Firebase only if it hasn't been initialized already
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

let db: Firestore;
try {
  // Enable offline persistence so history loads instantly across sessions
  db = initializeFirestore(app, {
    localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() })
  });
} catch (_) {
  // Fallback if already initialized (e.g., during Next.js Fast Refresh)
  db = getFirestore(app);
}

const googleProvider = new GoogleAuthProvider();

export { app, auth, db, googleProvider };
