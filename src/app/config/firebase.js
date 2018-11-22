import firebase from "firebase"
import "firebase/firestore"
import { firebaseApiKey, messagingSenderId } from "../config/keys"

const firebaseConfig = {
  apiKey: firebaseApiKey,
  authDomain: "revents-1542681296646.firebaseapp.com",
  databaseURL: "https://revents-1542681296646.firebaseio.com",
  projectId: "revents-1542681296646",
  storageBucket: "revents-1542681296646.appspot.com",
  messagingSenderId: messagingSenderId
}

firebase.initializeApp(firebaseConfig)

export default firebase
