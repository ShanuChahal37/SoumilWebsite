import qs from 'qs';

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';

/**
 * A utility function to make API requests to Strapi.
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

/**
 * Fetches all trips for the main listing page.
 */
export async function getTrips() {
    const query = {
        populate: ['featured_image'],
        sort: ['publishedAt:desc'],
    };
    const res = await fetchApi('/trips', query);
    if (!res?.data) {
        return [];
    }
    return res.data;
}


/**
 * Fetches a single trip by its slug.
 */
export async function getTripBySlug(slug: string) {
    const query = {
        filters: { slug: { $eq: slug } },
        populate: ['featured_image', 'gallery'], 
    };
    const res = await fetchApi('/trips', query);

    if (!res?.data || res.data.length === 0) {
        return null;
    }

    return res.data[0];
}

/**
 * Fetches the content for the "About Us" page.
 */
export async function getAboutPage() {
    const query = {
        populate: {
            cover_image: { fields: ['url', 'alternativeText', 'formats'] },
            team_members: { populate: { photo: { fields: ['url', 'alternativeText', 'formats'] } } }
        }
    };
    const res = await fetchApi('/about-page', query);
    if (!res?.data) {
        return null;
    }
    return res.data;
}

