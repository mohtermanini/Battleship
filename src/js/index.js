import GameController from "./Game/game-controller";
import GameEventHandler from "./Game/game-event-handler";

const gamesContainer = document.getElementById("games");
GameController.generateGame(gamesContainer, 1);
