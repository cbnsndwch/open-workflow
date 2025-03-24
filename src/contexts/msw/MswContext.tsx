import {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode
} from 'react';
import { initMsw, isMswReady } from '@/mocks/browser';

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

        async function setupMsw() {
            try {
                console.log('Setting up MSW...');
                const success = await initMsw();
                setIsMswActive(success);
            } catch (error) {
                console.error('MSW setup failed:', error);
                setIsMswActive(false);
            } finally {
                setIsMswLoading(false);
            }
        }

        setupMsw();
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
