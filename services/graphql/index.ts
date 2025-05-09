export const graphql_endpoint =
  "https://subgraph.satsuma-prod.com/195aaf37794c/link--75366/scr-launchpad-bmo/api";

export const the_graphql_endpoint =
  "https://subgraph.satsuma-prod.com/195aaf37794c/link--75366/scr-launchpad-bmo/api";
// export const the_graphql_endpoint =
//   "https://api.studio.thegraph.com/query/25139/scr-launchpad-bmo/version/latest";

interface GraphQLRequestPayload {
  query: string;
  variables?: Record<string, any>;
}

export const fetchGraphQL = async <T>(
  payload: GraphQLRequestPayload,
): Promise<T> => {
  const response = await fetch(graphql_endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const json = await response.json();
  if (response.ok && !json.errors) {
    return json.data;
  } else {
    throw new Error(
      json.errors ? json.errors[0].message : "GraphQL request failed",
    );
  }
};
export const fetchTheGraphQL = async <T>(
  payload: GraphQLRequestPayload,
): Promise<T> => {
  const response = await fetch(the_graphql_endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const json = await response.json();
  if (response.ok && !json.errors) {
    return json.data;
  } else {
    throw new Error(
      json.errors ? json.errors[0].message : "GraphQL request failed",
    );
  }
};
