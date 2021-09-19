import { state } from "../../state";

customElements.define(
  "score-comp",
  class ScoreComp extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      this.render();
    }
    render() {
      const shadow = this.attachShadow({ mode: "open" });
      const div = document.createElement("div");
      div.className = "score-container";
      const style = document.createElement("style");

      const currentState = state.getState();

      div.innerHTML = `
        <h3 class="score-title">Score</h3>
        <div class="score-body">
        <p>${currentState.currentGame.users.owner.name}: ${
        currentState.currentGame.users.owner.wins
      }</p>
      <p>${currentState.currentGame.users.guest.name}: ${
        currentState.currentGame.users.guest.wins
      }</p>
        <p>Empates: ${currentState.currentGame.ties || 0}</p>
        </div>
      `;

      style.innerHTML = `
        .score-container {
          width: 259px;
          height: 225px;
          padding: 10px;
          border: 10px solid;
          border-radius: 10px;
          background: white;
          font-family: "Odibee Sans";
        }
        .score-title {
          text-align: center;
          margin: 0;
          font-size: 55px;
        }
        .score-body p{
          text-align: right;
          margin: 0;
          font-size: 45px;
        }
      `;

      shadow.appendChild(div);
      shadow.appendChild(style);
    }
  }
);
