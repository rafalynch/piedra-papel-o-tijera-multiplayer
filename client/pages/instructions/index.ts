import { Router } from "@vaadin/router";
import { state } from "../../state";

class Instructions extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    state.resetSubs();
    this.render();
  }
  render() {
    // CONTAINERS
    const instructionsContEl = document.createElement("div");
    instructionsContEl.classList.add("instructions-container");
    this.appendChild(instructionsContEl);

    // Header
    const roomHeaderEl = document.createElement("div");
    instructionsContEl.appendChild(roomHeaderEl);
    // Mensaje
    const mensaje = document.createElement("div");
    mensaje.classList.add("mensaje-cont");
    instructionsContEl.appendChild(mensaje);

    // ROOM HEADER
    roomHeaderEl.classList.add("room-header");
    const roomScore = document.createElement("div");
    roomHeaderEl.appendChild(roomScore);
    const roomHeaderInfo = document.createElement("div");
    roomHeaderInfo.classList.add("room-header-info");
    roomHeaderEl.appendChild(roomHeaderInfo);

    const ownerScore = document.createElement("h3");
    roomScore.appendChild(ownerScore);
    const guestScore = document.createElement("h3");
    roomScore.appendChild(guestScore);

    function renderScore() {
      // Owner
      if (state.getState().currentGame.users.owner) {
        ownerScore.innerHTML = `
        ${state.getState().currentGame.users.owner.name} : ${
          state.getState().currentGame.users.owner.wins || 0
        }
        `;
      }
      // Guest
      if (state.getState().currentGame.users.guest) {
        guestScore.innerHTML = `
        ${state.getState().currentGame.users.guest.name} : ${
          state.getState().currentGame.users.guest.wins || 0
        }
        `;
      }
      // Room Info
      roomHeaderInfo.innerHTML = `
        <h3>Sala</h3>
        <h3>${state.getState().currentGame.roomToken}</h3>
      `;
    }
    renderScore();
    state.subscribe(renderScore);

    function renderPlayBtn() {
      const currentState = state.getState();
      let oponent: any;
      if (
        currentState.currentGame.users.owner.userId ==
        currentState.currentSession.userId
      ) {
        oponent = currentState.currentGame.users.guest;
      } else {
        oponent = currentState.currentGame.users.owner;
      }

      if (oponent.isReady) {
        mensaje.innerHTML =
          "Presioná jugar y elegí: piedra, papel o tijera antes de que pasen los 3 segundos.";
        const playButton = document.createElement("button");
        playButton.classList.add("btn");
        playButton.innerText = "Jugar!";
        playButton.addEventListener("click", (e) => {
          state.setWaiting(() => {
            Router.go("/game");
          });
        });
        mensaje.appendChild(playButton);
      } else {
        mensaje.innerHTML =
          "Esperando que el usuario " + oponent.name + " este conectado";
      }
    }
    renderPlayBtn();
    state.subscribe(renderPlayBtn);

    // Iconos de manos
    const iconosContainer = document.createElement("div");
    iconosContainer.classList.add("iconos-container");

    const iconoPapel = document.createElement("papel-comp");
    iconoPapel.className = "icono-papel";
    iconosContainer.appendChild(iconoPapel);

    const iconoPiedra = document.createElement("piedra-comp");
    iconoPiedra.className = "icono-piedra";
    iconosContainer.appendChild(iconoPiedra);

    const iconoTijera = document.createElement("tijera-comp");
    iconosContainer.appendChild(iconoTijera);
    iconoTijera.className = "icono-tijera";

    instructionsContEl.appendChild(iconosContainer);

    // CSS
    const style = document.createElement("style");
    style.innerHTML = `
      .instructions-container {
        display: grid;
        justify-content: center;
        grid-template-rows: 1fr 10fr;
        padding-top: 20px;
      }
      .room-header {
        display: flex;
        justify-content: space-between;
      }
      .room-header-info {
        text-align: right;
      }
      h3 {
        margin: 0;
      }
      .mensaje-cont{
        place-self: center;
        text-align: center;
        max-width: 322px; 
        font-size: 35px;
        font-family: "American Typewriter";
        display: grid;
        gap: 10px;
      }
      .iconos-container{
        display: flex;
        justify-content: center;
        gap: 35px;
        position: fixed;
        bottom: 0;
        width: 100%;
      }
      .icono-papel, .icono-tijera, .icono-piedra {
        transform: translateY(25%);
      }
      `;
    instructionsContEl.appendChild(style);

    this.appendChild(instructionsContEl);
  }
}

customElements.define("custom-instructions", Instructions);
