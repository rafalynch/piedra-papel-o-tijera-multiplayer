import { rtdb } from "./rtdb";

const API_BASE_URL = "http://localhost:4000";

export const state = {
  data: {
    currentSession: {
      username: "",
      userId: "",
    },
    currentGame: {
      roomId: "",
      roomToken: "",
      ties: 0,
      users: {
        owner: {
          currentMove: "",
          //isConnected: false,
          waiting: false,
          name: "Owner",
          userId: "",
          wins: 0,
        },
        guest: {
          currentMove: "",
          //isConnected: false,
          waiting: false,
          name: "Guest",
          userId: "",
          wins: 0,
        },
      },
    },
  },
  listeners: [],
  init() {},
  subscribe(cb) {
    this.listeners.push(cb);
  },
  resetSubs() {
    this.listeners.length = 0;
  },
  getState() {
    return this.data;
  },
  setState(newState) {
    this.data = newState;
    for (const cb of this.listeners) {
      cb(newState);
    }
    // console.log("Nuevo state:");
    // console.log(newState);
  },
  serverListener() {
    const currentState = this.getState();
    const roomRef = rtdb.ref("/rooms/" + currentState.currentGame.roomId);

    roomRef.on("value", (snapshot) => {
      const roomFromServer = snapshot.val();
      currentState.currentGame.users = roomFromServer.users;
      currentState.currentGame.ties = roomFromServer.ties;
      this.setState(currentState);
    });
  },
  logIn(username, cb: () => void) {
    // Hace un post a users. Crea un usuario en firestore y devuelve su ID.
    // Si ya existe un usuario con el mismo nombre devuelve el ID.
    // Luego lo guarda en el state.
    const loginUsername = username;
    const currentState = this.getState();
    fetch(API_BASE_URL + "/users", {
      headers: {
        "content-type": "application/json",
      },
      method: "post",
      body: JSON.stringify({
        username: loginUsername,
      }),
    }).then((res) => {
      res.json().then((data) => {
        currentState.currentSession.userId = data.id;
        currentState.currentSession.username = loginUsername;
        this.setState(currentState);
        cb();
      });
    });
  },
  setNewRoom(userId, username, cb: () => void) {
    // A partir de un userId hace un post a rooms.
    // Eso devuelve un roomId y un roomToken que se guardan en el state.
    fetch(API_BASE_URL + "/rooms", {
      headers: {
        "content-type": "application/json",
      },
      method: "post",
      body: JSON.stringify({
        userId,
        username,
      }),
    }).then((res) => {
      res.json().then((data) => {
        const currentState = this.getState();

        rtdb
          .ref("/rooms/" + data.roomId)
          .get()
          .then((snap) => {
            const roomData = snap.val();
            currentState.currentGame.users = {
              owner: roomData.users.owner,
            };
          });

        currentState.currentGame.roomId = data.roomId;
        currentState.currentGame.roomToken = data.roomToken;
        //currentState.currentGame.users.owner.isConnected = true;
        this.setState(currentState);
        cb();
      });
    });
  },
  setExistingRoom(roomToken, cb: (res) => void) {
    const currentState = this.getState();
    // A partir de un token hace un get a rooms.
    // Si existe un room asociado a ese token, devuelve el roomId y se guarda en el state.
    // Si no existe devuelve 404 y se ejecuta el cb con el error.
    fetch(API_BASE_URL + "/rooms/" + roomToken).then((res) => {
      // Si se encuentra un room asociado al token.
      if (res.ok) {
        res.json().then((data) => {
          // Buscar en la rtdb el estado del room.
          rtdb
            .ref("/rooms/" + data.roomId)
            .get()
            .then((snap) => {
              const roomData = snap.val();
              // Si el usuario no coincide con el owner y ya existe un guest y no coincide con el usuario
              // se evita el ingreso por sala llena.
              if (
                roomData.users.owner.userId !=
                  currentState.currentSession.userId &&
                roomData.users.guest
              ) {
                if (
                  roomData.users.guest.userId !=
                  currentState.currentSession.userId
                ) {
                  cb("El room está lleno");
                  return;
                }
              }
              // Si el usuario es el owner del room, cargar los datos del owner en el state y marcarlo como connected.
              if (
                roomData.users.owner.userId ==
                currentState.currentSession.userId
              ) {
                currentState.currentGame.users = {
                  owner: roomData.users.owner,
                };
                //currentState.currentGame.users.owner.isConnected = true;
                currentState.currentGame.roomId = data.roomId;
                currentState.currentGame.roomToken = roomToken;
                this.setState(currentState);
                cb(res);
              }

              // Por descarte el usuario es un guest.
              // Primero guarda el owner en el state obtenido de rtdb.
              else {
                currentState.currentGame.users = {
                  owner: roomData.users.owner,
                };

                // si ya estaba registrado como guest, se recuperan los datos de rtdb en el state y marcarlo como connected.
                if (roomData.users.guest) {
                  currentState.currentGame.users = {
                    guest: roomData.users.guest,
                  };
                  //currentState.currentGame.users.guest.isConnected = true;
                  currentState.currentGame.roomId = data.roomId;
                  currentState.currentGame.roomToken = roomToken;
                  this.setState(currentState);
                  cb(res);

                  // Si no estaba registrado como guest en el room, hay que registrarlo en el rtdb y el state.
                } else {
                  currentState.currentGame.users.guest = {
                    userId: currentState.currentSession.userId,
                    //isConnected: true,
                    name: currentState.currentSession.username,
                    wins: 0,
                    isReady: false,
                    currentMove: "",
                  };
                  rtdb
                    .ref(`/rooms/${data.roomId}/users/`)
                    .update({
                      guest: currentState.currentGame.users.guest,
                    })
                    .then(() => {
                      // Luego guarda el resto de los datos del room.
                      currentState.currentGame.roomId = data.roomId;
                      currentState.currentGame.roomToken = roomToken;
                      this.setState(currentState);
                      cb(res);
                    });
                }
              }
            });
        });
        // Si el token no coincide con ningun roomID.
      } else {
        cb("No existe el room ingresado");
      }
    });
  },
  setReady(cb: () => void) {
    const currentState = this.getState();
    let identity: any;
    if (
      currentState.currentGame.users.owner.userId ==
      currentState.currentSession.userId
    ) {
      identity = "owner";
    } else {
      identity = "guest";
    }

    rtdb
      .ref("/rooms/" + currentState.currentGame.roomId + "/users/" + identity)
      .update({
        isReady: true,
      })
      .then(() => {
        cb();
      });
  },
  setWaiting(cb: () => void) {
    const currentState = this.getState();
    let identity: any;
    if (
      currentState.currentGame.users.owner.userId ==
      currentState.currentSession.userId
    ) {
      identity = "owner";
    } else {
      identity = "guest";
    }

    rtdb
      .ref("/rooms/" + currentState.currentGame.roomId + "/users/" + identity)
      .update({
        waiting: true,
      })
      .then(() => {
        cb();
      });
  },
  resetMoves(cb?: () => void) {
    const currentState = this.getState();
    let identity: any;
    if (
      currentState.currentGame.users.owner.userId ==
      currentState.currentSession.userId
    ) {
      identity = "owner";
    } else {
      identity = "guest";
    }

    rtdb
      .ref("/rooms/" + currentState.currentGame.roomId + "/users/" + identity)
      .update({
        currentMove: "",
      })
      .then(() => {
        cb();
      });
  },
  resetReady() {
    const currentState = this.getState();
    let identity: any;
    if (
      currentState.currentGame.users.owner.userId ==
      currentState.currentSession.userId
    ) {
      identity = "owner";
    } else {
      identity = "guest";
    }

    rtdb
      .ref("/rooms/" + currentState.currentGame.roomId + "/users/" + identity)
      .update({
        isReady: false,
      });
  },
  resetWaiting(cb) {
    const currentState = this.getState();
    let identity: any;
    if (
      currentState.currentGame.users.owner.userId ==
      currentState.currentSession.userId
    ) {
      identity = "owner";
    } else {
      identity = "guest";
    }

    rtdb
      .ref("/rooms/" + currentState.currentGame.roomId + "/users/" + identity)
      .update({
        waiting: false,
      })
      .then(() => {
        cb();
      });
  },
  async setPlayerMove(move) {
    const currentState = this.getState();
    let identity: any;
    if (
      currentState.currentGame.users.owner.userId ==
      currentState.currentSession.userId
    ) {
      identity = "owner";
    } else {
      identity = "guest";
    }

    await rtdb
      .ref("/rooms/" + currentState.currentGame.roomId + "/users/" + identity)
      .update({
        currentMove: move,
      });
  },
  whoWins(selfMove, otherMove) {
    let result = "other";
    if (selfMove == "piedra" && otherMove == "tijera") {
      result = "self";
    }
    if (selfMove == "papel" && otherMove == "piedra") {
      result = "self";
    }
    if (selfMove == "tijera" && otherMove == "papel") {
      result = "self";
    }
    if (selfMove == otherMove) {
      result = "tie";
    }
    return result;
  },
  setResult(result) {
    const currentState = state.getState();
    if (
      currentState.currentGame.users.owner.userId ==
      currentState.currentSession.userId
    ) {
      if (result == "self") {
        rtdb
          .ref("/rooms/" + currentState.currentGame.roomId + "/users/owner")
          .update({
            wins: currentState.currentGame.users.owner.wins + 1,
          });
      }
      if (result == "other") {
        rtdb
          .ref("/rooms/" + currentState.currentGame.roomId + "/users/guest")
          .update({
            wins: currentState.currentGame.users.guest.wins + 1,
          });
      }
      if (result == "tie") {
        rtdb.ref("/rooms/" + currentState.currentGame.roomId).update({
          ties: (currentState.currentGame.ties || 0) + 1,
        });
      }
    }
  },
};
