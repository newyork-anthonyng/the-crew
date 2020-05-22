const Deck = require("./deck");
const PlayerEntity = require("./playerEntity");
const ROBOT_COLUMN_SIZE = 7;
const CARDS_PER_COLUMN = 2;
const PLAYER_HAND_SIZE = 13;

function Game() {
  let deck = [];
  let taskDeck = [];

  let robot = new PlayerEntity();
  let player1 = new PlayerEntity();
  let player2 = new PlayerEntity();
  let playArea = new PlayerEntity();
  let discardArea = [];

  function createNewGame() {
    robot.reset();
    player1.reset();
    player2.reset();
    playArea.reset();

    deck = new Deck();
    taskDeck = new Deck();

    constructRobotCards();
    constructPlayerCards();
    drawTasks();
  }

  function constructRobotCards() {
    for (let i = 0; i < ROBOT_COLUMN_SIZE; i++) {
      const column = [];
      for (let i = 0; i < CARDS_PER_COLUMN; i++) {
        column.push(deck.draw());
      }
      robot.drawCard(column);
    }
  }

  function constructPlayerCards() {
    deck.addTrumpCardsToDeck();

    for (let i = 0; i < PLAYER_HAND_SIZE; i++) {
      player1.drawCard(deck.draw());
      player1.sortCards();
    }
    for (let i = 0; i < PLAYER_HAND_SIZE; i++) {
      player2.drawCard(deck.draw());
      player2.sortCards();
    }
  }

  function drawTasks() {
    for (let i = 0; i < 3; i++) {
      playArea.drawTask(taskDeck.draw());
    }
  }

  function getPerson1State() {
    return {
      playArea: playArea.state(),
      player: player1.state(),
      partner: player2.anonymousState(),
      robot: robot.state(),
      discardAreaCards: discardArea,
    };
  }

  function getPerson2State() {
    return {
      playArea: playArea.state(),
      player: player2,
      partner: player1.anonymousState(),
      robot: robot.state(),
      discardAreaCards: discardArea,
    };
  }

  function player1Plays(card) {
    player1.removeCard(card);
    playArea.drawCard(card);
  }

  function player2Plays(card) {
    player2.removeCard(card);
    playArea.drawCard(card);
  }

  function robotPlays(selectedCard) {
    robot.removeCard(selectedCard);
    playArea.drawCard(selectedCard);
  }

  function player1Returns(card) {
    player1.drawCard(card);
    player1.sortCards();

    playArea.removeCard(card);
  }

  function player2Returns(card) {
    player2.drawCard(card);
    player2.sortCards();

    playArea.removeCard(card);
  }

  function discardCards() {
    return playArea.discardCards();
  }

  function player1PicksTask(task) {
    player1.drawTask(task);
    playArea.removeTask(task);
  }

  function player2PicksTask(task) {
    player2.drawTask(task);
    playArea.removeTask(task);
  }

  function player1ReturnsTask(task) {
    player1.removeTask(task);
    playArea.drawTask(task);
  }

  function player2ReturnsTask(task) {
    player2.removeTask(task);
    playArea.drawTask(task);
  }

  return {
    createNewGame,
    getPerson1State,
    getPerson2State,
    player1Plays,
    player2Plays,
    robotPlays,
    player1Returns,
    player2Returns,
    discardCards,
    player1PicksTask,
    player2PicksTask,
    player1ReturnsTask,
    player2ReturnsTask,
  };
}

module.exports = Game;
