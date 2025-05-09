class MyCustomDataFeed {
  constructor(
    poolAddress,
    network,
    setTokenPrice,
    currency,
    setTradingViewLoading,
    pricescale,
  ) {
    this.poolAddress = poolAddress;
    this.setTokenPrice = setTokenPrice;
    this.network = network;
    this.currency = currency;
    this.setTradingViewLoading = setTradingViewLoading;
    this.pricescale = pricescale;
  }

  onReady(callback) {
    callback({
      supported_resolutions: ["1", "5", "15", "H", "4H", "12H", "D"],
      supports_time: true,
    });
  }

  resolveSymbol(symbolName, onSymbolResolvedCallback, onResolveErrorCallback) {
    onSymbolResolvedCallback({
      name: symbolName,
      "exchange-traded": "",
      "exchange-listed": "",
      minmov: 1,
      minmov2: 0,
      pointvalue: 1,
      pricescale: this.pricescale,
      // pricescale: 1000000,
      // pricescale: 10000000000,
      session: "0000-2400:1234567",
      has_intraday: true,
      has_no_volume: false,
      // volume_pricescale: 100,
      type: "bitcoin",
    });
  }

  async getBars(
    symbolInfo,
    resolution,
    periodParams,
    onHistoryCallback,
    onErrorCallback,
    firstDataRequest,
  ) {
    const { from, to } = periodParams;
    let timeframe = "day";
    let aggregate = 1;
    if (
      resolution === "1" ||
      resolution === "5" ||
      resolution === "15" ||
      resolution === "30"
    ) {
      timeframe = "minute";
      aggregate = resolution;
    }
    if (resolution === "60") {
      timeframe = "hour";
      aggregate = 1;
    }
    if (resolution === "240") {
      timeframe = "hour";
      aggregate = 4;
    }
    if (resolution === "720") {
      timeframe = "hour";
      aggregate = 12;
    }
    if (resolution === "1D") {
      timeframe = "day";
      aggregate = 1;
    }
    try {
      this.setTradingViewLoading(true);
      const fetchURL = `https://api.geckoterminal.com/api/v2/networks/${this.network}/pools/${this.poolAddress}/ohlcv/${timeframe}?aggregate=${aggregate}&limit=1000&currency=${this.currency}&before_timestamp=${to}`;
      const response = await fetch(fetchURL);
      const responseData = await response.json();
      this.setTradingViewLoading(false);
      const bars = [];
      if (responseData && responseData.data) {
        const _data = responseData.data.attributes.ohlcv_list;
        const klineData = _data?.[0];
        if (klineData?.[4]) {
          this.setTokenPrice(Number(klineData?.[4] || 0));
          // this.setTokenPrice({
          //   value: Number(klineData?.[4] || 0),
          //   color: klineData?.[1] > klineData?.[4] ? "#FF2525" : "#00B912",
          // });
        }

        for (let i = _data.length - 1; i >= 0; i--) {
          const el = _data[i];
          if (el[0] < to) {
            bars.push({
              time: el[0] * 1000,
              open: el[1],
              high: el[2],
              low: el[3],
              close: el[4],
              volume: el[5],
            });
          }
        }
      }
      if (bars.length) {
        onHistoryCallback(bars, { noData: false });
      } else {
        onHistoryCallback([], { noData: true });
      }
    } catch (error) {
      this.setTradingViewLoading(false);
      onHistoryCallback([], { noData: true });
    }
  }

  subscribeBars(
    symbolInfo,
    resolution,
    onRealtimeCallback,
    subscriberUID,
    onResetCacheNeededCallback,
  ) {}

  unsubscribeBars(subscriberUID) {}
}

export default MyCustomDataFeed;
