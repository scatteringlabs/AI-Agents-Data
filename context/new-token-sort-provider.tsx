import {
  createContext,
  useContext,
  useState,
  useMemo,
  ReactNode,
  useCallback,
} from "react";

type SortOrder = "asc" | "desc";
type SortContextType = {
  sortedField: string | null;
  sortOrder: SortOrder | null;
  setSortedField: (field: string) => void;
};

const SortContext = createContext<SortContextType | undefined>(undefined);

export const useSort = () => {
  const context = useContext(SortContext);
  if (!context) {
    throw new Error("useSort must be used within a NewTokenSortProvider");
  }
  return context;
};

interface NewTokenSortProviderProps {
  // initialToken: Token;
  children: ReactNode;
}
export const NewTokenSortProvider = ({
  children,
}: NewTokenSortProviderProps) => {
  const [sortedField, setSortedFieldState] = useState<string>("Date");
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

  return <SortContext.Provider value={value}>{children}</SortContext.Provider>;
};
