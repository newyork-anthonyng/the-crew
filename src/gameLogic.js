function Game() {
  let deck = [];
  let robot = {
    tasks: [{ rank: "9", suit: "yellow" }],
    cards: [],
  };
  let player1 = {
    tasks: [
      { rank: "7", suit: "pink" },
      { rank: "2", suit: "yellow" },
    ],
    cards: [],
  };
  let player2 = {
    tasks: [{ rank: "7", suit: "blue" }],
    cards: [],
  };
  let playArea = {
    tasks: [],
    cards: [],
  };
  let discardArea = [];

  function createNewGame() {
    createAndShuffleDeck();

    constructRobotCards();
    constructPlayerCards();
  }

  function createAndShuffleDeck() {
    const SUITS = ["yellow", "pink", "blue", "green"];
    const RANK_LOW = 1;
    const RANK_HIGH = 9;

    for (let rank = RANK_LOW; rank <= RANK_HIGH; rank++) {
      for (let suit = 0; suit < SUITS.length; suit++) {
        deck.push({ suit: SUITS[suit], rank });
      }
    }
    deck = shuffle(deck);
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
  }

  function player2Plays(card) {
    removeCard(card, player2);
  }

  function removeCard(selectedCard, player) {
    player.cards = player.cards.filter((card) => {
      const isSameSuit = card.suit === selectedCard.suit;
      const isSameRank = card.rank === selectedCard.rank;

      return !(isSameSuit && isSameRank);
    });

    const newPlayerAreaCards = playArea.cards.slice();
    newPlayerAreaCards.push(selectedCard);
    playArea.cards = newPlayerAreaCards;
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

  return {
    createNewGame,
    getPerson1State,
    getPerson2State,
    player1Plays,
    player2Plays,
    robotPlays,
  };
}

module.exports = Game;
