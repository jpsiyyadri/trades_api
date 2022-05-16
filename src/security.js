const { Trade } = require("./trade")

class Security {
    constructor (tickerSymbol, avgBuyPrice, shares) {
        this.tickerSymbol = tickerSymbol;
        this.avgBuyPrice = avgBuyPrice;
        this.shares = shares;
        this.currentPrice = 100; // set setto a default value
        this.trades = [];
        this.originalPrice = avgBuyPrice;
    }

    get getTickerSymbol () {
        return this.tickerSymbol;
    }

    get getAvgBuyPrice () {
        return this.avgBuyPrice;
    }

    get getShares () {
        return this.shares;
    }

    get getCurrentPrice () {
        return this.currentPrice;
    }

    get getOriginalPrice () {
        return this.originalPrice;
    }

    get getSecTrades() {
        return this.trades;
    }

    findSecTrades({ tradeID }) {
        console.log("findSecTrades", this.trades)
        var found = this.trades.find((obj) => obj.getTradeID == tradeID)
        if(found) return [found]
        else return []
    }

    set setTickerSymbol (val) {
        this.tickerSymbol = val;
        return 1;
    }

    set setAvgBuyPrice (val) {
        this.avgBuyPrice = val;
        return 1;
    }

    set setShares (val) {
        this.shares = val;
        return 1;
    }

    set setCurrentPrice (val) {
        this.currentPrice = val;
        return 1;
    }

    addTrade (tradeID, shares, price, tradeType) {
        this.trades.push(new Trade(tradeID, shares, price, tradeType))
    }

    buyShares ({ shares, price, tradeID }) {
        if (shares <= 0 || price < 0 ) return -1
        this.avgBuyPrice = parseFloat(
            (
                (
                    (this.avgBuyPrice * this.shares) + (shares * price)
                ) / (this.shares + shares)
            ).toFixed(2)
        )
        this.shares += shares;
        console.log(tradeID, ">>>")
        tradeID = tradeID ? tradeID : this.tickerSymbol + "_" + this.trades.length            
        var newTrade = new Trade(tradeID, shares, price, "BUY")
        this.trades.push(newTrade)
        return 1;
    }

    sellShares ({ shares, tradeID }) {
        console.log("in sell shares ", shares, this.shares, tradeID)
        if (shares > 0 && this.shares >= shares) {
            this.shares -= shares;
            tradeID = tradeID ? tradeID : this.tickerSymbol + "_" + this.trades.length            
            var newTrade = new Trade(
                tradeID, shares, this.avgBuyPrice, "SELL"
            )
            this.trades.push(newTrade)
            console.log("out sell ", this.trades)
            return 1
        }
        return -1;
    }

    sellBoughtShares ({ shares, tradeID }) {
        console.log("in sell bought shares ", shares, this.shares, tradeID)
        if (shares > 0) {
            tradeID = tradeID ? tradeID : this.tickerSymbol + "_" + this.trades.length            
            var newTrade = new Trade(
                tradeID, shares, this.avgBuyPrice, "SELL"
            )
            this.trades.push(newTrade)
            console.log("out sell bought shares ", this.trades)
            return 1
        }
        return -1;
    }

    removeTrade ({ tradeID }) {
        console.log("in removetrade")
        if (this.trades.length > 0) {
            // get the trade to remove
            var removeTrade = this.trades.filter((obj) => obj.getTradeID == tradeID)
            // remove it from all trades of that security
            console.log(tradeID)
            this.trades = this.trades.filter((obj) => obj.getTradeID != tradeID)
            if(removeTrade.length > 0){
                removeTrade = removeTrade[0]
                var shares = removeTrade.getShares
                if(removeTrade.getTradeType == "BUY"){
                    console.log("remove trade buy ", this)
                    // reset to old avgBuyPrice
                    this.avgBuyPrice = parseFloat(
                        (
                            (
                                (this.avgBuyPrice * (this.shares+shares)) - (shares * removeTrade.getPrice)
                            ) / (this.shares)
                        ).toFixed(2)
                    )
                    // deduct the purchased shares
                    this.shares -= shares
                }
                if(removeTrade.getTradeType == "SELL"){
                    // add the sold shares back
                    this.shares += shares
                }
                console.log("out removetrade ", this)
                return 1
            }
        }
        return -1
    }

    getTrade (tradeID) {        
        var found = this.trades.find((obj) => obj.getTradeID == tradeID)
        if(found) return [found]
        else return []
    }

    updateSecTrade ( tradeID, updateObj ) {
        var findTradeID = this.getTrade(tradeID)
        if(findTradeID.length) {
            updateObj["tradeID"] = tradeID
            var tradeType = updateObj["newTradeType"] || findTradeID[0].tradeType
            var removed = this.removeTrade({"tradeID": tradeID})
            if(removed == 1 && "newTradeType" in updateObj || "newShares" in updateObj || "newPrice" in updateObj){
                updateObj["shares"] = updateObj["newShares"] || findTradeID[0]["shares"]
                updateObj["price"] = updateObj["newPrice"] || findTradeID[0]["shares"]
                var updated = -1
                if(tradeType == "BUY") {
                    updated = this.buyShares(updateObj)
                }
                if(tradeType == "SELL") {
                    console.log(tradeType, updated)
                    updated = this.sellBoughtShares(updateObj)
                }
                return updated;
            }
        }
        return -1
    }

    update( updateObj ) {
        if(updateObj.newShares) {
            this.shares = updateObj["newShares"]
        }
        if(updateObj.newAvgBuyPrice) {
            this.avgBuyPrice = updateObj["newAvgBuyPrice"]
        }
        return 1;
    }
}


module.exports = {
    Security
};
