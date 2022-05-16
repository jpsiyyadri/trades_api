var expect = require("chai").expect

describe("Portfolios", () => {
    var portfoliosObj = new Portfolio()
    it("initialize", function () {
        expect(portfoliosObj).to.be.an.instanceOf(Portfolios)
        expect(portfoliosObj).to.have.property("securities", [])
    })

    it("Add securities to portfolio", function () {
        portfoliosObj.addSecurity({"tickerSymbol": "TCS", "shares": 5, "avgBuyPrice": 1833.45})
        portfoliosObj.addSecurity({"tickerSymbol": "WIPRO","shares": 10, "avgBuyPrice": 319.25})
        portfoliosObj.addSecurity({"tickerSymbol": "GODREJIND","shares": 2, "avgBuyPrice": 535.00})
        expect(portfoliosObj.getSecuritiesList()).to.have.lengthOf(3)
    })

    it("Buy shares and add to trades", function () {
        portfoliosObj.makeATrade("WIPRO", {"shares": 10, "trade": "BUY"})
        var tmpSecurityObj = portfoliosObj.getSecurity({"tickerSymbol": "WIPRO"})
        expect(tmpSecurityObj).to.have("shares", 15)
    })

    it("Update securities from portfolio", function () {
        portfoliosObj.addTrade({"shares": 5, "tickerSymbol": "GODREJIND", "price": 0, "tradeType": "BUY"})
        expect(tmpSecurityObj).to.have("shares", 50)
    })

    it("Remove trades from portfolio", function () {
        portfoliosObj.removeTrade("WIPRO-U", "BUY")
        expect(portfoliosObj.getSecuritiesList()).to.have.lengthOf(1)
    })

    it("Remove securities from portfolio", function () {
        portfoliosObj.removeSecurity("WIPRO-U")
        expect(portfoliosObj.getSecuritiesList()).to.have.lengthOf(1)
    })

    it("Sell securities from portfolio", function () {
        portfoliosObj.makeATrade("TCS", {"shares": 5, "trade": "SELL"})
        var tmpSecurityObj = portfoliosObj.getSecurity({"tickerSymbol": "WIPRO"})
        expect(tmpSecurityObj).to.have("shares", 0)
    })

    it("Fetch trades from portfolio", function () {
        var tmpTradesObj = portfoliosObj.getTrades()
        expect(tmpTradesObj).to.have.lengthOf(3)
    })
    it("Fetch returns from portfolio", function () {
        var tmpReturnssObj = portfoliosObj.getReturns()
        expect(tmpReturnssObj).to.be.equal()
    })
})
