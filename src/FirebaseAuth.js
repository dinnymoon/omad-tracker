import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyANXSU5GoaP5XQpTr9-w82dBRqIAs3x1jM",
  authDomain: "omad-tracker-8d6f2.firebaseapp.com",
  projectId: "omad-tracker-8d6f2",
  storageBucket: "omad-tracker-8d6f2.firebasestorage.app",
  messagingSenderId: "826531506231",
  appId: "1:826531506231:web:2be9579b9b4ed1280ab7b2",
  measurementId: "G-YQH5M9B47K"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export default function FirebaseAuth() {
  const [user, setUser] = useState(null);

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setUser(user);
      else setUser(null);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      {user ? (
        <>
          <p>Xin chào, {user.displayName}</p>
          <button onClick={handleLogout}>Đăng xuất</button>
        </>
      ) : (
        <button onClick={handleLogin}>Đăng nhập bằng Google</button>
      )}
    </div>
  );
}
