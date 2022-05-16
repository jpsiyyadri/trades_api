## Trades API Doc
Hosted on AWS EC2 available at http://65.1.147.223

- Security will have tickerSymbol, avgBuyPrice, shares as paramaters
- Trade will have tickerSymbol, shares, price, tradeType as parameters

- PUT req of security should have a prefix new example: newTickerSymbol, nweAvgBuyPrice, newShares
- PUT req of trade should have a prefix new example: newTickerSymbol, newShares, newPrice, newTradeType

- shares: should be a positive number
- price: should be a non negative real number
- tradeType: should be BUY or SELL

- 400 (Bad request): for any invalid input paramaters
- 200 : for a succesfull request

### GET /portfolio
Fetch aggregated view of securities
```
    curl --location --request GET '65.1.147.223/portfolio/'
```

### GET /portfolio/returns
Fetch returns of securities
```
    curl --location --request GET '65.1.147.223/portfolio/returns'
```

### GET /portfolio/load
Load portfolio from json files
```
    curl --location --request GET '65.1.147.223/portfolio/load'
```

### GET /portfolio/unload
Reset to empty portfolio
```
    curl --location --request GET '65.1.147.223/portfolio/unload'
```

### GET /portfolio/save
Save portfolio into files
```
    curl --location --request GET '65.1.147.223/portfolio/save'
```


### GET /portfolio/securities
Fetch all securities
```
    curl --location --request GET '65.1.147.223/portfolio/securities'
```

### POST /portfolio/securities
Add a new security
```
    curl --location --request POST '65.1.147.223/portfolio/securities/' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "tickerSymbol": "GODREJIN",
        "shares": 10,
        "avgBuyPrice": 1000
    }'
```

### GET /portfolio/securities/:tickerSymbol
Fetch only specific security
```
    curl --location --request GET '65.1.147.223/portfolio/securities/GODREJIN'
```

### PUT /portfolio/securities/
Update a security
```
    curl --location --request PUT '65.1.147.223/portfolio/securities/' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "tickerSymbol": "GODREJIN",
        "newShares": 20,
        "newAvgBuyPrice": 500
    }'
```

### DELETE "/portfolio/securities/:tickerSymbol"
Delete a security
```
    curl --location --request DELETE '65.1.147.223/portfolio/securities/GODREJIN'
```

### GET /portfolio/trades
Fetch all trades
```
    curl --location --request GET '65.1.147.223/portfolio/trades'
```

### POST /portfolio/trades
Add a new trade
```
    curl --location --request POST '65.1.147.223/portfolio/trades' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "tickerSymbol": "WIPRO",
        "tradeType": "BUY",
        "shares": 50,
        "price": 1000
    }'
```

### GET /portfolio/trades/:tradeID
Fecth only specific trade
```
    curl --location --request GET '65.1.147.223/portfolio/trades/WIPRO_0'
```

### PUT /portfolio/trades
Update a trade
```
    curl --location --request PUT '65.1.147.223/portfolio/trades/' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "tradeID": "TCS_0",
        "newTradeType": "SELL",
    }'
```

### DELETE("/portfolio/trades/:tradeID"
Delete a trade
```
    curl --location --request DELETE '65.1.147.223/portfolio/trades/TCS_0' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "tradeID": "TCS_0",
        "newTradeType": "SELL",
        "Shares": 5,
        "price": 100
    }'
```
