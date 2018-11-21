import firebase from "firebase"

const firebaseConfig = {
  apiKey: "AIzaSyApYR0Kp50TTRFtF0wCpRUF48b-BhbFaPI",
  authDomain: "revents-1542681296646.firebaseapp.com",
  databaseURL: "https://revents-1542681296646.firebaseio.com",
  projectId: "revents-1542681296646",
  storageBucket: "revents-1542681296646.appspot.com",
  messagingSenderId: "58774534961"
}

firebase.initializeApp(firebaseConfig)

export default firebase
