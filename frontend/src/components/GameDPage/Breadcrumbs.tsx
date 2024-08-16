import React from 'react';

const Breadcrumbs = () => {
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
      }
    ]
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbList) }} />;
};

export default Breadcrumbs;
