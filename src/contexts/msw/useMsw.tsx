import { createContext, useContext } from 'react';

interface MswContextType {
    isMswActive: boolean;
    isMswLoading: boolean;
    useFallback: boolean;
}

export const MswContext = createContext<MswContextType>({
    isMswActive: false,
    isMswLoading: true,
    useFallback: false
});

export const useMsw = () => useContext(MswContext);
