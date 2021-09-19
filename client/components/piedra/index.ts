customElements.define(
  "piedra-comp",
  class PiedraComp extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      this.render();
    }
    render() {
      const shadow = this.attachShadow({ mode: "open" });
      const icono = document.createElement("img");
      icono.setAttribute("src", require("url:../../images/piedra.svg"));
      shadow.appendChild(icono);
    }
  }
);
