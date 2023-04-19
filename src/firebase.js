// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCBh-wAY04Rndu96KU1Ekgv4mHcOMgPENI",
  authDomain: "notes-backend-6a64f.firebaseapp.com",
  projectId: "notes-backend-6a64f",
  storageBucket: "notes-backend-6a64f.appspot.com",
  messagingSenderId: "671238228974",
  appId: "1:671238228974:web:7f5e8b02f5194441b05cff",
  measurementId: "G-C9V2G779FT"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);