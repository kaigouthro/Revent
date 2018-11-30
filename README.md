# Revents

App built with React, Redux & Firestore to create meetup events.

## Firebase setup

- You need to set up a project in firebase & in Google for this repo to function properly. Use the Google API key & Firebase config object from respective developer consoles & create file `./src/app/config/firebase.js`.

// Firebase configuration from dev console

```javascript
module.exports = {
  firebaseConfig: {
    apiKey: "....",
    authDomain: "....",
    databaseURL: "....",
    projectId: "....",
    storageBucket: "....",
    messagingSenderId: "...."
  }
```
