import React from 'react';
import Head from 'next/head';
import { GetStaticPaths, GetStaticProps } from 'next';
import { fetchProducts } from '../../services/api';

const ProductDetail = ({ product }) => {
  if (!product) {
    return <div>Product not found</div>;
  }

  const cleanedUrlPath = product.url_path.replace('/placeholder', '');

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.title,
    "image": product.main_image ? `${process.env.NEXT_PUBLIC_INDEX_URL}${product.main_image.url}` : '',
    "description": product.body,
    "brand": {
      "@type": "Organization",
      "name": product.brand ? product.brand.name : "Unknown" // assuming you have a brand field
    },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "USD", // or the appropriate currency
      "price": product.price,
      "availability": "http://schema.org/InStock" // assuming the product is in stock
    }
  };

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
  };

  return (
    <div>
      <Head>
        <title>{product.seo_title || product.title}</title>
        <meta name="description" content={product.search_description} />
        {product.keywords && <meta name="keywords" content={product.keywords} />}
        <meta property="og:title" content={product.seo_title || product.title} />
        <meta property="og:description" content={product.search_description} />
        <meta property="og:url" content={`${process.env.NEXT_PUBLIC_SITE_URL}${cleanedUrlPath}`} />
        <meta property="og:type" content="product" />
        {product.main_image && <meta property="og:image" content={`${process.env.NEXT_PUBLIC_INDEX_URL}${product.main_image.url}`} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={product.seo_title || product.title} />
        <meta name="twitter:description" content={product.search_description} />
        {product.main_image && <meta name="twitter:image" content={`${process.env.NEXT_PUBLIC_INDEX_URL}${product.main_image.url}`} />}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbList) }} />
      </Head>
      <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
      <div className="prose" dangerouslySetInnerHTML={{ __html: product.body }} />
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const products = await fetchProducts();
    const paths = products.map((product) => ({
      params: { slug: product.slug },
    }));
    return { paths, fallback: false };
  } catch (error) {
    console.error('Error fetching products for paths:', error);
    return { paths: [], fallback: false };
  }
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    const products = await fetchProducts();
    const product = products.find((p) => p.slug === params?.slug);

    if (!product) {
      return {
        notFound: true,
      };
    }

    return {
      props: { product },
    };
  } catch (error) {
    console.error('Error fetching product for static props:', error);
    return {
      notFound: true,
    };
  }
};

export default ProductDetail;
