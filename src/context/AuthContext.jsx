import { createContext, useContext, useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";

// Tu configuración de Firebase (mantenla como la tienes)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const tokenValue = await u.getIdToken();
        setToken(tokenValue);
        // ✅ CRUCIAL: Guardar en el navegador
        localStorage.setItem("token", tokenValue);
      } else {
        setToken(null);
        localStorage.removeItem("token");
      }
    });
    return () => unsub();
  }, []);

  async function login() {
    try {
      const result = await signInWithPopup(auth, provider);
      const tokenValue = await result.user.getIdToken();
      setToken(tokenValue);
      localStorage.setItem("token", tokenValue);
    } catch (error) {
      console.error("Error en login:", error);
    }
  }

  async function logout() {
    await signOut(auth);
    setToken(null);
    localStorage.removeItem("token");
  }

  return (
    <AuthCtx.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);