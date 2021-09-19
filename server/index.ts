import * as express from "express";
import { firestore, rtdb } from "./database";
import * as nanoid from "nanoid";
import * as token from "rand-token";

// Init express app
const app = express();
const port = process.env.PORT || 4000;

// Use
app.use(express.json());

// Coll references
const usersColRef = firestore.collection("users");
const roomsColRef = firestore.collection("rooms");

// Get users
app.get("/users/:userId", (req, res) => {
  const userId = req.params.userId;
  usersColRef
    .doc(userId)
    .get()
    .then((snap) => {
      const data = snap.data();
      res.json({
        nombre: data.nombre,
      });
    });
});

// Post users
app.post("/users", (req, res) => {
  const username = req.body.username;
  // Primero se fija si existe un usuario con el mismo nombre
  usersColRef
    .where("username", "==", username)
    .get()
    .then((snap) => {
      if (snap.empty) {
        // si no existe, crea uno nuevo y devuelve el ID generado
        usersColRef
          .add({
            username: username,
          })
          .then((data) => {
            res.json({
              id: data.id,
            });
          });
      } else {
        // si existe, devuelve el ID existente
        res.json({
          id: snap.docs[0].id,
        });
      }
    });
});

// Post new room
app.post("/rooms", (req, res) => {
  const userId = req.body.userId;
  const username = req.body.username;
  const roomToken = token.generate(6);
  const roomId = nanoid.nanoid();

  roomsColRef
    .doc(roomToken)
    .set({
      roomId,
    })
    .then((r) => {
      const roomsRef = rtdb.ref("/rooms/" + roomId + "/users/owner");
      roomsRef
        .set({
          userId: userId,
          isConnected: true,
          wins: 0,
          currentMove: "",
          name: username,
          isReady: false,
        })
        .then(() => {
          res.json({
            roomId,
            roomToken,
          });
        });
    });
});

// Get room by token
app.get("/rooms/:roomToken", (req, res) => {
  const roomToken = req.params.roomToken;
  roomsColRef
    .doc(roomToken)
    .get()
    .then((r) => {
      if (!r.data()) {
        res.status(404).json("No existe ese room");
      } else {
        res.json(r.data());
      }
    });
});

// Serve client
app.use("/", express.static(__dirname + "/dist"));

app.get("/*", (req, res) => {
  res.sendFile(__dirname + "/dist/index.html");
});

// Express app lisen
app.listen(port, () => {
  console.log("App listening at http://localhost:" + port);
});
