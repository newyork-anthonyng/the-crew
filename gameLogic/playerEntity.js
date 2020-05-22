class PlayerEntity {
  constructor() {
    this.cards = [];
    this.tasks = [];
  }

  reset() {
    this.cards = [];
    this.tasks = [];
  }

  sortCards() {
    const splitCardsBySuit = this.organizeCardsBySuit(this.cards);

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

    this.cards = sortedCards;
  }

  organizeCardsBySuit(cards) {
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

  drawCard(card) {
    this.cards.push(card);
  }

  drawTask(task) {
    this.tasks.push(task);
  }

  removeTask(selectedTask) {
    this.tasks = this.tasks.filter((task) => {
      const isSameSuit = task.suit === selectedTask.suit;
      const isSameRank = task.rank === selectedTask.rank;

      return !(isSameSuit && isSameRank);
    });
  }

  removeCard(selectedCard) {
    this.cards = this.cards.filter((card) => {
      const isSameSuit = card.suit === selectedCard.suit;
      const isSameRank = card.rank === selectedCard.rank;

      return !(isSameSuit && isSameRank);
    });
  }

  discardCards() {
    const oldCards = this.cards;
    this.cards = [];

    return oldCards;
  }

  state() {
    return {
      cards: this.cards,
      tasks: this.tasks,
    };
  }

  anonymousState() {
    return {
      cards: this.anonymize(this.cards),
      tasks: this.tasks,
    };
  }

  anonymize(cards) {
    return cards.map(() => ({ rank: "?", suit: "?" }));
  }
}

module.exports = PlayerEntity;
