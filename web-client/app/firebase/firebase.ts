// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth, 
        signInWithPopup, 
        GoogleAuthProvider,
        onAuthStateChanged,
        User
        } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDuJNohEd032QdysCQDrhZPPF3zecTHVE8",
  authDomain: "video-processing-service-98c4e.firebaseapp.com",
  projectId: "video-processing-service-98c4e",
  appId: "1:182211578681:web:fdbc965429930b01aab6e8",
  measurementId: "G-X4C3LK8DX8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export function signInWithGoogle() {
    return signInWithPopup(auth, new GoogleAuthProvider());
}

export function signOut() {
    return auth.signOut();
}

export function onAuthStateChangedHelper(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
}

const analytics = getAnalytics(app);