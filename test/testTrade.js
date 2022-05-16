const { expect } = require("chai")
const { Trade } = require("../src/trade.js")

describe("Trade", function(){
    var obj = new Trade("dummy", 5, 100, "BUY")
    it("initialize trade", function() {
        expect(obj).to.have.property("tradeID").to.be.a("string")
        expect(obj).to.have.property("tradeType").to.be.a("string").to.match(/BUY|SELL/);
        expect(obj).to.have.property("shares").to.be.above(0)
        expect(obj).to.have.property("price").to.be.above(0)
    })
    it("check default values", function() {
        expect(obj.getTradeID()).to.be.equal("dummy")
    })
})