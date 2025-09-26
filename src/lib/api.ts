import qs from 'qs';

const STRAPI_URL = process.env.STRAPI_URL || 'http://127.0.0.1:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

/**
 * A generic fetch function to interact with the Strapi API.
 * @param endpoint The API endpoint to call (e.g., '/trips').
 * @param query The query parameters to append to the URL.
 * @returns The JSON response from the API.
 */
async function fetchApi(endpoint: string, query: Record<string, any> = {}) {
    const queryString = qs.stringify(query, { encodeValuesOnly: true });
    const url = `${STRAPI_URL}/api${endpoint}?${queryString}`;

    const headers = {
        'Content-Type': 'application/json',
        ...(STRAPI_API_TOKEN && { Authorization: `Bearer ${STRAPI_API_TOKEN}` }),
    };

    try {
        const res = await fetch(url, { headers, cache: 'no-store' }); // Use 'no-store' for development to always get fresh data
        if (!res.ok) {
            console.error(`Strapi API Error: ${res.status} ${res.statusText} for URL: ${url}`);
            throw new Error('Failed to fetch data from Strapi');
        }
        return await res.json();
    } catch (error) {
        console.error('Error fetching from Strapi:', error);
        return null; // Return null on error to handle gracefully in components
    }
}

// --- Trip Functions ---

/**
 * Fetches all trips with their cover images.
 * @returns A list of trip data objects.
 */
export async function getTrips() {
    const query = {
        populate: ['cover_image'],
        sort: ['title:asc'],
    };
    const res = await fetchApi('/trips', query);
    return res?.data || [];
}

/**
 * Fetches a single trip by its slug.
 * @param slug The unique slug of the trip.
 * @returns A single trip data object or null if not found.
 */
export async function getTripBySlug(slug: string) {
    const query = {
        filters: { slug: { $eq: slug } },
        populate: ['cover_image', 'gallery'],
    };
    const res = await fetchApi('/trips', query);
    return res?.data?.[0] || null;
}

// --- Page Content Functions ---

/**
 * Fetches the content for the About Us page.
 * @returns The about page data object.
 */
export async function getAboutPage() {
    const query = {
        populate: {
            team_members: {
                populate: ['photo'],
            },
        },
    };
    const res = await fetchApi('/about-page', query);
    return res?.data || null;
}

/**
 * Fetches the content for the Contact page.
 * @returns The contact page data object.
 */
export async function getContactPage() {
    const query = {
        populate: '*',
    };
    const res = await fetchApi('/contact-page', query);
    return res?.data || null;
}


// --- Blog & Community Functions ---

/**
 * Fetches all blog posts with their cover image and author.
 * @returns A list of blog post data objects.
 */
export async function getBlogPosts() {
    const query = {
        populate: ['cover_image', 'author'],
        sort: ['publishedAt:desc'],
    };
    const res = await fetchApi('/blog-posts', query);
    return res?.data || [];
}

/**
 * Fetches a single blog post by its slug.
 * @param slug The unique slug of the blog post.
 * @returns A single blog post data object or null if not found.
 */
export async function getPostBySlug(slug: string) {
    const query = {
        filters: { slug: { $eq: slug } },
        populate: ['cover_image', 'author'],
    };
    const res = await fetchApi('/blog-posts', query);
    return res?.data?.[0] || null;
}

/**
 * Fetches all published testimonials.
 * @returns A list of testimonial data objects.
 */
export async function getTestimonials() {
    const query = {
        sort: ['name:asc'],
    };
    const res = await fetchApi('/testimonials', query);
    return res?.data || [];
}

