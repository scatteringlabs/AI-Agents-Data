interface fetchTradesParams {
  network: string;
  pool: string;
}

export const fetchTrades = async ({ network, pool }: fetchTradesParams) => {
  const response = await fetch(
    `https://api.geckoterminal.com/api/v2/networks/${network}/pools/${pool}/trades`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    },
  );
  const data = await response.json();
  return data?.data?.map((item: any) => ({
    ...item.attributes,
    id: item.id,
  }));
};

export interface TokenPrices {
  [address: string]: string;
}

interface SimpleTokenPriceAttributes {
  token_prices: TokenPrices;
}

interface SimpleTokenPriceData {
  id: string;
  type: string;
  attributes: SimpleTokenPriceAttributes;
}

interface SimpleTokenPriceResponse {
  data: SimpleTokenPriceData;
}

export async function fetchTokenPrices(
  network: string,
  address: string,
): Promise<TokenPrices> {
  const url = `https://api.geckoterminal.com/api/v2/simple/networks/${network}/token_price/${address}`;
  const response = await fetch(url, {
    headers: {
      accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }

  const result: SimpleTokenPriceResponse = await response.json();
  return result.data.attributes.token_prices;
}
