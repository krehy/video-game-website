import React from 'react';

const BreadcrumbList = ({ game }) => {
  const cleanedUrlPath = game.url_path.replace('/placeholder', '');
  const breadcrumbList = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": `${process.env.NEXT_PUBLIC_SITE_URL}/`
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Databáze Her",
        "item": `${process.env.NEXT_PUBLIC_SITE_URL}/games`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": game.title,
        "item": `${process.env.NEXT_PUBLIC_SITE_URL}${cleanedUrlPath}`
      }
    ]
  };

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbList) }} />
  );
};

export default BreadcrumbList;
