interface TraitValue {
  value: string;
  itemTotal: number;
}

interface TraitKey {
  traitType: string;
  traitUniqueValues: number;
  valueType: number;
  maxValue: number;
  minValue: number;
}

interface Trait {
  key: TraitKey;
  values: TraitValue[];
}

interface TraitDetail {
  floorPrice: number;
  image: string;
  mint: string;
  count: number;
  traitCount: number;
  totalRarity: number;
}

interface NestedTraitData {
  [traitType: string]: {
    [traitValue: string]: TraitDetail;
  };
}

export const convertToNestedTraitFormat = (data: NestedTraitData): Trait[] => {
  if (!data) {
    return [];
  }
  return Object.keys(data).map((traitType) => ({
    key: {
      traitType: traitType,
      traitUniqueValues: Object.keys(data[traitType]).length,
      valueType: 0,
      maxValue: 0,
      minValue: 0,
    },
    values: Object.keys(data[traitType]).map((traitValue) => ({
      value: traitValue,
      itemTotal: data[traitType][traitValue].count,
    })),
  }));
};
export async function fetchFloorTraits(slug: string): Promise<any> {
  const url = `https://api.scattering.io/sol-nft-api/v1/collections/${slug}/floor_traits`;
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}
// export const convertToTraitFormat = (data: TraitData): Trait[] => {
//   return Object.keys(data).map((trait) => ({
//     key: {
//       traitType: trait,
//       traitUniqueValues: Object.keys(data).length,
//       valueType: 0,
//       maxValue: 0,
//       minValue: 0,
//     },
//     values: [
//       {
//         value: trait,
//         itemTotal: data[trait].traitCount,
//       },
//     ],
//   }));
// };

// Example data
// const traitData: TraitData = {
//   Turquoise: {
//     floorPrice: 0.399999999,
//     image:
//       "https://assets.pinit.io/FADeYLKV1tWgX3pP9boaiF9Qt2vbGfXm3QuEoqCmRPH3/84048cd6-198e-4ec2-b6a0-83f54dbbcf5c/4520",
//     mint: "4s66pfoEoWGfHCAzAuLAZYtJyps1fJjxkANbsFDRoJty",
//     count: 129,
//     traitCount: 1894,
//     totalRarity: 0.1894,
//   },
//   Yellow: {
//     floorPrice: 0.4,
//     image:
//       "https://assets.pinit.io/FADeYLKV1tWgX3pP9boaiF9Qt2vbGfXm3QuEoqCmRPH3/84048cd6-198e-4ec2-b6a0-83f54dbbcf5c/9718",
//     mint: "yJY4zw6LLPtH75voJDgyrEwLP9atLq5Y5gEzMx3Bv8n",
//     count: 60,
//     traitCount: 881,
//     totalRarity: 0.0881,
//   },
//   // ... more data
// };

// const formattedTraits = convertToTraitFormat(traitData);
// console.log(formattedTraits);
