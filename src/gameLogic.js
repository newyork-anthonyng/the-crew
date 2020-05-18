function Game() {
  let deck = [];
  let robotCards = [];
  let player1 = [];
  let player2 = [];

  function createNewGame() {
    const suits = ["yellow", "pink", "blue", "green"];

    for (let rank = 1; rank <= 9; rank++) {
      for (let suit = 0; suit < suits.length; suit++) {
        deck.push({ suit: suits[suit], rank });
      }
    }
    deck = shuffle(deck);

    // construct cards for robot first
    for (let i = 0; i < 7; i++) {
      const column = [];
      for (let i = 0; i < 2; i++) {
        column.push(deck.pop());
      }
      robotCards.push(column);
    }

    // then add four rocket cards into deck and shuffle
    for (let i = 0; i < 4; i++) {
      deck.push({ suit: "trump", rank: i + 1 });
    }
    deck = shuffle(deck);

    // then draw cards for 2 players
    for (let i = 0; i < 13; i++) {
      player1.push(deck.pop());
    }
    for (let i = 0; i < 13; i++) {
      player2.push(deck.pop());
    }
  }

  function shuffle(array) {
    var currentIndex = array.length,
      temporaryValue,
      randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  return {
    createNewGame,
  };
}

module.exports = Game;
