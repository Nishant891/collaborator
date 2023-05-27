// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, signInWithPopup, GithubAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBpNXYEZj0_R_VBiUc8jtQaAFvXGSjGuUQ",
  authDomain: "collaborator-398be.firebaseapp.com",
  projectId: "collaborator-398be",
  storageBucket: "collaborator-398be.appspot.com",
  messagingSenderId: "429669548026",
  appId: "1:429669548026:web:2fc34f54347a009c966e43",
  measurementId: "G-D3G08Z1YHD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);

const provider = new GithubAuthProvider();

export const signInWithGitHub = () => {

  signInWithPopup(auth, provider)
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.log(error);
  })

}

export const db = getFirestore(app);