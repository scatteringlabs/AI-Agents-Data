import { Collection } from "@/types/collection";
import { atomWithStorage } from "jotai/utils";

export const favoritesAtom = atomWithStorage<Collection[]>("favorites", []);
