import { Router } from "@vaadin/router";

const outlet = document.querySelector(".root");
const router = new Router(outlet);
router.setRoutes([
  { path: "/login", component: "custom-login" },
  { path: "/", redirect: "/login" },
  { path: "/home", component: "custom-home" },
  { path: "/ingreso-room", component: "custom-ingreso-room" },
  { path: "/room", component: "custom-room" },
  { path: "/instructions", component: "custom-instructions" },
  { path: "/game", component: "custom-game" },
  { path: "/results", component: "custom-results" },
]);
