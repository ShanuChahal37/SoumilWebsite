import qs from 'qs';

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';

/**
 * A utility function to make API requests to Strapi.
 * This is the central function that all other data-fetching functions will use.
 * It handles constructing the URL, adding query parameters, and error handling.
 */
export async function fetchApi(endpoint: string, query?: Record<string, any>, options?: RequestInit) {
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
        },
        // Use Next.js caching features for performance.
        // Data will be re-fetched from Strapi at most once every 60 seconds.
        next: { revalidate: 60 } 
    };
    const mergedOptions = { ...defaultOptions, ...options };
    
    // Use the 'qs' library to properly format the query object into a URL string.
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

// --- TRIPS API FUNCTIONS ---

/**
 * Fetches all trips for the main listing page.
 */
export async function getTrips() {
    const query = {
        populate: ['featured_image'], // Also fetch the related featured image
        sort: ['publishedAt:desc'],   // Show the newest trips first
    };
    const res = await fetchApi('/trips', query);
    if (!res?.data) {
        return [];
    }
    return res.data;
}

/**
 * Fetches a single trip by its slug for the detail page.
 */
export async function getTripBySlug(slug: string) {
    const query = {
        filters: { slug: { $eq: slug } },
        populate: ['featured_image', 'gallery'], // Fetch all images
    };
    const res = await fetchApi('/trips', query);

    if (!res?.data || res.data.length === 0) {
        return null; // Return null if no trip is found
    }

    return res.data[0]; // Return the first (and only) result
}

// --- STATIC PAGES API FUNCTIONS ---

/**
 * Fetches the content for the "About Us" page single type.
 */
export async function getAboutPage() {
    const query = {
        populate: {
            cover_image: { fields: ['url', 'alternativeText', 'formats'] },
            // Populate the repeatable component and the photo within it
            team_members: { populate: { photo: { fields: ['url', 'alternativeText', 'formats'] } } }
        }
    };
    const res = await fetchApi('/about-page', query);
    if (!res?.data) {
        return null;
    }
    return res.data;
}

// --- BLOG API FUNCTIONS ---

/**
 * Fetches all blog posts for the main blog listing page.
 */
export async function getBlogPosts() {
    const query = {
        populate: ['cover_image', 'author'], // Populate related cover image and author
        sort: ['publishedAt:desc'],
    };
    const res = await fetchApi('/blog-posts', query);
    if (!res?.data) {
        return [];
    }
    return res.data;
}

/**
 * Fetches a single blog post by its slug for the detail page.
 */
export async function getBlogPostBySlug(slug: string) {
    const query = {
        filters: { slug: { $eq: slug } },
        populate: {
            cover_image: { fields: ['url', 'alternativeText', 'formats'] },
            // Populate the author and the author's picture
            author: { populate: { picture: { fields: ['url', 'alternativeText'] } } }
        }
    };
    const res = await fetchApi('/blog-posts', query);

    if (!res?.data || res.data.length === 0) {
        return null;
    }
    return res.data[0];
}

