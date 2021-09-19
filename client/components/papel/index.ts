customElements.define(
  "papel-comp",
  class PapelComp extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      this.render();
    }
    render() {
      const shadow = this.attachShadow({ mode: "open" });
      const icono = document.createElement("img");
      icono.setAttribute("src", require("url:../../images/papel.svg"));
      shadow.appendChild(icono);
    }
  }
);
