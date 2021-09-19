class PiedraComp extends HTMLElement {
  constructor() {
    super();
    this.render();
  }
  // connectedCallback() {
  //   this.render();
  // }
  render() {
    const shadow = this.attachShadow({ mode: "open" });
    const icono = document.createElement("img");
    icono.setAttribute("src", require("url:../../images/piedra.svg"));
    shadow.appendChild(icono);
  }
}

customElements.define("piedra-comp", PiedraComp);
