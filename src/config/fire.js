const firebase = require('firebase/app');
var firebaseConfig = {
  apiKey: "AIzaSyC_-IuxE-8EmpOYPfcLhCrsMldsYx4ENnM",
    authDomain: "test-3ed77.firebaseapp.com",
    databaseURL: "https://test-3ed77.firebaseio.com",
    projectId: "test-3ed77",
    storageBucket: "test-3ed77.appspot.com",
    messagingSenderId: "547377359506",
    appId: "1:547377359506:web:dacd7f8266173ba4ab944b",
    measurementId: "G-C229LDRLP7"
};
// Initialize Firebase

const fire = firebase.initializeApp(firebaseConfig);

export {
  fire  as default
}