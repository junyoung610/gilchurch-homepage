import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCr_EQzXssO2BeXcFl9_NZeagD7pGKSBX0",
  authDomain: "gilchurch-homepage.firebaseapp.com",
  projectId: "gilchurch-homepage",
  storageBucket: "gilchurch-homepage.firebasestorage.app",
  messagingSenderId: "697268674222",
  appId: "1:697268674222:web:cc42c6566320d3cfe0973f",
  measurementId: "G-9377837JQM",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
