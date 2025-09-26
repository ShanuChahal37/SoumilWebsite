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
        next: { revalidate: 60 } 
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

// --- TRIPS API FUNCTIONS ---

export async function getTrips() {
    const query = { populate: ['featured_image'], sort: ['publishedAt:desc'] };
    const res = await fetchApi('/trips', query);
    return res?.data || [];
}

export async function getTripBySlug(slug: string) {
    const query = { filters: { slug: { $eq: slug } }, populate: ['featured_image', 'gallery'] };
    const res = await fetchApi('/trips', query);
    return res?.data?.[0] || null;
}

// --- STATIC PAGES API FUNCTIONS ---

export async function getAboutPage() {
    const query = {
        populate: {
            cover_image: { fields: ['url', 'alternativeText', 'formats'] },
            team_members: { populate: { photo: { fields: ['url', 'alternativeText', 'formats'] } } }
        }
    };
    const res = await fetchApi('/about-page', query);
    return res?.data || null;
}

// --- BLOG API FUNCTIONS ---

export async function getBlogPosts() {
    const query = { populate: ['cover_image', 'author'], sort: ['publishedAt:desc'] };
    const res = await fetchApi('/blog-posts', query);
    return res?.data || [];
}

export async function getBlogPostBySlug(slug: string) {
    const query = {
        filters: { slug: { $eq: slug } },
        populate: {
            cover_image: { fields: ['url', 'alternativeText', 'formats'] },
            author: { populate: { picture: { fields: ['url', 'alternativeText'] } } }
        }
    };
    const res = await fetchApi('/blog-posts', query);
    return res?.data?.[0] || null;
}

// --- TESTIMONIALS API FUNCTION ---

/**
 * Fetches all testimonials.
 * @returns An array of testimonial objects.
 */
export async function getTestimonials() {
    const query = {
        populate: ['picture'],
        sort: ['createdAt:desc'], // Show the newest testimonials first
    };
    const res = await fetchApi('/testimonials', query);
    return res?.data || [];
}

