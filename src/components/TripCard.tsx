import Link from 'next/link';
import Image from 'next/image';
import { Trip } from '@/types';

interface TripCardProps {
  trip: Trip;
}

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';

export default function TripCard({ trip }: TripCardProps) {
  if (!trip) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 text-center text-gray-500">
        Invalid trip data
      </div>
    );
  }
  const { title, slug, price, duration, excerpt, featured_image, category } = trip;
  // If you have image logic, update accordingly, else fallback
  const imageUrl = featured_image?.data?.attributes?.formats?.small?.url
    ? STRAPI_URL + featured_image.data.attributes.formats.small.url
    : undefined;

  return (
    <Link href={`/trips/${slug}`} className="group block overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
      <div className="relative">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={featured_image?.data?.attributes?.alternativeText || title}
            width={400}
            height={300}
            className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-56 bg-gray-200 flex items-center justify-center text-gray-400">No Image</div>
        )}
        <div className="absolute top-0 right-0 bg-teal-600 text-white py-1 px-3 rounded-bl-lg font-bold">
          {duration}
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4 h-20 overflow-hidden">{excerpt}</p>
        <div className="flex justify-between items-center">
          <p className="text-lg font-semibold text-teal-700">
            ₹{price?.toLocaleString?.('en-IN')}
            <span className="text-sm font-normal text-gray-500"> / person</span>
          </p>
          <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
            {category}
          </span>
        </div>
      </div>
    </Link>
  );
}