// PAGES
import "./router";
import "./pages/login/index.ts";
import "./pages/home/index.ts";
import "./pages/ingreso-room/index.ts";
import "./pages/room/index.ts";
import "./pages/instructions/index.ts";
import "./pages/game/index.ts";
import "./pages/results/index.ts";

// COMPONENTS
import "./components/tijera/index.ts";
import "./components/piedra/index.ts";
import "./components/papel/index.ts";
import "./components/score/index.ts";
import "./components/result/index.ts";

import { Router } from "@vaadin/router";
import { state } from "./state";

function goHome(state) {
  if (!state.currentSession.username) {
    Router.go("/");
  }
}

goHome(state.getState());
