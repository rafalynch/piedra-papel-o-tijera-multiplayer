import firebase from "firebase";

const app = firebase.initializeApp({
  apiKey: "cBeWTX1lCrAmOYilMosEkO7n3QhGnwQSipbCFXNZ",
  databaseURL: "https://piedra-papel-tijera-8e043-default-rtdb.firebaseio.com/",
  authDomain: "piedra-papel-tijera-8e043-default-rtdb.firebaseio.com",
});

const rtdb = firebase.database();

export { rtdb };
