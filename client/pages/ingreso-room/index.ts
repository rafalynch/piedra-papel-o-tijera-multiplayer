import { Router } from "@vaadin/router";
import { state } from "../../state";

class IngresoRoom extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.render();
  }
  render() {
    const ingresoRoomContainerEl = document.createElement("div");
    ingresoRoomContainerEl.classList.add("ingreso-cont");

    // TIUTLO
    const titleContainer = document.createElement("div");
    titleContainer.className = "title-container";
    titleContainer.innerHTML = `
    <h1 class="title">Piedra, <br/> Papel<span class="title-o"> ó </span> <br/> Tijera</h1>
    `;
    ingresoRoomContainerEl.appendChild(titleContainer);

    // FORM
    const ingresoRoomFormEl = document.createElement("form");
    ingresoRoomFormEl.classList.add("ingreso-form");
    ingresoRoomFormEl.innerHTML = `
      <input class="custom-input" type="text" name="roomToken" autocomplete="off" placeholder="Room token"/>
      <button class="btn">Ingresar</button>
    `;
    ingresoRoomContainerEl.appendChild(ingresoRoomFormEl);

    const mensajErrEl = document.createElement("p");
    ingresoRoomContainerEl.appendChild(mensajErrEl);
    mensajErrEl.classList.add("mensaje-error");

    ingresoRoomFormEl.addEventListener("submit", (e) => {
      e.preventDefault();

      const target: any = e.target;
      const roomToken = target.roomToken.value;
      state.setExistingRoom(roomToken, (res) => {
        if (res.ok) {
          Router.go("/room");
        } else {
          mensajErrEl.innerHTML = res;
        }
      });
    });

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

    ingresoRoomContainerEl.appendChild(iconosContainer);

    // CSS
    const style = document.createElement("style");
    style.innerHTML = `
    .ingreso-cont {
      display: grid;
      justify-content: center;
    }
    .title-container {
      margin-top: 15px;
      px;
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
    .ingreso-form{
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
    .mensaje-error{
      justify-self : center;
      font-family: 'Odibee Sans', cursive;
    }
  `;
    ingresoRoomContainerEl.appendChild(style);

    this.appendChild(ingresoRoomContainerEl);
  }
}

customElements.define("custom-ingreso-room", IngresoRoom);
