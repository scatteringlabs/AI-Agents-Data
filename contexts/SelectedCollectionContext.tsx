import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Collection } from '@/types/collection';

interface SelectedCollectionContextType {
    selectedCollection: Collection | null;
    setSelectedCollection: (collection: Collection | null) => void;
}

const SelectedCollectionContext = createContext<SelectedCollectionContextType | undefined>(undefined);

export const SelectedCollectionProvider = ({ children }: { children: ReactNode }) => {
    const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);

    return (
        <SelectedCollectionContext.Provider value={{ selectedCollection, setSelectedCollection }}>
            {children}
        </SelectedCollectionContext.Provider>
    );
};

export const useSelectedCollection = () => {
    const context = useContext(SelectedCollectionContext);
    if (context === undefined) {
        throw new Error('useSelectedCollection must be used within a SelectedCollectionProvider');
    }
    return context;
}; 