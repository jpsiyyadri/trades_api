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

    getTrade (tradeID) {        
        var found = this.trades.find((obj) => obj.getTradeID == tradeID)
        if(found) return [found]
        else return []
    }

    findSecTrades({ tradeID }) {
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

    // create a new trade and add it to that security trades
    addTrade (tradeID, shares, price, tradeType) {
        this.trades.push(new Trade(tradeID, shares, price, tradeType))
    }

    // buy shares with a trade
    buyShares ({ shares, price, tradeID }) {
        /*
            update avgBuyPrice using the formula
            add the shares to this.shares
        */
        if (shares <= 0 || price < 0 ) return -1
        this.avgBuyPrice = parseFloat(
            (
                (
                    (this.avgBuyPrice * this.shares) + (shares * price)
                ) / (this.shares + shares)
            ).toFixed(2)
        )
        this.shares += shares;
        tradeID = tradeID ? tradeID : this.tickerSymbol + "_" + this.trades.length            
        this.addTrade(tradeID, shares, price, "BUY")
        return 1;
    }

    // sell shares with trade
    sellShares ({ shares, tradeID }) {
        /*
            if security has the shares asked to be sold
                - subtract the shares from this.shares
                - return 1
            else
                return -1
        */
        if (shares > 0 && this.shares >= shares) {
            this.shares -= shares;
            tradeID = tradeID ? tradeID : this.tickerSymbol + "_" + this.trades.length            
            this.addTrade(
                tradeID, shares, this.avgBuyPrice, "SELL"
            )
            return 1
        }
        return -1;
    }

    // remove a trade from security
    removeTrade ({ tradeID }) {
        /*
            Remove trade
                if tradeType == BUY
                    - add the shares in that trade to this.shares
                    - revert the avgBuyPrice by using the formula
                if tradeType == SELL
                    - subtract the shares in that trade from this.shares
        */
        if (this.trades.length > 0) {
            // get the trade to remove
            var removeTrade = this.trades.filter((obj) => obj.getTradeID == tradeID)
            // remove it from all trades of that security
            this.trades = this.trades.filter((obj) => obj.getTradeID != tradeID)
            if(removeTrade.length > 0){
                removeTrade = removeTrade[0]
                var shares = removeTrade.getShares
                if(removeTrade.getTradeType == "BUY"){
                    // reset to old avgBuyPrice
                    this.avgBuyPrice = parseFloat(
                        (
                            (
                                (this.avgBuyPrice * (this.shares)) - (shares * removeTrade.getPrice)
                            ) / (this.shares-shares)
                        ).toFixed(2)
                    )
                    // deduct the purchased shares
                    this.shares -= shares
                }
                if(removeTrade.getTradeType == "SELL"){
                    // add the sold shares back
                    this.shares += shares
                }
                return {"status": 1, "removedTrade": removeTrade} 
            }
        }
        return {"status": -1, "removedTrade": null}
    }

    // update trade in a security
    updateSecTrade ( tradeID, updateObj ) {
        var findTradeID = this.getTrade(tradeID)
        if(findTradeID.length) {
            updateObj["tradeID"] = tradeID
            var tradeType = updateObj["newTradeType"] || findTradeID[0].tradeType
            var {status, removedObj} = this.removeTrade({"tradeID": tradeID})
            updateObj["shares"] = updateObj["newShares"] || findTradeID[0]["shares"]
            updateObj["price"] = updateObj["newPrice"] || findTradeID[0]["price"]
            if(status == 1 && ("newTradeType" in updateObj || "newShares" in updateObj || "newPrice" in updateObj)){
                var updated = -1
                if(tradeType == "BUY") {
                    updated = this.buyShares(updateObj)
                    if(updated != 1){
                        this.trades.push(removedObj)
                        return -102
                    }
                }
                if(tradeType == "SELL") {
                    updated = this.sellShares(updateObj)
                    if(updated != 1){
                        this.trades.push(removedObj)
                        return -101
                    }
                }
                return updated;
            }
        }
        return -1
    }

    // update security
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
