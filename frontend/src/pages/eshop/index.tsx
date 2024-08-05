import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { fetchProducts, fetchProductIndexSEO } from '../../services/api';

const ProductIndex = () => {
  const [products, setProducts] = useState([]);
  const [seoData, setSeoData] = useState({});

  useEffect(() => {
    const getProducts = async () => {
      const productData = await fetchProducts();
      setProducts(productData);
    };

    const getSeoData = async () => {
      const seo = await fetchProductIndexSEO();
      setSeoData(seo);
    };

    getProducts();
    getSeoData();
  }, []);

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
      }
    ]
  };

  return (
    <div className="container mx-auto p-4">
      <Head>
        <title>{seoData.seo_title || 'Eshop'}</title>
        <meta name="description" content={seoData.search_description || 'Eshop page description'} />
        {seoData.keywords && <meta name="keywords" content={seoData.keywords} />}
        <meta property="og:title" content={seoData.seo_title || 'Eshop'} />
        <meta property="og:description" content={seoData.search_description || 'Eshop page description'} />
        <meta property="og:url" content={`${process.env.NEXT_PUBLIC_SITE_URL}/eshop`} />
        <meta property="og:type" content="website" />
        {seoData.main_image && <meta property="og:image" content={`${process.env.NEXT_PUBLIC_INDEX_URL}${seoData.main_image.url}`} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoData.seo_title || 'Eshop'} />
        <meta name="twitter:description" content={seoData.search_description || 'Eshop page description'} />
        {seoData.main_image && <meta name="twitter:image" content={`${process.env.NEXT_PUBLIC_INDEX_URL}${seoData.main_image.url}`} />}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbList) }} />
      </Head>
      <h1 className="text-3xl font-bold mb-4">Eshop</h1>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <div key={product.slug} className="bg-white shadow-md rounded p-4">
            <Link href={`/eshop/${product.slug}`}>
              <p style={{ color: 'black' }}>{product.title}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductIndex;
