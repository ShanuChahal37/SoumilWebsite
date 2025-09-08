
import qs from 'qs';

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';

/**
 * A utility function to make API requests to Strapi.
 * @param endpoint The API endpoint to call (e.g., '/trips').
 * @param query An object of query parameters.
 * @param options Additional fetch options.
 * @returns The JSON response from the API.
 */
export async function fetchApi(endpoint: string, query?: Record<string, any>, options?: RequestInit) {
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
        },
        next: { revalidate: 60 } // Revalidate every 60 seconds
    };
    const mergedOptions = { ...defaultOptions, ...options };
    
    const queryString = qs.stringify(query, { encodeValuesOnly: true });
    const requestUrl = `${STRAPI_URL}/api${endpoint}${queryString ? `?${queryString}` : ''}`;

    try {
        const response = await fetch(requestUrl, mergedOptions);
        if (!response.ok) {
            console.error(`Error fetching ${requestUrl}: ${response.statusText}`);
            return null;
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error in fetchApi:', error);
        return null;
    }
}
