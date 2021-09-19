import { Router } from "@vaadin/router";
import { state } from "../../state";

class Room extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.render();
  }
  render() {
    state.serverListener();

    // Containers
    const roomContainerEl = document.createElement("div");
    roomContainerEl.classList.add("room-container");
    this.appendChild(roomContainerEl);

    const roomHeaderEl = document.createElement("div");
    roomContainerEl.appendChild(roomHeaderEl);
    const mensajeContainer = document.createElement("div");
    mensajeContainer.classList.add("mensaje-cont");
    roomContainerEl.appendChild(mensajeContainer);
    const iconosContainer = document.createElement("div");
    roomContainerEl.appendChild(iconosContainer);

    // ROOM HEADER
    roomHeaderEl.classList.add("room-header");
    const roomScore = document.createElement("div");
    roomHeaderEl.appendChild(roomScore);
    const roomHeaderInfo = document.createElement("div");
    roomHeaderEl.appendChild(roomHeaderInfo);

    const ownerScore = document.createElement("h3");
    roomScore.appendChild(ownerScore);
    const guestScore = document.createElement("h3");
    roomScore.appendChild(guestScore);

    function renderScore() {
      if (state.getState().currentGame.users.owner) {
        ownerScore.innerHTML = `
        ${state.getState().currentGame.users.owner.name} : ${
          state.getState().currentGame.users.owner.wins || 0
        }
        `;
      }

      if (
        state.getState().currentGame.users.guest &&
        state.getState().currentGame.users.guest.name
      ) {
        guestScore.innerHTML = `
        ${state.getState().currentGame.users.guest.name} : ${
          state.getState().currentGame.users.guest.wins || 0
        }
        `;
      }

      // Room Info
      roomHeaderInfo.classList.add("room-header-info");
      roomHeaderInfo.innerHTML = `
        <h3>Sala</h3>
        <h3>${state.getState().currentGame.roomToken}</h3>
      `;
    }
    renderScore();

    function renderMensaje() {
      const currentState = state.getState();

      if (
        currentState.currentGame.users.guest &&
        currentState.currentGame.users.guest.name
      ) {
        mensajeContainer.innerHTML = `
        <button class="btn play-btn">Nueva Partida</button>
        `;
        document.querySelector(".play-btn").addEventListener("click", () => {
          state.setReady(() => {
            state.resetMoves(() => {
              Router.go("/instructions");
            });
          });
        });
      } else {
        mensajeContainer.innerHTML = `
          <h2>Enviale el token a tu oponente</h2>
          <p>${currentState.currentGame.roomToken}<p>
          `;
        return;
      }
    }
    renderMensaje();

    // Iconos de manos
    iconosContainer.className = "iconos-container";

    const iconoPapel = document.createElement("papel-comp");
    iconoPapel.className = "icono-papel";
    iconosContainer.appendChild(iconoPapel);

    const iconoPiedra = document.createElement("piedra-comp");
    iconoPiedra.className = "icono-piedra";
    iconosContainer.appendChild(iconoPiedra);

    const iconoTijera = document.createElement("tijera-comp");
    iconosContainer.appendChild(iconoTijera);
    iconoTijera.className = "icono-tijera";

    // CSS
    const style = document.createElement("style");
    style.innerHTML = `
      .room-container {
        display: grid;
        justify-content: center;
        grid-template-rows: 1fr 10fr;
        padding-top: 20px;
      }
      .room-header {
        display: flex;
        justify-content: space-between;
      }
      h3 {
        margin: 0;
      }
      .room-header-info {
        text-align: right;
      }
      .mensaje-cont{
        place-self: center;
        display: grid;
        justify-items: center;
      }
      .mensaje-cont p{
        font-size: 50px;
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
    roomContainerEl.appendChild(style);

    state.subscribe(renderScore);
    state.subscribe(renderMensaje);
  }
}

customElements.define("custom-room", Room);
