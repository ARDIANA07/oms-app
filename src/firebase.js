import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB2D5m6cGtudcg2Fiu6PttxsXxyA_C5heo",
  authDomain: "oms-app-e6002.firebaseapp.com",
  projectId: "oms-app-e6002",
  storageBucket: "oms-app-e6002.firebasestorage.app",
  messagingSenderId: "217434848994",
  appId: "1:217434848994:web:0ef5eb36fd74c5830e28bb",
  measurementId: "G-Z65SB1QJJS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };