"use strict";
exports.__esModule = true;
var express = require("express");
var database_1 = require("./database");
var nanoid = require("nanoid");
var token = require("rand-token");
// Init express app
var app = express();
var port = process.env.PORT || 4000;
// Use
app.use(express.json());
// Coll references
var usersColRef = database_1.firestore.collection("users");
var roomsColRef = database_1.firestore.collection("rooms");
// Get users
app.get("/users/:userId", function (req, res) {
    var userId = req.params.userId;
    usersColRef
        .doc(userId)
        .get()
        .then(function (snap) {
        var data = snap.data();
        res.json({
            nombre: data.nombre
        });
    });
});
// Post users
app.post("/users", function (req, res) {
    var username = req.body.username;
    // Primero se fija si existe un usuario con el mismo nombre
    usersColRef
        .where("username", "==", username)
        .get()
        .then(function (snap) {
        if (snap.empty) {
            // si no existe, crea uno nuevo y devuelve el ID generado
            usersColRef
                .add({
                username: username
            })
                .then(function (data) {
                res.json({
                    id: data.id
                });
            });
        }
        else {
            // si existe, devuelve el ID existente
            res.json({
                id: snap.docs[0].id
            });
        }
    });
});
// Post new room
app.post("/rooms", function (req, res) {
    var userId = req.body.userId;
    var username = req.body.username;
    var roomToken = token.generate(6);
    var roomId = nanoid.nanoid();
    roomsColRef
        .doc(roomToken)
        .set({
        roomId: roomId
    })
        .then(function (r) {
        var roomsRef = database_1.rtdb.ref("/rooms/" + roomId + "/users/owner");
        roomsRef
            .set({
            userId: userId,
            isConnected: true,
            wins: 0,
            currentMove: "",
            name: username,
            isReady: false
        })
            .then(function () {
            res.json({
                roomId: roomId,
                roomToken: roomToken
            });
        });
    });
});
// Get room by token
app.get("/rooms/:roomToken", function (req, res) {
    var roomToken = req.params.roomToken;
    roomsColRef
        .doc(roomToken)
        .get()
        .then(function (r) {
        if (!r.data()) {
            res.status(404).json("No existe ese room");
        }
        else {
            res.json(r.data());
        }
    });
});
// Serve client
app.use("/", express.static(__dirname + "/dist"));
app.get("/*", function (req, res) {
    res.sendFile(__dirname + "/dist/index.html");
});
// Express app lisen
app.listen(port, function () {
    console.log("App listening at http://localhost:" + port);
});
