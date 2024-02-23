// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBDXiWeDObeUjWDZeArYoIXztgPicAeYKs",
  authDomain: "cpt1-43f9f.firebaseapp.com",
  projectId: "cpt1-43f9f",
  storageBucket: "cpt1-43f9f.appspot.com",
  messagingSenderId: "605616662853",
  appId: "1:605616662853:web:e55e93fccf3924da63f62c",
  measurementId: "G-RCVJNYNQKW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);