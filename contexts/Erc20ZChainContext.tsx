import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Erc20ZChainContextType {
    chainId: string;
    setChainId: (id: string) => void;
}

const Erc20ZChainContext = createContext<Erc20ZChainContextType | undefined>(undefined);

export const Erc20ZChainProvider = ({ children }: { children: ReactNode }) => {
    const [chainId, setChainId] = useState<string>('1'); // 默认以太坊主网

    return (
        <Erc20ZChainContext.Provider value={{ chainId, setChainId }}>
            {children}
        </Erc20ZChainContext.Provider>
    );
};

export const useErc20ZChain = () => {
    const context = useContext(Erc20ZChainContext);
    if (context === undefined) {
        throw new Error('useErc20ZChain must be used within an Erc20ZChainProvider');
    }
    return context;
}; 