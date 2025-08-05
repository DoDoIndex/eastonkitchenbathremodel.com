import { HomeContent } from './HomeContent';

export const revalidate = 3600; // Revalidate every hour

export async function generateMetadata() {
  return {
    title: 'Anaheim Hills Contractor',
    description: 'Anaheim Hills Contractor is a full-service contractor specializing in roofing, siding, windows, and more.',
    other: {
      'x-cache-tags': 'home,products,categories'
    }
  };
}

export default async function HomePage() {
  return (
    <HomeContent />
  );
}
