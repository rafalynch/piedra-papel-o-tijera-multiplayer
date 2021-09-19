import { Router } from "@vaadin/router";
import { state } from "../../state";

class Home extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.render();
  }
  render() {
    const homeContainerEl = document.createElement("div");
    homeContainerEl.classList.add("home-container");

    // TITULO
    const titleContainer = document.createElement("div");
    titleContainer.className = "title-container";
    titleContainer.innerHTML = `
    <h1 class="title">Piedra, <br/> Papel<span class="title-o"> ó </span> <br/> Tijera</h1>
    `;
    homeContainerEl.appendChild(titleContainer);

    // BOTONES
    const botonesContainerEl = document.createElement("div");
    botonesContainerEl.classList.add("botones-cont");
    homeContainerEl.appendChild(botonesContainerEl);

    const newBtnEl = document.createElement("button");
    newBtnEl.classList.add("btn");
    newBtnEl.innerHTML = "Nuevo Juego";
    newBtnEl.addEventListener("click", () => {
      const currentUserId = state.getState().currentSession.userId;
      const currentUsername = state.getState().currentSession.username;
      state.setNewRoom(currentUserId, currentUsername, () => {
        Router.go("/room");
      });
    });
    botonesContainerEl.appendChild(newBtnEl);

    const joinRoomBtnEl = document.createElement("button");
    joinRoomBtnEl.classList.add("btn");
    joinRoomBtnEl.innerHTML = "Ingresar a una sala";
    joinRoomBtnEl.addEventListener("click", () => {
      Router.go("/ingreso-room");
    });
    botonesContainerEl.appendChild(joinRoomBtnEl);

    // Iconos de manos
    const iconosContainer = document.createElement("div");
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

    homeContainerEl.appendChild(iconosContainer);

    // CSS
    const style = document.createElement("style");
    style.innerHTML = `

    .home-container {
      display: grid;
      justify-content: center;
    }
    .title-container {
      margin-top: 15px;
      font-family: "American Typewriter";
    }
    .title {
      color: #009048;
      font-size: 80px;
      margin: 0;
      font-family: "American Typewriter";
    }
    .title-o  {
      color: #91CCAF;
      font-size: 80px;
      margin: 0;
    }
    .botones-cont{
      display: grid;
      justify-content: center;
      margin-top: 15px;
      gap: 15px;
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
    homeContainerEl.appendChild(style);

    this.appendChild(homeContainerEl);
  }
}

customElements.define("custom-home", Home);
