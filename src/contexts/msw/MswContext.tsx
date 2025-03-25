
import {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode
} from 'react';
import { worker, isMswReady } from '@/mocks/browser';

interface MswContextType {
    isMswActive: boolean;
    isMswLoading: boolean;
    useFallback: boolean;
}

const MswContext = createContext<MswContextType>({
    isMswActive: false,
    isMswLoading: true,
    useFallback: false
});

export const useMsw = () => useContext(MswContext);

interface MswProviderProps {
    children: ReactNode;
}

export const MswProvider = ({ children }: MswProviderProps) => {
    const [isMswActive, setIsMswActive] = useState(false);
    const [isMswLoading, setIsMswLoading] = useState(true);

    useEffect(() => {
        // Only run MSW in development
        if (process.env.NODE_ENV === 'production') {
            setIsMswLoading(false);
            return;
        }

        // Check if MSW is already initialized
        if (isMswReady()) {
            setIsMswActive(true);
            setIsMswLoading(false);
            return;
        }

        // MSW initialization is now handled in main.tsx before app rendering
        // Just update state based on whether MSW is ready
        const checkMswReady = () => {
            const ready = isMswReady();
            setIsMswActive(ready);
            setIsMswLoading(false);
        };

        // Check after a short delay to allow for initialization
        const timer = setTimeout(checkMswReady, 300);
        return () => clearTimeout(timer);
    }, []);

    // In production or if MSW fails to load, we should use the fallback mode
    const useFallback =
        process.env.NODE_ENV === 'production' ||
        (!isMswActive && !isMswLoading);

    return (
        <MswContext.Provider value={{ isMswActive, isMswLoading, useFallback }}>
            {children}
        </MswContext.Provider>
    );
};
