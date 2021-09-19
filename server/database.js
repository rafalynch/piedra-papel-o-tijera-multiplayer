"use strict";
exports.__esModule = true;
exports.rtdb = exports.firestore = void 0;
var admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://piedra-papel-tijera-8e043-default-rtdb.firebaseio.com/"
});
exports.firestore = admin.firestore();
exports.rtdb = admin.database();
