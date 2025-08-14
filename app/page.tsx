import { HomeContent } from './HomeContent';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export const revalidate = 3600; // Revalidate every hour

export const metadata: Metadata = {
  title: 'Easton Designs & Consultings - Kitchen Remodeling, Bathroom Remodeling, Shower Remodeling | Renovation Contractor',
  description: 'Expert kitchen and bathroom remodeling in Anaheim Hills & Orange County. Licensed contractor Travis delivers stunning transformations with 20+ years experience. Real photos, quality craftsmanship. Call (657) 888-0026',
  keywords: [
    'Easton Designs & Consultings contractor',
    'kitchen remodeling Anaheim Hills',
    'bathroom remodeling Anaheim Hills',
    'bathroom remodeling Orange County',
    'licensed contractor CSLB 1121194',
    'Travis contractor',
    'kitchen renovation',
    'bathroom renovation',
    'Orange County remodeling',
    'home improvement Anaheim Hills',
    'custom cabinets',
    'tile work',
    'plumbing upgrades'
  ],
      authors: [{ name: 'Travis - Easton Designs & Consultings' }],
  creator: 'Easton Designs and Consulting',
  publisher: 'Easton Designs and Consulting',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Easton Designs and Consulting - Expert Kitchen & Bathroom Remodeling',
    description: 'Licensed contractor Travis transforms kitchens and bathrooms in Anaheim Hills & Orange County. 20+ years experience, real photos, quality craftsmanship.',
    url: 'https://www.eastonkitchenbathremodel.com',
    siteName: 'Easton Designs and Consulting',
    images: [
      {
        url: '/Kitchen/8.jpg',
        width: 2500,
        height: 1667,
        alt: 'Easton Designs and Consulting',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Easton Designs and Consulting - Kitchen & Bathroom Remodeling',
    description: 'Expert remodeling services in Anaheim Hills & Orange County. Licensed CSLB 1121194.',
    images: ['/Kitchen/8.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code', // Replace with actual verification code
  },
  alternates: {
    canonical: 'https://www.eastonkitchenbathremodel.com',
  },
  other: {
    'x-cache-tags': 'home,contractor,remodeling'
  }
};

export default async function HomePage() {
  // Structured Data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": "https://www.eastonkitchenbathremodel.com/#business",
        "name": "Easton Designs and Consulting",
        "alternateName": "Travis - Easton Designs and Consulting",
        "description": "Licensed general contractor specializing in kitchen and bathroom remodeling in Anaheim Hills and Orange County",
        "url": "https://www.eastonkitchenbathremodel.com",
        "telephone": "(657) 888-0026",
        "priceRange": "$$",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Anaheim Hills",
          "addressRegion": "CA",
          "addressCountry": "US"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 33.8358,
          "longitude": -117.7603
        },
        "areaServed": [
          {
            "@type": "City",
            "name": "Anaheim Hills"
          },
          {
            "@type": "City", 
            "name": "Orange County"
          }
        ],
        "serviceType": [
          "Kitchen Remodeling",
          "Bathroom Remodeling",
          "General Contracting"
        ],
        "hasCredential": {
          "@type": "EducationalOccupationalCredential",
          "credentialCategory": "Professional License",
          "recognizedBy": {
            "@type": "Organization",
            "name": "California Contractors State License Board"
          },
          "identifier": "CSLB Lic. 1121194"
        },
        "founder": {
          "@type": "Person",
          "name": "Travis",
          "jobTitle": "Licensed General Contractor"
        },
        "sameAs": []
      },
      {
        "@type": "WebSite",
        "@id": "https://www.eastonkitchenbathremodel.com/#website",
        "url": "https://www.eastonkitchenbathremodel.com",
        "name": "Easton Designs and Consulting",
        "description": "Expert kitchen and bathroom remodeling services in Anaheim Hills and Orange County",
        "publisher": {
          "@id": "https://www.eastonkitchenbathremodel.com/#business"
        },
        "potentialAction": [
          {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://www.eastonkitchenbathremodel.com/?s={search_term_string}"
            },
            "query-input": "required name=search_term_string"
          }
        ]
      },
      {
        "@type": "Service",
        "@id": "https://www.eastonkitchenbathremodel.com/#kitchen-remodeling",
        "name": "Kitchen Remodeling",
        "description": "Complete kitchen renovations including cabinets, countertops, flooring, and appliances",
        "provider": {
          "@id": "https://www.eastonkitchenbathremodel.com/#business"
        },
        "areaServed": [
          "Anaheim Hills",
          "Orange County"
        ],
        "serviceType": "Kitchen Remodeling"
      },
      {
        "@type": "Service", 
        "@id": "https://www.eastonkitchenbathremodel.com/#bathroom-remodeling",
        "name": "Bathroom Remodeling",
        "description": "Full bathroom renovations with modern fixtures, tile work, and plumbing upgrades",
        "provider": {
          "@id": "https://www.eastonkitchenbathremodel.com/#business"
        },
        "areaServed": [
          "Anaheim Hills",
          "Orange County"
        ],
        "serviceType": "Bathroom Remodeling"
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Suspense fallback={<div>Loading...</div>}>
        <HomeContent />
      </Suspense>
    </>
  );
}
