class Trade { 
    /*
        tradeID: string
        shares: non negative integer
        price: non negative integer
        tradeType: String
    */
    constructor (tradeID, shares, price, tradeType) {
        this.tradeID = tradeID;
        this.shares = shares;
        this.tradeType = tradeType; // BUY or SELL
        this.price = price;
    }

    get getTradeID() {
        return this.tradeID;
    }

    get getPrice() { 
        return this.price
    }

    get getTradeType() {
        return this.tradeType;
    }

    get getShares() {
        return this.shares;
    }

    update(obj) {
        if("newShares" in obj){
            this.shares = obj.newShares
        }
        if("newTradeType" in obj){
            this.tradeType = obj.newTradeType
        }
        return 1
    }
}


module.exports = {
    Trade
}
