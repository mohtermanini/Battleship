import Player from "./player-model";

test("Name is set", () => {
    const player = new Player("player1");
    expect(player.name).toEqual("player1");
});

test("Played rounds increases", () => {
    const player = new Player("player1");
    player.increasePlayerRounds();
    player.increasePlayerRounds();
    expect(player.playedRounds).toEqual(2);
});

test("Won rounds increases", () => {
    const player = new Player("player1");
    player.increaseWinRounds();
    player.increaseWinRounds();
    expect(player.winRounds).toEqual(2);
});
