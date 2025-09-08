// This file will hold all the TypeScript types for our project.

// Type for a Strapi media object
export interface StrapiMedia {
    id: number;
    attributes: {
        name: string;
        alternativeText: string | null;
        caption: string | null;
        width: number;
        height: number;
        formats: {
            thumbnail: StrapiImageFormat;
            small: StrapiImageFormat;
            medium: StrapiImageFormat;
            large: StrapiImageFormat;
        };
        url: string;
    };
}

export interface StrapiImageFormat {
    name: string;
    hash: string;
    ext: string;
    mime: string;
    path: string | null;
    width: number;
    height: number;
    size: number;
    url: string;
}

// Main type for our Trip data
export interface Trip {
    id: number;
    documentId?: string;
    title: string;
    slug: string;
    excerpt: string;
    price: number;
    duration: string;
    category: 'India' | 'International';
    is_featured?: boolean;
    featured_image?: {
        data?: StrapiMedia;
    };
    itinerary?: string;
    gallery?: {
        data: StrapiMedia[];
    };
}