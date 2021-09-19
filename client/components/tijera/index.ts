customElements.define(
  "tijera-comp",
  class TijeraComp extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      this.render();
    }
    render() {
      const shadow = this.attachShadow({ mode: "open" });
      const icono = document.createElement("img");
      icono.setAttribute("src", require("url:../../images/tijera.svg"));
      shadow.appendChild(icono);
    }
  }
);
