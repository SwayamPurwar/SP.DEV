// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyATppLOUR9WPrsFGZhRrB3AvL-hw1E0Ovk",
  authDomain: "sp-dev-46cee.firebaseapp.com",
  databaseURL: "https://sp-dev-46cee-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "sp-dev-46cee",
  storageBucket: "sp-dev-46cee.firebasestorage.app",
  messagingSenderId: "391106606926",
  appId: "1:391106606926:web:da5fa998a7c60aca0c101f",
  measurementId: "G-Y4Y5KHHE2L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getDatabase(app);