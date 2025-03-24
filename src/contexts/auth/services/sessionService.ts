import { AuthData } from '../types';

export const checkExistingSession = async (
    useFallbackMode: boolean
): Promise<AuthData | null> => {
    // First check localStorage
    const storedAuth = localStorage.getItem('auth');
    if (storedAuth) {
        try {
            const parsedData = JSON.parse(storedAuth);
            return {
                user: parsedData.user || null,
                accounts: parsedData.accounts || []
            };
        } catch (e) {
            console.error('Error parsing stored auth data:', e);
            localStorage.removeItem('auth');
        }
    }

    // If fallback mode is active, we don't need to check the API
    if (useFallbackMode) {
        return null;
    }

    // Then check API
    try {
        const response = await fetch('/api/auth/me', {
            headers: {
                Accept: 'application/json'
            }
        });

        if (!response.ok) {
            console.log('Auth check failed with status:', response.status);
            return null;
        }

        // Check if response is JSON before attempting to parse
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            if (data) {
                const formattedData = {
                    user: data.user || null,
                    accounts: data.accounts || []
                };
                localStorage.setItem('auth', JSON.stringify(formattedData));
                return formattedData;
            }
        } else {
            console.log('Not a JSON response from auth check, skipping');
            return null;
        }
    } catch (error) {
        console.error('API auth check failed:', error);
        return null;
    }

    return null;
};
