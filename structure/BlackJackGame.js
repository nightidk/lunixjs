const { BlackJackCard } = require("./BlackJackCard");

class BlackJack {
    constructor() {
        this.cards = new BlackJackCard();
        this.startCards = this.cards.getRandom();
        this.playerCards = this.startCards.slice(0, 2);
        this.dealerCards = this.startCards.slice(2, 4);
    }

    getCards() {
        return this.cards;
    }
}