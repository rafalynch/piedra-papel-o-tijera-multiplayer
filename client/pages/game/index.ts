import { Router } from "@vaadin/router";
import { state } from "../../state";

class Game extends HTMLElement {
  constructor() {
    super();
  }
  rendered = false;
  connectedCallback() {
    if (!this.rendered) {
      this.render();
    }
  }
  render() {
    this.rendered = true;
    let freezeClic = true;

    window.addEventListener(
      "click",
      (e) => {
        if (freezeClic) {
          e.stopPropagation();
          e.preventDefault();
        }
      },
      true
    );

    const gameContainer = document.createElement("div");
    gameContainer.className = "game-container";

    // Contador
    const timerContainer = document.createElement("p");
    timerContainer.innerHTML = `Esperando que tu oponente presione "Jugar!"`;
    timerContainer.className = "timer-container";
    timerContainer.style.fontSize = "60px";
    gameContainer.appendChild(timerContainer);

    function initContador(newState) {
      if (
        newState.currentGame.users.owner.waiting &&
        newState.currentGame.users.guest.waiting
      ) {
        state.unsubscribe(initContador);
        state.resetWaiting(() => {
          freezeClic = false;
          timerContainer.innerHTML = "Go!";
          let counter = 3;
          const intervalo = setInterval(() => {
            document.querySelector(".timer-container").innerHTML =
              counter.toString();
            counter--;
            if (counter < 0) {
              clearInterval(intervalo);
              processGame();

              state.resetReady();
              freezeClic = true;
            }
          }, 1000);
        });
      } else {
        return;
      }
    }

    initContador(state.getState());
    state.subscribe(initContador);

    // Iconos de manos
    const iconosContainer = document.createElement("div");
    iconosContainer.className = "iconos-container";

    // PAPEL
    const iconoPapel = document.createElement("papel-comp");
    iconoPapel.className = "icono-papel";
    iconosContainer.appendChild(iconoPapel);
    iconoPapel.addEventListener("click", (e) => {
      const target = e.target as Element;
      document
        .querySelector(".icono-piedra")
        .setAttribute("style", "transform: translateY(25%); opacity: 0.5;");
      document
        .querySelector(".icono-tijera")
        .setAttribute("style", "transform: translateY(25%); opacity: 0.5;");
      target.parentElement.setAttribute("style", "transform: translateY(15%)");
      target.setAttribute("style", "transform: translateY(0%)");
      state.setPlayerMove("papel");
    });

    // PIEDRA
    const iconoPiedra = document.createElement("piedra-comp");
    iconoPiedra.className = "icono-piedra";
    iconosContainer.appendChild(iconoPiedra);
    iconoPiedra.addEventListener("click", (e) => {
      const target = e.target as Element;
      document
        .querySelector(".icono-papel")
        .setAttribute("style", "transform: translateY(25%); opacity: 0.5;");
      document
        .querySelector(".icono-tijera")
        .setAttribute("style", "transform: translateY(25%); opacity: 0.5;");
      target.parentElement.setAttribute("style", "transform: translateY(15%)");
      target.setAttribute("style", "transform: translateY(0%)");
      state.setPlayerMove("piedra");
    });

    // TIJERA
    const iconoTijera = document.createElement("tijera-comp");
    iconosContainer.appendChild(iconoTijera);
    iconoTijera.className = "icono-tijera";
    iconoTijera.addEventListener("click", (e) => {
      const target = e.target as Element;
      document
        .querySelector(".icono-papel")
        .setAttribute("style", "transform: translateY(25%); opacity: 0.5;");
      document
        .querySelector(".icono-piedra")
        .setAttribute("style", "transform: translateY(25%); opacity: 0.5;");
      target.parentElement.setAttribute("style", "transform: translateY(15%)");
      target.setAttribute("style", "transform: translateY(0%)");
      state.setPlayerMove("tijera");
    });

    gameContainer.appendChild(iconosContainer);

    // CSS
    const style = document.createElement("style");
    style.innerHTML = `
    .game-container {
      display: grid;
      justify-content: center;
    }
    .timer-container {
      text-align: center;
      max-width: 322px;
      margin-top: 100px;
      font-family: "American Typewriter";
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
    gameContainer.appendChild(style);

    function processGame() {
      setTimeout(() => {
        const currentState = state.getState();

        let self: string;
        let other: string;
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

        const selfMove = currentState.currentGame.users[self].currentMove;
        const otherMove = currentState.currentGame.users[other].currentMove;
        const result = state.whoWins(selfMove, otherMove);

        state.setResult(result, () => {
          Router.go("/results");
          freezeClic = false;
        });
      }, 3000);
    }

    this.appendChild(gameContainer);
  }
}

customElements.define("custom-game", Game);
