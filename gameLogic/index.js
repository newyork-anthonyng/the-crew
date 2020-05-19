const Deck = require("./deck");
const ROBOT_COLUMN_SIZE = 7;
const CARDS_PER_COLUMN = 2;
const PLAYER_HAND_SIZE = 13;

function Game() {
  let deck = [];
  let taskDeck = [];
  let robot = {
    tasks: [],
    cards: [],
  };
  let player1 = {
    tasks: [],
    cards: [],
  };
  let player2 = {
    tasks: [],
    cards: [],
  };
  let playArea = {
    tasks: [],
    cards: [],
  };
  let discardArea = [];

  function createNewGame() {
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
      robot.cards.push(column);
    }
  }

  function constructPlayerCards() {
    deck.addTrumpCardsToDeck();

    for (let i = 0; i < PLAYER_HAND_SIZE; i++) {
      player1.cards.push(deck.draw());
    }
    for (let i = 0; i < PLAYER_HAND_SIZE; i++) {
      player2.cards.push(deck.draw());
    }

    sortCards(player1);
    sortCards(player2);
  }

  function sortCards(player) {
    const splitCardsBySuit = organizeCardsBySuit(player.cards);

    for (const currentSuit in splitCardsBySuit) {
      splitCardsBySuit[currentSuit].sort((a, b) => {
        return +a.rank - +b.rank;
      });
    }

    const sortedCards = Object.values(splitCardsBySuit).reduce(
      (accumulated, current) => {
        return accumulated.concat(current);
      },
      []
    );

    player.cards = sortedCards;
  }

  function organizeCardsBySuit(cards) {
    const suits = {};
    for (let i = 0; i < cards.length; i++) {
      const currentCard = cards[i];
      if (suits[currentCard.suit] === undefined) {
        suits[currentCard.suit] = [];
      }

      suits[currentCard.suit].push(currentCard);
    }
    return suits;
  }

  function drawTasks() {
    for (let i = 0; i < 3; i++) {
      playArea.tasks.push(taskDeck.draw());
    }
  }

  function getPerson1State() {
    return {
      playArea,
      player: player1,
      partner: {
        ...player2,
        cards: anonymize(player2.cards),
      },
      robot,
      discardAreaCards: discardArea,
    };
  }

  function getPerson2State() {
    return {
      playArea,
      player: player2,
      partner: {
        ...player1,
        cards: anonymize(player1.cards),
      },
      robot,
      discardAreaCards: discardArea,
    };
  }

  function anonymize(cards) {
    return cards.map(() => ({ rank: "?", suit: "?" }));
  }

  function player1Plays(card) {
    removeCard(card, player1);
    addCard(card, playArea);
  }

  function player2Plays(card) {
    removeCard(card, player2);
    addCard(card, playArea);
  }

  function removeCard(selectedCard, player) {
    player.cards = player.cards.filter((card) => {
      const isSameSuit = card.suit === selectedCard.suit;
      const isSameRank = card.rank === selectedCard.rank;

      return !(isSameSuit && isSameRank);
    });
  }

  function addCard(card, player) {
    const newCards = player.cards.slice();
    newCards.push(card);
    player.cards = newCards;
  }

  function robotPlays(selectedCard) {
    robot.cards = robot.cards.filter((card) => {
      const isSameSuit = card.suit === selectedCard.suit;
      const isSameRank = card.rank === selectedCard.rank;

      return !(isSameSuit && isSameRank);
    });

    const newPlayerAreaCards = playArea.cards.slice();
    newPlayerAreaCards.push(selectedCard);
    playArea.cards = newPlayerAreaCards;
  }

  function player1Returns(card) {
    addCard(card, player1);

    removeCard(card, playArea);
  }

  function player2Returns(card) {
    addCard(card, player1);

    removeCard(card, playArea);
  }

  function discardCards() {
    const discardedCards = playArea.cards.slice();
    discardArea = discardedCards;
    playArea.cards = [];

    return discardedCards;
  }

  function player1PicksTask(task) {
    addTask(task, player1);

    removeTask(task, playArea);
  }

  function player2PicksTask(task) {
    addTask(task, player2);

    removeTask(task, playArea);
  }

  function addTask(task, player) {
    const newTasks = player.tasks.slice();
    newTasks.push(task);
    player.tasks = newTasks;
  }

  function removeTask(selectedTask, player) {
    player.tasks = player.tasks.filter((task) => {
      const isSameSuit = task.suit === selectedTask.suit;
      const isSameRank = task.rank === selectedTask.rank;

      return !(isSameSuit && isSameRank);
    });
  }

  function player1ReturnsTask(task) {
    removeTask(task, player1);
    addTask(task, playArea);
  }

  function player2ReturnsTask(task) {
    removeTask(task, player2);
    addTask(task, playArea);
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
