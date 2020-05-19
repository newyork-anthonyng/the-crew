class Deck {
  constructor() {
    this.cards = [];
    this.TRUMP_SUIT = "trump";
    this.SUITS = ["yellow", "pink", "blue", "green"];
    this.RANK_LOW = 1;
    this.RANK_HIGH = 9;

    this.createAndShuffleDeck();
  }

  createAndShuffleDeck() {
    for (let rank = this.RANK_LOW; rank <= this.RANK_HIGH; rank++) {
      for (let suit = 0; suit < this.SUITS.length; suit++) {
        this.cards.push({ suit: this.SUITS[suit], rank: `${rank}` });
      }
    }

    this.shuffle();
  }

  shuffle() {
    var currentIndex = this.cards.length,
      temporaryValue,
      randomIndex;

    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      temporaryValue = this.cards[currentIndex];
      this.cards[currentIndex] = this.cards[randomIndex];
      this.cards[randomIndex] = temporaryValue;
    }
  }

  draw() {
    return this.cards.pop();
  }

  addTrumpCardsToDeck() {
    for (let i = 0; i < 4; i++) {
      this.cards.push({ suit: this.TRUMP_SUIT, rank: i + 1 });
    }

    this.shuffle();
  }
}

module.exports = Deck;
