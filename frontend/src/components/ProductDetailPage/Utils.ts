export const createSchemaData = (product) => ({
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.title,
    "image": product.main_image ? `${process.env.NEXT_PUBLIC_INDEX_URL}${product.main_image.url}` : '',
    "description": product.body,
    "brand": {
      "@type": "Organization",
      "name": product.brand ? product.brand.name : "Unknown"
    },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "USD",
      "price": product.price,
      "availability": "http://schema.org/InStock"
    }
  });
  
  export const createBreadcrumbList = (product, cleanedUrlPath) => ({
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
        "name": "Eshop",
        "item": `${process.env.NEXT_PUBLIC_SITE_URL}/eshop`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": product.title,
        "item": `${process.env.NEXT_PUBLIC_SITE_URL}${cleanedUrlPath}`
      }
    ]
  });
  