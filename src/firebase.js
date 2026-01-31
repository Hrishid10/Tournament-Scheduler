import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAblwpeag0HmTzUs6_rH50gPI8hzgKfi-o",
  authDomain: "tournament-scheduler-ae304.firebaseapp.com",
  projectId: "tournament-scheduler-ae304",
  storageBucket: "tournament-scheduler-ae304.firebasestorage.app",
  messagingSenderId: "726701677152",
  appId: "1:726701677152:web:a522ae72bb87a66fd14105",
  measurementId: "G-T1202784KF"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);