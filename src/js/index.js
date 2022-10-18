import GameController from "./Game/game-controller";
import GameEventHandler from "./Game/game-event-handler";
import "../sass/styles.scss";

const gamesContainer = document.getElementById("games");
GameController.generateGame(gamesContainer, 1);
