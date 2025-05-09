import {
  createContext,
  useContext,
  useState,
  useMemo,
  ReactNode,
  useCallback,
} from "react";

type SortOrder = "asc" | "desc";
type DrawerSortContextType = {
  sortedField: string | null;
  sortOrder: SortOrder | null;
  setSortedField: (field: string) => void;
};

const DrawerSortContext = createContext<DrawerSortContextType | undefined>(
  undefined,
);

export const useDrawerSort = () => {
  const context = useContext(DrawerSortContext);
  if (!context) {
    throw new Error("useDrawerSort must be used within a DrawerSortProvider");
  }
  return context;
};

interface DrawerSortProviderProps {
  // initialToken: Token;
  children: ReactNode;
}
export const DrawerSortProvider = ({ children }: DrawerSortProviderProps) => {
  const [sortedField, setSortedFieldState] = useState<string>("24h Vol");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const setSortedField = useCallback(
    (field: string) => {
      if (sortedField === field) {
        setSortOrder((currentSortOrder) =>
          currentSortOrder === "asc" ? "desc" : "asc",
        );
      } else {
        setSortOrder("desc");
      }
      setSortedFieldState(field);
    },
    [sortedField],
  );

  const value = useMemo(
    () => ({ sortedField, sortOrder, setSortedField }),
    [sortedField, sortOrder, setSortedField],
  );

  return (
    <DrawerSortContext.Provider value={value}>
      {children}
    </DrawerSortContext.Provider>
  );
};
