import { favoritesAtom } from "@/store/atoms/favoritesAtom";
import { Collection } from "@/types/collection";
import { useAtom } from "jotai";
import { useCallback } from "react";

export const useFavorites = () => {
  const [favorites, setFavorites] = useAtom(favoritesAtom);

  const addFavorite = useCallback(
    (item: Collection) => {
      const exists = favorites.some(
        (f) => f.address === item.address && f.chain_id === item.chain_id,
      );
      if (!exists) {
        setFavorites([...favorites, item]);
      }
    },
    [favorites, setFavorites],
  );

  const removeFavorite = useCallback(
    (item: Collection) => {
      setFavorites(
        favorites.filter(
          (f) => !(f.address === item.address && f.chain_id === item.chain_id),
        ),
      );
    },
    [favorites, setFavorites],
  );

  const isFavorite = useCallback(
    (item: Collection) => {
      return favorites.some(
        (f) => f.address === item.address && f.chain_id === item.chain_id,
      );
    },
    [favorites],
  );

  const toggleFavorite = useCallback(
    (item: Collection) => {
      if (isFavorite(item)) {
        removeFavorite(item);
      } else {
        addFavorite(item);
      }
    },
    [isFavorite, addFavorite, removeFavorite],
  );

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite,
  };
};
