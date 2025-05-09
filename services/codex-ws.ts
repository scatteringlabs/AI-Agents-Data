import { useEffect, useState } from "react";

interface EventData {
  address: string;
  baseTokenPrice: string;
  blockNumber: number;
  eventDisplayType: string;
  eventType: string;
  id: string;
  liquidityToken: string;
  logIndex: number;
  maker: string;
  timestamp: number;
  token0ValueBase: string;
  token1ValueBase: string;
  transactionHash: string;
  transactionIndex: number;
  quoteToken: string;
  data: any; // 如果有具体结构，可以进一步定义
}
function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

interface UseWebSocketEventsParams {
  id: string;
  quoteToken: string;
}
const DEFINED_API_KEY = "37c7834746a273a1291b8cdd83c976fdcd97a014";

// const apiParams: FetchTokenEventsParams = {
//   query: {
//     address: "5BS8zEbiqgLQdDdKT42mdkEJKirh5jphFCoSkBT5bnye",
//     networkId: 1399811149,
//     quoteToken: "token1",
//   },
//   limit: 30,
//   direction: "DESC",
// };
// const wsParams = {
//   id: "5BS8zEbiqgLQdDdKT42mdkEJKirh5jphFCoSkBT5bnye",
//   quoteToken: "token1",
// };
// const events = useWebSocketEvents(wsParams);
// console.log("events", events);
const useWebSocketEvents = ({ id, quoteToken }: UseWebSocketEventsParams) => {
  const [events, setEvents] = useState<EventData[]>([]);

  useEffect(() => {
    const fetchToken = async () => {
      const webSocket = new WebSocket(
        `wss://realtime-api.defined.fi/graphql`,
        "graphql-transport-ws",
      );

      webSocket.onopen = () => {
        console.log("WebSocket opened");
        webSocket.send(
          JSON.stringify({
            type: "connection_init",
            payload: {
              Authorization: DEFINED_API_KEY,
            },
          }),
        );
      };

      webSocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const myUUID = generateUUID();

        if (data.type === "connection_ack") {
          webSocket.send(
            JSON.stringify({
              id: myUUID,
              type: "subscribe",
              payload: {
                variables: {
                  id,
                  quoteToken,
                },
                extensions: {},
                operationName: "GetTokenEvents",
                query: `subscription GetTokenEvents($id: String, $quoteToken: QuoteToken) {
                  onEventsCreated(id: $id, quoteToken: $quoteToken) {
                    address
                    id
                    networkId
                    events {
                      address
                      baseTokenPrice
                      blockNumber
                      eventDisplayType
                      eventType
                      id
                      liquidityToken
                      logIndex
                      maker
                      timestamp
                      token0ValueBase
                      token1ValueBase
                      transactionHash
                      transactionIndex
                      quoteToken
                      labels {
                        sandwich {
                          label
                          sandwichType
                          token0DrainedAmount
                          token1DrainedAmount
                          __typename
                        }
                        __typename
                      }
                      data {
                        __typename
                        ... on BurnEventData {
                          amount0
                          amount1
                          amount0Shifted
                          amount1Shifted
                          type
                          __typename
                        }
                        ... on MintEventData {
                          amount0
                          amount1
                          amount0Shifted
                          amount1Shifted
                          type
                          __typename
                        }
                        ... on PoolBalanceChangedEventData {
                          amount0
                          amount1
                          amount0Shifted
                          amount1Shifted
                          type
                          __typename
                        }
                        ... on SwapEventData {
                          amount0In
                          amount0Out
                          amount1In
                          amount1Out
                          amount0
                          amount1
                          amountNonLiquidityToken
                          priceUsd
                          priceUsdTotal
                          priceBaseToken
                          priceBaseTokenTotal
                          type
                          __typename
                        }
                      }
                      __typename
                    }
                    __typename
                  }
                }`,
              },
            }),
          );
        } else if (data.type === "data") {
          setEvents((prevEvents) => [
            ...prevEvents,
            ...data.payload.data.onEventsCreated.events,
          ]);
        }
      };

      webSocket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      webSocket.onclose = () => {
        console.log("WebSocket closed");
      };

      return () => {
        webSocket.close();
      };
    };

    fetchToken();
  }, [id, quoteToken]);

  return events;
};

export default useWebSocketEvents;
