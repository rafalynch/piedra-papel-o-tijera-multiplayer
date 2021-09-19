import { Router } from "@vaadin/router";
import { state } from "../../state";

class Login extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.render();
  }
  render() {
    const loginContainerEl = document.createElement("div");
    loginContainerEl.classList.add("login-container");

    // TITULO
    const titleContainer = document.createElement("div");
    titleContainer.className = "title-container";
    titleContainer.innerHTML = `
    <h1 class="title">Piedra, <br/> Papel<span class="title-o"> ó </span> <br/> Tijera</h1>
    `;
    loginContainerEl.appendChild(titleContainer);

    // LOGIN FORM
    const loginFormEl = document.createElement("form");
    loginFormEl.setAttribute("id", "login-form");
    loginFormEl.innerHTML = `
      <input  class="custom-input" autocomplete="off" name="name" placeholder="username"/>
      <button type="submit" form="login-form" class="btn">LOGIN</button>
      `;

    loginFormEl.addEventListener("submit", (e) => {
      e.preventDefault();
      const target: any = e.target;
      const username = target.name.value.toLowerCase();
      state.logIn(username, () => {
        Router.go("/home");
      });
    });
    loginContainerEl.appendChild(loginFormEl);

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

    loginContainerEl.appendChild(iconosContainer);

    // CSS
    const style = document.createElement("style");
    style.innerHTML = `
    .login-container {
      display: grid;
      justify-content: center;
    }
    form {
      display: grid;
      justify-content: center;
      margin-top: 15px;
      gap: 15px;
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
    loginContainerEl.appendChild(style);

    this.appendChild(loginContainerEl);
  }
}

customElements.define("custom-login", Login);
