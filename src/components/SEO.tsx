import React from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  type?: 'website' | 'article' | 'product' | 'organization' | 'localbusiness';
  product?: {
    name: string;
    price: string;
    currency: string;
    availability: string;
    brand: string;
  };
}

export const SEO: React.FC<SEOProps> = ({ 
  title = "SAVIMAN | Precision Brass & Steel Components Manufacturer",
  description = "Global manufacturer and exporter of precision Brass and Stainless Steel components. ISO 9001:2015 Certified. Serving Automotive, Electrical, and Hydraulic industries worldwide.",
  image = "https://saviman.com/og-image.jpg",
  type = "website",
  product
}) => {
  
  const siteName = "SAVIMAN";
  const twitterHandle = "@saviman";
  const siteUrl = "https://saviman.com";

  const schemaOrg = () => {
    let schema;

    if (type === 'organization') {
      schema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "SAVIMAN Industries",
        "url": siteUrl,
        "logo": `${siteUrl}/logo.png`,
        "description": description,
        "foundingDate": "1990",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "GIDC Industrial Estate, Phase III",
          "addressLocality": "Jamnagar",
          "addressRegion": "Gujarat",
          "postalCode": "361004",
          "addressCountry": "IN"
        },
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+91-95069-43134",
          "contactType": "Sales",
          "email": "export@saviman.com"
        },
        "sameAs": [
          "https://www.linkedin.com/company/saviman",
          "https://www.facebook.com/saviman"
        ],
        "certification": [
          {
            "@type": "Certification",
            "name": "ISO 9001:2015",
            "issuedBy": "International Organization for Standardization"
          }
        ]
      };
    } else if (type === 'localbusiness') {
      schema = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "SAVIMAN Manufacturing Unit",
        "image": image,
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "GIDC Industrial Estate, Phase III",
          "addressLocality": "Jamnagar",
          "addressRegion": "Gujarat",
          "postalCode": "361004",
          "addressCountry": "IN"
        },
        "telephone": "+91-95069-43134",
        "priceRange": "$$$"
      };
    } else if (type === 'product' && product) {
      schema = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product.name,
        "description": description,
        "image": image,
        "brand": {
          "@type": "Brand",
          "name": product.brand
        },
        "offers": {
          "@type": "Offer",
          "priceCurrency": product.currency,
          "price": product.price,
          "availability": product.availability
        }
      };
    } else {
      // Website schema
      schema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": siteName,
        "url": siteUrl,
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": `${siteUrl}/search?q={search_term_string}`
          },
          "query-input": "required name=search_term_string"
        }
      };
    }

    return JSON.stringify(schema);
  };

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content="brass components, steel fasteners, precision engineering, CNC machining, ISO 9001, manufacturer, exporter, India" />
      
      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={siteName} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={twitterHandle} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Canonical */}
      <link rel="canonical" href={siteUrl} />
      
      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaOrg() }} />
    </>
  );
};
