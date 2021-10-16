import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyB8vySBzyh7f64I1EL2fvqjwk3OT-5oeko",
  authDomain: "augeo-dashboard.firebaseapp.com",
  projectId: "augeo-dashboard",
  storageBucket: "augeo-dashboard.appspot.com",
  messagingSenderId: "323008754336",
  appId: "1:323008754336:web:5eb1cfe12d9d019a9bcfc5",
  measurementId: "G-H757HR5R0W"
}); 
const auth=firebase.auth();
const storage=firebase.storage();
const db=firebase.firestore();
const provider = new firebase.auth.GoogleAuthProvider();
export {db,auth,storage,provider}; 
