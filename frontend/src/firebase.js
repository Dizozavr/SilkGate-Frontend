import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAxLet6oANDuCXwnHOsTX8GcHbsz_s-EI",
  authDomain: "silkgate-1560b.firebaseapp.com",
  projectId: "silkgate-1560b",
  storageBucket: "silkgate-1560b.appspot.com",
  messagingSenderId: "671697233226",
  appId: "1:671697233226:web:cd749f232a2c6ef5bb4db3"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider(); 