// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "cloud-mern-estate.firebaseapp.com",
  projectId: "cloud-mern-estate",
  storageBucket: "cloud-mern-estate.appspot.com",
  messagingSenderId: "318886588664",
  appId: "1:318886588664:web:7bfa729a57d555a3ff4b0d",
  measurementId: "G-4YGGY9VGHZ"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);