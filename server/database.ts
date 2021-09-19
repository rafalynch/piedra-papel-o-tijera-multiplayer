import * as admin from "firebase-admin";

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://piedra-papel-tijera-8e043-default-rtdb.firebaseio.com/",
});

export const firestore = admin.firestore();
export const rtdb = admin.database();
