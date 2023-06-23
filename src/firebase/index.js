
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth';
import { getDatabase } from "firebase/database";
/* const firebaseConfig = {
  apiKey: "AIzaSyC0X3Ri6sqaoSeZ8fOAcSODidZDG6T61Ko",
  authDomain: "socialapp-ecdb8.firebaseapp.com",
  databaseURL: "https://socialapp-ecdb8-default-rtdb.firebaseio.com",
  projectId: "socialapp-ecdb8",
  storageBucket: "socialapp-ecdb8.appspot.com",
  messagingSenderId: "152268020517",
  appId: "1:152268020517:web:9304b6c9b443916c6fd8cc"
}; */
const firebaseConfig = {
  apiKey: "AIzaSyCgimYl-R2FjNGoebDFakmJYdaKMnReXbI",
  authDomain: "vueapp-da3c1.firebaseapp.com",
  databaseURL: "https://vueapp-da3c1-default-rtdb.firebaseio.com",
  projectId: "vueapp-da3c1",
  storageBucket: "vueapp-da3c1.appspot.com",
  messagingSenderId: "1087352253173",
  appId: "1:1087352253173:web:6f148b68e126d17dd133bc"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
const database = getDatabase(app);
const auth = getAuth(app);
export {
  db,
  database,
  auth,
}
