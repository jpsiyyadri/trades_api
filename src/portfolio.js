const { Security } = require("./security")
const fs = require("fs");
const { all } = require("express/lib/application");

class Portfolio { 
    constructor () {
        this.securities = []
        this.pf_trades = []
    }

    writeSecuritiesToJSON() {
        /*
            save the data into files
        */
        var all_securities = []
        var all_trades = []

        this.securities.forEach(function(sd) {
            all_securities.push({
                "tickerSymbol": sd.getTickerSymbol,
                "shares": sd.getShares,
                "avgBuyPrice": sd.getAvgBuyPrice
            })

            sd.getTrades.forEach(function(td) {
                all_trades.push({
                    "tradeID": td.getTradeID,
                    "shares": td.getShares,
                    "price": td.getPrice,
                    "tradeType": td.getTradeType
                })
            })
        })

        fs.writeFileSync("data/securities.json", JSON.stringify({"securities": all_securities}), {encoding: "utf-8"})
        fs.writeFileSync("data/trades.json", JSON.stringify({"trades": all_trades}), {encoding: "utf-8"})
    }

    loadSecuritiesFromJSON() {
        /*
            load securities and trades from data files
            keep a reference this.pf_trades to access anytime
        */
        var all_securities = JSON.parse(
                fs.readFileSync("data/securities.json", 'utf-8')
            )["securities"]

        var all_trades = JSON.parse(
                fs.readFileSync("data/trades.json", 'utf-8')
            )["trades"]

        all_securities.forEach((d) => {
            var secObj = new Security(
                d["tickerSymbol"],
                d["avgBuyPrice"],
                d["shares"]
            )


            var fltrd_trades = all_trades.filter((t) => t["tradeID"].split("_")[0] == d["tickerSymbol"])

            fltrd_trades.forEach((ft) => {
                secObj.addTrade(
                    ft["tradeID"],
                    ft["shares"],
                    ft["price"],
                    ft["tradeType"]
                )
            })
            this.pf_trades = this.pf_trades.concat(secObj.getSecTrades)
            this.securities.push(
                secObj
            )
        })
    }

    get getSecurities() {
        return this.securities;
    }

    get getTrades() {
        return this.pf_trades
    }

    getSecurity ({ tickerSymbol }) {        
        var found = this.securities.find((obj) => obj.getTickerSymbol == tickerSymbol)
        if(found) return [found]
        else return []
    }

    getTrade ({ tradeID }) {       
        var found = this.pf_trades.find((obj) => obj.getTradeID == tradeID)
        if(found) return [found]
        else return []
    }

    set addSecurity ({ tickerSymbol, shares, avgBuyPrice }) {
        /*
            Create a security object and add it to this.securities
        */
        var newSecurity = new Security(tickerSymbol, shares, avgBuyPrice);
        this.securities.push(newSecurity)
    }

    updateAllTrades(){
        this.pf_trades = []
        this.securities.forEach((d) => {
            this.pf_trades = this.pf_trades.concat(d.getSecTrades)
        })
    }

    addTrade ({ tickerSymbol, shares, tradeType, price }) {
        /*
            validate whether the security exists or not
            if a valid security
                if trade type is SELL
                    check the no.of shares available or not
                    if shares available sell them else return -1
                if trade type is BUY
                    update the security object
            return 1 if successfully added else return -1
        */
        var findSecurity = this.getSecurity({"tickerSymbol" :tickerSymbol})
        if(findSecurity.length){
            var newTrade = -1;
            if(tradeType == "SELL") {
                newTrade = findSecurity[0].sellShares({ "shares": shares })
            }
            if (tradeType == "BUY") { 
                newTrade = findSecurity[0].buyShares({ "shares": shares, "price": price })
            }
            if(newTrade == 1) {
                this.updateAllTrades()
                return 1
            }
        }
        return -1
    }

    removeSecurity({ tickerSymbol }) {
        this.securities = this.securities.filter((d) => d["tickerSymbol"] != tickerSymbol)
    }

    removeLatestTrade({ tickerSymbol }) {
        /*
            validate whether the security exists or not
            if a valid security
            remove the latest trade from the security
            return trade if successfull else return []

        */
        var findSecurity = this.getSecurity({"tickerSymbol" : tickerSymbol})
        if(findSecurity.length){
            return findSecurity[0].removeTrade()
        } else {
            return [];
        }
    }

    removeTrade({ tradeID }) {
        /*
            validate whether the security exists or not
            if a valid security
            remove the latest trade from the security
            return trade if successfull else return []

        */
       var findSecurityObj = this.getSecurity({"tickerSymbol": tradeID.split("_")[0]})
       if(findSecurityObj.length > 0){
           this.pf_trades = this.pf_trades.filter((d) => d["tradeID"] != tradeID)
           return findSecurityObj[0].removeTrade({ "tradeID": tradeID })
       }
       return -1;
    }


    updateTrade({ tradeID, updateObj }) {
        if(tradeID.length > 0 ) {
            console.log("inn update trade")
            // update at security level
            var tickerSymbol = tradeID.split("_")[0]
            var findSecurity = this.getSecurity({"tickerSymbol" :tickerSymbol})
            console.log("jp", findSecurity)
            var updated = findSecurity[0].updateSecTrade(tradeID, updateObj)
            if(findSecurity.length && updated == 1){
                //  update the current list
                console.log("great", this.pf_trades, tradeID)
                var updtdTrade = findSecurity[0].findSecTrades({"tradeID": tradeID})
                console.log("hee", updtdTrade)
                if(updtdTrade.length){
                    this.pf_trades = this.pf_trades.filter((d) => d["tradeID"] != tradeID)
                    this.pf_trades.push(updtdTrade[0])
                    return 1
                }
            }
            console.log("out update Trade", updated)
            return updated
        }
        return -1
    }

    updateSecurity({ tickerSymbol, updateObj }) {
        if(tickerSymbol.length > 0 ) {
            var findSecurity = this.getSecurity({"tickerSymbol" :tickerSymbol})
            if(findSecurity.length){
                return findSecurity[0].update( updateObj )
            }
        }
        return -1
    }

    fethPortfolio() {
        var all_securities_agg = []
        this.securities.forEach((d) => {
            all_securities_agg.push({
                "tickerSymbol": d["tickerSymbol"],
                "shares": d["shares"],
                "avgBuyPrice": d["avgBuyPrice"]
            })
        })
        return all_securities_agg
    }

    fetchReturns() {
        var total_returns = 0
        this.securities.forEach((d) => {
            total_returns += ((d.getOriginalPrice - d.getAvgBuyPrice)*d.shares)
        })
        return total_returns
    }
}

module.exports = {
    Portfolio
}
