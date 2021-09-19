"use strict";
exports.__esModule = true;
exports.rtdb = void 0;
var app_1 = require("firebase/app");
var app = app_1["default"].initializeApp({
    apiKey: "cBeWTX1lCrAmOYilMosEkO7n3QhGnwQSipbCFXNZ",
    databaseURL: "https://piedra-papel-tijera-8e043-default-rtdb.firebaseio.com/",
    authDomain: "piedra-papel-tijera-8e043-default-rtdb.firebaseio.com"
});
var rtdb = app_1["default"].database();
exports.rtdb = rtdb;
