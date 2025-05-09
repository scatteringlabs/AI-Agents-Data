const API_URL = "https://api.zora.co/graphql";

export const fetchZoraGraphQL = async <T>(query: string): Promise<T> => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    throw new Error(`Error fetching data: ${response.statusText}`);
  }

  const result = await response.json();

  if (result.errors) {
    throw new Error(
      `GraphQL errors: ${result.errors.map((e: any) => e.message).join(", ")}`,
    );
  }

  return result.data;
};
