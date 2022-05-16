var expect = require("chai").expect;
const { Security }  = require("../src/security")

// Test Suite
describe('Securities', function (){
    // Test spec (unit test)
    var obj = new Security("TCS", 200, 3);
    it('initialize securities', function (){
        expect(obj).to.be.an.instanceOf(Security)
        expect(obj).to.have.property('tickerSymbol', 'TCS');
        expect(obj).to.have.property('avgBuyPrice', 200);
        expect(obj).to.have.property('shares', 3);
        expect(obj).to.have.property('currentPrice', 100);
        expect(obj.trades).to.be.an('array').that.is.empty;
    })

    it('update securities', function (){
        obj.setTickerSymbol = "TCS-I"
        obj.setAvgBuyPrice = 535
        obj.setShares = 2
        obj.setCurrentPrice = 200
        expect(obj).to.have.property('tickerSymbol', "TCS-I");
        expect(obj).to.have.property('avgBuyPrice', 535);
        expect(obj).to.have.property('shares', 2);
        expect(obj).to.have.property('currentPrice', 200);
    })

    it('buy shares', function () {
        obj.buyShares({"shares": 5, "price": 400})
        expect(obj).to.have.property('avgBuyPrice', 438.57);
        expect(obj.trades).to.have.lengthOf(1);
        expect(obj.trades[0]).to.have.property("tradeType", "BUY");
    })

    it('sell shares', function () {
        var resp = obj.sellShares({ "shares": 5 });
        expect(obj).to.have.property('avgBuyPrice', 438.57);
        expect(obj).to.have.property('shares', 2);
        expect(obj.trades).to.have.lengthOf(2);
        expect(obj.trades[1]).to.have.property("tradeType", "SELL");
        expect(resp).to.be.equal(1);
        // if try to sell more than the shares u have
        resp = obj.sellShares({ "shares": 5 });
        expect(resp).to.be.equal(-1);
    })

    it("show all trades", function () {
        var tradesList = obj.trades
        expect(tradesList).to.be.lengthOf(2)
        expect(tradesList).to.not.be.empty;
        expect(tradesList[0]).to.have.includes({"tradeID": "TCS-I_0"})
        expect(tradesList[1]).to.have.includes({"tradeID": "TCS-I_1"})
    })

    it("remove trades", function () {
        var deleted = obj.removeTrade({"tradeID": "TCS-I_0"})
        expect(deleted).not.to.be.equal(-1)
        var tradesList = obj.getTrades
        expect(tradesList).to.be.lengthOf(1)
        expect(tradesList).to.not.be.empty;
        expect(tradesList[0]).to.have.includes({"tradeID": "TCS-I_1"})
        expect(obj.getAvgBuyPrice).to.be.within(534.5,535.5)
    })
})
