// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC57t3NaO_MYwIYwk3bhXxXVC0FFjjw9jE",
  authDomain: "foryou-a6f4d.firebaseapp.com",
  projectId: "foryou-a6f4d",
  storageBucket: "foryou-a6f4d.appspot.com",
  messagingSenderId: "1022771984467",
  appId: "1:1022771984467:web:a9ed97cee53b4116e6aea6",
  measurementId: "G-B3DS4S1KW5",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage, auth };
