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
    deck = createAndShuffleDeck();
    taskDeck = createAndShuffleDeck();

    constructRobotCards();
    constructPlayerCards();
    drawTasks();
  }

  function createAndShuffleDeck() {
    const deck = [];
    const SUITS = ["yellow", "pink", "blue", "green"];
    const RANK_LOW = 1;
    const RANK_HIGH = 9;

    for (let rank = RANK_LOW; rank <= RANK_HIGH; rank++) {
      for (let suit = 0; suit < SUITS.length; suit++) {
        deck.push({ suit: SUITS[suit], rank });
      }
    }
    return shuffle(deck);
  }

  function constructRobotCards() {
    const ROBOT_COLUMN_SIZE = 7;
    const CARDS_PER_COLUMN = 2;

    for (let i = 0; i < ROBOT_COLUMN_SIZE; i++) {
      const column = [];
      for (let i = 0; i < CARDS_PER_COLUMN; i++) {
        column.push(deck.pop());
      }
      robot.cards.push(column);
    }
  }

  function constructPlayerCards() {
    for (let i = 0; i < 4; i++) {
      deck.push({ suit: "trump", rank: i + 1 });
    }
    deck = shuffle(deck);

    const PLAYER_HAND_SIZE = 13;
    for (let i = 0; i < PLAYER_HAND_SIZE; i++) {
      player1.cards.push(deck.pop());
    }
    for (let i = 0; i < PLAYER_HAND_SIZE; i++) {
      player2.cards.push(deck.pop());
    }
  }

  function drawTasks() {
    for (let i = 0; i < 3; i++) {
      playArea.tasks.push(taskDeck.pop());
    }
  }

  function shuffle(array) {
    var currentIndex = array.length,
      temporaryValue,
      randomIndex;

    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
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
