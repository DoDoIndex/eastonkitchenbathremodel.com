import { HomeContent } from './HomeContent';
import type { Metadata } from 'next';

export const revalidate = 3600; // Revalidate every hour

export const metadata: Metadata = {
  title: 'Anaheim Hills Contractor - Kitchen & Bathroom Remodeling | Travis - Licensed CSLB 1121194',
  description: 'Expert kitchen and bathroom remodeling in Anaheim Hills & Orange County. Licensed contractor Travis delivers stunning transformations with 20+ years experience. Real photos, quality craftsmanship. Call (657) 888-0026',
  keywords: [
    'Anaheim Hills contractor',
    'kitchen remodeling Anaheim Hills',
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
  authors: [{ name: 'Travis - Anaheim Hills Contractor' }],
  creator: 'Easton Designs and Consulting',
  publisher: 'Anaheim Hills Contractor',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Anaheim Hills Contractor - Expert Kitchen & Bathroom Remodeling',
    description: 'Licensed contractor Travis transforms kitchens and bathrooms in Anaheim Hills & Orange County. 20+ years experience, real photos, quality craftsmanship.',
    url: 'https://anaheimhillscontractor.com',
    siteName: 'Anaheim Hills Contractor',
    images: [
      {
        url: '/contractor.webp',
        width: 1200,
        height: 630,
        alt: 'Travis - Licensed Anaheim Hills Contractor',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Anaheim Hills Contractor - Kitchen & Bathroom Remodeling',
    description: 'Expert remodeling services in Anaheim Hills & Orange County. Licensed CSLB 1121194.',
    images: ['/contractor.webp'],
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
    canonical: 'https://anaheimhillscontractor.com',
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
        "@id": "https://anaheimhillscontractor.com/#business",
        "name": "Anaheim Hills Contractor",
        "alternateName": "Travis - Anaheim Hills Contractor",
        "description": "Licensed general contractor specializing in kitchen and bathroom remodeling in Anaheim Hills and Orange County",
        "url": "https://anaheimhillscontractor.com",
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
        "@id": "https://anaheimhillscontractor.com/#website",
        "url": "https://anaheimhillscontractor.com",
        "name": "Anaheim Hills Contractor",
        "description": "Expert kitchen and bathroom remodeling services in Anaheim Hills and Orange County",
        "publisher": {
          "@id": "https://anaheimhillscontractor.com/#business"
        },
        "potentialAction": [
          {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://anaheimhillscontractor.com/?s={search_term_string}"
            },
            "query-input": "required name=search_term_string"
          }
        ]
      },
      {
        "@type": "Service",
        "@id": "https://anaheimhillscontractor.com/#kitchen-remodeling",
        "name": "Kitchen Remodeling",
        "description": "Complete kitchen renovations including cabinets, countertops, flooring, and appliances",
        "provider": {
          "@id": "https://anaheimhillscontractor.com/#business"
        },
        "areaServed": [
          "Anaheim Hills",
          "Orange County"
        ],
        "serviceType": "Kitchen Remodeling"
      },
      {
        "@type": "Service", 
        "@id": "https://anaheimhillscontractor.com/#bathroom-remodeling",
        "name": "Bathroom Remodeling",
        "description": "Full bathroom renovations with modern fixtures, tile work, and plumbing upgrades",
        "provider": {
          "@id": "https://anaheimhillscontractor.com/#business"
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
      <HomeContent />
    </>
  );
}
