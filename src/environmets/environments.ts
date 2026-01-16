// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// Firebase configuration (example only)
export const firebaseConfig = {
    apiKey: "[GCP_API_KEY]",
    authDomain: "[GCP_AUTH_DOMAIN]",
    projectId: "[GCP_PROJECT_ID]",
    storageBucket: "[GCP_STORAGE_BUCKET]",
    messagingSenderId: "[GCP_MESSAGE_SENDER]",
    appId: "[GCP_APP_ID]"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
