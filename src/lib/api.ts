import qs from 'qs';

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';

/**
 * A utility function to make API requests to Strapi.
 * This function remains unchanged.
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

// ---------------------------------------------------------------- //
// --- NEW FUNCTION ADDED BELOW ---                                 //
// ---------------------------------------------------------------- //

/**
 * Fetches a single trip by its slug.
 * This is the new function required for the trip detail page.
 * @param slug The slug of the trip to fetch.
 * @returns A single trip object or null if not found.
 */
export async function getTripBySlug(slug: string) {
    const query = {
        filters: { slug: { $eq: slug } },
        // Populate all relations to get the full data for the detail page
        populate: ['featured_image', 'gallery'], 
    };
    const res = await fetchApi('/trips', query);

    if (!res?.data || res.data.length === 0) {
        return null;
    }

    // The API returns an array, so we return the first (and only) item
    return res.data[0];
}

