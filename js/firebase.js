// Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCTMlS9-mstxijR5CRnj9DIAARvscRTT_M",
    authDomain: "agreement-hub-e1bd1.firebaseapp.com",
    projectId: "agreement-hub-e1bd1",
    storageBucket: "agreement-hub-e1bd1.firebasestorage.app",
    messagingSenderId: "28620421891",
    appId: "1:28620421891:web:c861b74d6095426988c736"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
