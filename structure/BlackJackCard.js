const cards = {
    6: {
        "hearts": "",
        "spades": "",
        "diamonds": "",
        "clubs": ""
    },
    7: {
        "hearts": "",
        "spades": "",
        "diamonds": "",
        "clubs": ""
    },
    8: {
        "hearts": "",
        "spades": "",
        "diamonds": "",
        "clubs": ""
    },
    9: {
        "hearts": "",
        "spades": "",
        "diamonds": "",
        "clubs": ""
    },
    10: {
        "hearts": "",
        "spades": "",
        "diamonds": "",
        "clubs": ""
    },
    "vallet": {
        "hearts": "",
        "spades": "",
        "diamonds": "",
        "clubs": ""
    },
    "queen": {
        "hearts": "",
        "spades": "",
        "diamonds": "",
        "clubs": ""
    },
    "king": {
        "hearts": "",
        "spades": "",
        "diamonds": "",
        "clubs": ""
    },
    "jack": {
        "hearts": "",
        "spades": "",
        "diamonds": "",
        "clubs": ""
    }
}

class BlackJackCard {
    constructor() {
        this.usedCards = [];
    }
    getCard() {
        let card = cards[value]["type"];
        return card;
    }
    getRandom() {
        let card1 = getRandomDifferent(Object.entries(cards), this.usedCards);
        this.usedCards.push(card1);
        let card2 = getRandomDifferent(Object.entries(cards), this.usedCards);
        this.usedCards.push(card2);
        let card3 = getRandomDifferent(Object.entries(cards), this.usedCards);
        this.usedCards.push(card3);
        let card4 = getRandomDifferent(Object.entries(cards), this.usedCards);
        this.usedCards.push(card4);
        return [card1, card2, card3, card4];
    }
}

/**
 * 
 * @param {Array<Array<String, { hearts: String, spades: Strimg, diamonds: String, clubs: String }>>} arr 
 * @param {Array<Array<String, { hearts: String, spades: Strimg, diamonds: String, clubs: String }>>} notInArr 
 * @returns 
 */
function getRandomDifferent(arr, notInArr = []) {
    if (arr.length === 0) {
      return null;
    } else if (arr.length === 1) {
      return arr[0];
    } else {
      let num = 0;
      do {
        num = Math.floor(Math.random() * arr.length);
      } while (notInArr.includes(arr[num]));
      return arr[num];
    }
  }

module.exports = { BlackJackCard };