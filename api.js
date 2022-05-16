const express = require("express");
const { Portfolio } = require("./src/portfolio.js")
var bodyParser = require('body-parser');

const port = 3000;
const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

var portfolio = new Portfolio()

// fetch aggregate view of all securities
app.get("/portfolio", (req, res) => {
    res.status(200).json(portfolio.fethPortfolio())
})

// fetch returns
app.get("/portfolio/returns", (req, res) => {
    res.status(200).status(200).json({ "val": portfolio.fetchReturns() })
})

// load saved data from JSON files
app.get("/portfolio/load", (req, res) => {
    portfolio.loadSecuritiesFromJSON()
    res.json(portfolio.getSecurities)
})

// save the data into files
app.get("/portfolio/save", (req, res) => {
    portfolio.writeSecuritiesToJSON()
    res.status(200).json(portfolio.getSecurities)
})

// reset to empty trades and securities
app.get("/portfolio/unload", (req, res) => {
    portfolio = new Portfolio()
    res.status(200).send(portfolio.getSecurities)
})

// fetch securities
app.get("/portfolio/securities", (req, res) => {
    res.status(200).send(portfolio.getSecurities)
})

// fetch a specific security
app.get("/portfolio/securities/:tickerSymbol", (req, res) => {
    res.status(200).json(portfolio.getSecurity(req.params))
})

// add securities
app.post("/portfolio/securities", (req, res) => {
    var params = req.body
    if (!params.tickerSymbol || !params.shares || !params.avgBuyPrice) {
        return res.status(400).json({ msg: 'Please include a tickerSymbol and shares and avgBuyPrice' });
    }
    if(parseFloat(params.shares) < 1 || parseFloat(params.avgBuyPrice) < 1){
        return res.status(400).json({ msg: 'Please include a positive and shares and avgBuyPrice' });
    }
    portfolio.addSecurity = params
    res.status(200).json(portfolio.getSecurities);
})

// update security
app.put("/portfolio/securities/", (req, res) => {
    var params = req.body
    if (!params.tickerSymbol) {
        return res.status(400).json({ msg: 'Please include a tickerSymbol and shares and avgBuyPrice' });
    }
    if((params.newShares && parseFloat(params.newShares) < 1 ) || (params.newAvgBuyPrice && parseFloat(params.avgBuyPrice) < 1)){
        return res.status(400).json({ msg: 'Please include a positive and newShares and newAvgBuyPrice' });
    }
    portfolio.updateSecurity({"tickerSymbol": params.tickerSymbol, "updateObj": params})
    res.status(200).json(portfolio.getSecurities);
})

// delete security
app.delete("/portfolio/securities/:tickerSymbol", (req, res) => {
    var params = req.params
    if (!params.tickerSymbol) {
        return res.status(400).json({ "msg": 'Please include a tickerSymbol' });
    }
    portfolio.removeSecurity(params)
    res.status(200).json(portfolio.getSecurities);
})

// fetch all trades
app.get("/portfolio/trades", (req, res) => {
    res.status(200).send(portfolio.getTrades)
})

// fetch a specific trade
app.get("/portfolio/trades/:tradeID", (req, res) => {
    res.status(200).json(portfolio.getTrade(req.params))
})

// add new trade
app.post("/portfolio/trades", (req, res) => {
    var params = req.body
    if (!params.tickerSymbol || !params.shares || !params.price  || !params.tradeType) {
        return res.status(400).json({ msg: 'Please include a tickerSymbol and shares and price' });
    }
    if(parseFloat(params.shares) < 1 || parseFloat(params.price) < 1 || !["BUY", "SELL"].includes(params.tradeType)){
        return res.status(400).json({ msg: 'Please include a positive and shares and price tradeType as BUY or SELL' });
    }

    var found = portfolio.addTrade(params)
    if(found == -1){
        return res.status(400).json({ msg: "Invalid tickerSymbol " + params.tickerSymbol + " or shares are insufficient"})
    }
    res.status(200).json(portfolio.getTrades);
})

// update a trade
app.put("/portfolio/trades", (req, res) => {
    var params = req.body
    if (!params.tradeID) {
        return res.status(400).json({ msg: 'Please include a tradeID' });
    }
    if((params.newShares && parseFloat(params.newShares) < 1) || (params.newPrice && parseFloat(params.newPrice) < 1) || 
        (params.newTradeType && ["BUY", "SELL"].includes(params.newTradeType))){
        return res.status(400).json({ msg: 'Please include a positive and shares and price tradeType as BUY or SELL' });
    }
    var updated = portfolio.updateTrade({"tradeID": params.tradeID, "updateObj": params})
    if(updated == -1){
        return res.status(400).json({"msg": "Invalid input parameters"})
    }
    console.log("api.js > ", portfolio.getTrades)
    res.status(200).json(portfolio.getTrades);
})

// delete a trade
app.delete("/portfolio/trades/:tradeID", (req, res) => {
    var params = req.params
    if (!params.tradeID) {
        return res.status(400).json({ "msg": 'Please include a tickerSymbol and shares and avgBuyPrice' });
    }
    portfolio.removeTrade(params)
    res.status(200).json(portfolio.getTrades);
})


app.get("/", (req, res) => {
    res.status(200).send("Hello, welcome to trades api...")
})

app.listen(port, function() {
    console.log("Node is runing on Port 3000...!")
})
