// contexts/GlobalStateContext.tsx
import React, { createContext, useContext, useState } from "react";

type GlobalState = {
  selectedOption: string;
  setSelectedOption: (option: string) => void;
};

const GlobalStateContext = createContext<GlobalState | undefined>(undefined);

export const GlobalStateProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [selectedOption, setSelectedOption] = useState("404s");

  return (
    <GlobalStateContext.Provider value={{ selectedOption, setSelectedOption }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = () => {
  const context = useContext(GlobalStateContext);
  if (!context) {
    throw new Error("useGlobalState must be used within a GlobalStateProvider");
  }
  return context;
};
