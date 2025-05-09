import { fetchKlineData } from "@/services/graphql/k-line";
let i = 1;

class MyCustomDataFeed {
  constructor(
    tokenAddress,
    network,
    // setTokenPrice,
    // currency,
    setTradingViewLoading,
    pricescale,
  ) {
    this.tokenAddress = tokenAddress;
    // this.setTokenPrice = setTokenPrice;
    this.network = network;
    // this.currency = currency;
    this.setTradingViewLoading = setTradingViewLoading;
    this.pricescale = pricescale;
    this.barsUpdater = null;
    this.subscribers = new Map(); // 存储实时更新的订阅者
  }

  onReady(callback) {
    callback({
      supported_resolutions: ["1", "15", "60", "1D"],
      supports_time: true,
    });
  }
  setBarsUpdater(updater) {
    this.barsUpdater = updater;
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
      session: "0000-2400:1234567",
      has_intraday: true,
      has_no_volume: true,
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
    let priceType;
    // 根据 resolution 设置 priceType
    if (resolution === "1") priceType = "1m";
    else if (resolution === "15") priceType = "1m";
    else if (resolution === "60") priceType = "1h";
    else if (resolution === "1D") priceType = "1d";

    try {
      this.setTradingViewLoading(true);
      // 使用 GraphQL 接口获取 K 线数据
      const data = await fetchKlineData(this.tokenAddress, priceType);

      this.setTradingViewLoading(false);
      const bars = [];
      if (data && data.tokenEntities.length > 0) {
        const tokenEntity = data.tokenEntities[0];

        // 提取价格数据
        if (tokenEntity.prices.length > 0) {
          const _prices = tokenEntity.prices;
          // const latestPrice = _prices?.[0]?.closePrice;
          // if (latestPrice) {
          //   this.setTokenPrice(Number(latestPrice));
          // }

          // 构建 K 线图数据
          for (let i = _prices.length - 1; i >= 0; i--) {
            const el = _prices[i];
            const timestamp = Number(el.timestamp);
            // console.log("timestamp", timestamp);
            // console.log("from", from);
            // console.log("to", to);

            if (timestamp >= from && timestamp <= to) {
              bars.push({
                time: timestamp * 1000, // 转换为毫秒
                open: Number(el.openPrice),
                high: Number(el.maxPrice),
                low: Number(el.minPrice),
                close: Number(el.closePrice),
                volume: 0, // 假设 volume 数据不可用
              });
            }
          }
        }
      }
      if (bars.length) {
        onHistoryCallback(bars, { noData: false });
      } else {
        onHistoryCallback([], { noData: true });
      }
    } catch (error) {
      console.log("error", error);

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
  ) {
    // 订阅数据变化时，将回调添加到 subscribers
    this.subscribers.set(subscriberUID, onRealtimeCallback);
    // 存储回调以便在 refreshData 调用时能更新数据
    this.onResetCacheNeededCallback = onResetCacheNeededCallback;
  }

  unsubscribeBars(subscriberUID) {
    this.subscribers.delete(subscriberUID);
  }

  unsubscribeBars(subscriberUID) {}
  refreshData() {
    const from = Math.floor(Date.now() / 1000) - 60 * 60;
    const to = Math.floor(Date.now() / 1000);

    this.getBars(
      { name: this.tokenAddress },
      "15",
      { from, to },
      (bars) => {
        if (bars.length) {
          for (let [uid, callback] of this.subscribers.entries()) {
            bars.forEach((bar) => {
              callback(bar);
            });
          }
        }
      },
      (error) => {
        console.error("Failed to refresh data:", error);
      },
      true,
    );
  }
}

export default MyCustomDataFeed;
