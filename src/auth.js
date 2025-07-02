import { getAuth, onAuthStateChanged } from "firebase/auth";

const auth = getAuth();

export function waitForAuth() {
    return new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            unsubscribe(); 
            resolve(user);
        });
    });
}