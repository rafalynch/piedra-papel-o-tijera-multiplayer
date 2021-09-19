import { Router } from "@vaadin/router";
import { state } from "../../state";
const fondoURL = require("url:../../images/fondo.png");

class Results extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.render();
  }
  render() {
    const showContainer = document.createElement("div");
    showContainer.className = "show-container";

    const iconosArray = [
      {
        nombre: "piedra",
        componente: "piedra-comp",
      },
      {
        nombre: "papel",
        componente: "papel-comp",
      },
      {
        nombre: "tijera",
        componente: "tijera-comp",
      },
    ];

    const currentState = state.getState();

    let self: any;
    let other: any;
    if (
      currentState.currentGame.users.owner.userId ==
      currentState.currentSession.userId
    ) {
      self = "owner";
      other = "guest";
    } else {
      self = "guest";
      other = "owner";
    }

    const ownMove = currentState.currentGame.users[self].currentMove;
    const oponentMove = currentState.currentGame.users[other].currentMove;
    const result = state.whoWins(ownMove, oponentMove);

    // Icono de Computer
    const iconoComputerContainer = document.createElement("div");
    iconoComputerContainer.className = "icono-computer";
    for (const i of iconosArray) {
      if (oponentMove == i.nombre) {
        iconoComputerContainer.innerHTML = `
        <${i.componente}></${i.componente}>
      `;
      }
    }

    // Icono de Player
    const iconoPlayerContainer = document.createElement("div");
    iconoPlayerContainer.className = "icono-player";
    for (const i of iconosArray) {
      if (ownMove == i.nombre) {
        iconoPlayerContainer.innerHTML = `
        <${i.componente}></${i.componente}>
      `;
      }
    }

    showContainer.appendChild(iconoComputerContainer);
    showContainer.appendChild(iconoPlayerContainer);

    // CSS
    const style = document.createElement("style");
    style.innerHTML = `
    .show-container {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .icono-computer {
      transform: rotate(180deg) scale(2.5);
      position: fixed;
      top: 0;
      margin: auto;
    }
    .icono-player {
      transform: scale(2.5);
      position: fixed;
      bottom: 0;
      margin: auto;
    }
  `;
    showContainer.appendChild(style);

    setTimeout(() => {
      const resultStats = document.createElement("div");
      resultStats.style.display = "grid";
      resultStats.style.justifyItems = "center";
      resultStats.style.gap = "20px";
      const style = document.createElement("style");

      resultStats.innerHTML = `
      <result-comp label="${result}"></result-comp>
    `;
      const score = document.createElement("score-comp");
      resultStats.style.position = "absolute";
      resultStats.style.top = "60px";
      resultStats.appendChild(score);

      const volverButton = document.createElement("button");
      volverButton.className = "btn";
      volverButton.innerText = "Volver a jugar";
      volverButton.addEventListener("click", (e) => {
        Router.go("/room");
      });
      resultStats.appendChild(volverButton);
      style.innerHTML = `
      .icono-computer,
      .icono-player {
        opacity: 0.5;
      }
      .show-container {
        background-color: red;
      }
    `;

      showContainer.appendChild(style);
      showContainer.appendChild(resultStats);
    }, 2500);

    this.appendChild(showContainer);
  }
}

customElements.define("custom-results", Results);
