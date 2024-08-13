import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { GetStaticPaths, GetStaticProps } from 'next';
import { fetchProducts } from '../../services/api';
import CommentShareLike from '../../components/CommentShareLike';

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
      "name": product.brand ? product.brand.name : "Unknown"
    },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "USD",
      "price": product.price,
      "availability": "http://schema.org/InStock"
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

  const [mainImage, setMainImage] = useState(product.main_image.url);
  const [variantSelections, setVariantSelections] = useState({});
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const handleThumbnailClick = (imageUrl) => {
    const currentMainImage = mainImage;
    setMainImage(imageUrl);

    const updatedImages = product.images.map((img) => {
      if (img.image.url === imageUrl) {
        img.image.url = currentMainImage;
      }
      return img;
    });

    product.images = updatedImages;
  };

  const handleVariantSelection = (type, value) => {
    setVariantSelections((prevSelections) => ({
      ...prevSelections,
      [type]: value,
    }));
  };

  const selectedSize = variantSelections.size || '';
  const selectedColor = variantSelections.color || '';
  const selectedPlatform = variantSelections.platform || '';
  const selectedCopyType = variantSelections.copyType || '';

  const availableSizes = product.product_variants
    .filter((variant) => !selectedColor || variant.color?.name === selectedColor)
    .map((variant) => variant.size)
    .filter((size, idx, self) => size && self.findIndex((s) => s.name === size.name) === idx);

  const availableColors = product.product_variants
    .filter((variant) => !selectedSize || variant.size?.name === selectedSize)
    .map((variant) => variant.color)
    .filter((color, idx, self) => color && self.findIndex((c) => c.name === color.name) === idx);

  const availablePlatforms = product.product_variants
    .filter((variant) => !selectedCopyType || variant.format === selectedCopyType)
    .map((variant) => variant.platform)
    .filter((platform, idx, self) => platform && self.findIndex((p) => p.name === platform.name) === idx);

  const availableCopyTypes = product.product_variants
    .filter((variant) => !selectedPlatform || variant.platform?.name === selectedPlatform)
    .map((variant) => variant.format)
    .filter((type, idx, self) => type && self.indexOf(type) === idx);

  const selectedVariant = product.product_variants.find(
    (variant) =>
      (!selectedSize || variant.size?.name === selectedSize) &&
      (!selectedColor || variant.color?.name === selectedColor) &&
      (!selectedPlatform || variant.platform?.name === selectedPlatform) &&
      (!selectedCopyType || variant.format === selectedCopyType)
  );

  const descriptionToShow = isDescriptionExpanded
    ? product.description.replace(/<\/?[^>]+(>|$)/g, '')
    : product.description.replace(/<\/?[^>]+(>|$)/g, '').substring(0, 100);

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
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/2">
          <div className="w-full h-96 mb-4">
            <img
              src={`${process.env.NEXT_PUBLIC_INDEX_URL}${mainImage}`}
              alt={product.title}
              className="w-full h-full object-cover rounded-lg shadow-lg"
            />
          </div>
          <div className="flex space-x-2 overflow-x-auto pb-2 mb-4"> {/* Make thumbnails scrollable horizontally on mobile */}
            <img
              src={`${process.env.NEXT_PUBLIC_INDEX_URL}${mainImage}`}
              alt="Main Thumbnail"
              className={`w-20 h-20 object-cover cursor-pointer ${mainImage ? 'border-2 border-[#8e67ea]' : ''}`}
              onClick={() => handleThumbnailClick(mainImage)}
            />
            {product.images.map((img, idx) => (
              <img
                key={idx}
                src={`${process.env.NEXT_PUBLIC_INDEX_URL}${img.image.url}`}
                alt={`Thumbnail ${idx}`}
                className={`w-20 h-20 object-cover cursor-pointer ${mainImage === img.image.url ? 'border-2 border-[#8e67ea]' : ''}`}
                onClick={() => handleThumbnailClick(img.image.url)}
              />
            ))}
          </div>
        </div>
        <div className="md:w-1/2 md:pl-8">
          <p className="text-xl mb-4">
            {descriptionToShow}
            {product.description.replace(/<\/?[^>]+(>|$)/g, '').length > 100 && !isDescriptionExpanded && (
              <span
                onClick={() => setIsDescriptionExpanded(true)}
                className="cursor-pointer text-[#8e67ea] ml-2"
              >
                číst více
              </span>
            )}
          </p>
          {selectedVariant ? (
            <>
              <p className="text-2xl font-semibold mb-2 text-[#8e67ea]">{selectedVariant.price} Kč</p>
              <p className="text-lg text-green-500 font-semibold mb-2">{selectedVariant.stock > 0 ? `Skladem (${selectedVariant.stock} ks)` : 'Není skladem'}</p>
            </>
          ) : (
            <p className="text-lg text-red-500 font-semibold mb-2">Není skladem</p>
          )}
          {/* Variants Selection */}
          {product.product_variants.length > 0 && (
            <div>
              {availableSizes.length > 0 && (
                <div className="mb-2">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Vyberte velikost</label>
                  <select
                    value={selectedSize}
                    onChange={(e) => handleVariantSelection('size', e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  >
                    <option value="">Vyberte velikost</option>
                    {availableSizes.map((size, idx) => (
                      <option key={idx} value={size?.name}>{size?.name}</option>
                    ))}
                  </select>
                </div>
              )}
              {availableColors.length > 0 && (
                <div className="mb-2">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Vyberte barvu</label>
                  <select
                    value={selectedColor}
                    onChange={(e) => handleVariantSelection('color', e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  >
                    <option value="">Vyberte barvu</option>
                    {availableColors.map((color, idx) => (
                      <option key={idx} value={color?.name}>{color?.name}</option>
                    ))}
                  </select>
                </div>
              )}
              {availablePlatforms.length > 0 && product.categories.some(category => category.name === 'Hry') && (
                <div className="mb-2">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Vyberte platformu</label>
                  <select
                    value={selectedPlatform}
                    onChange={(e) => handleVariantSelection('platform', e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  >
                    <option value="">Vyberte platformu</option>
                    {availablePlatforms.map((platform, idx) => (
                      <option key={idx} value={platform?.name}>{platform?.name}</option>
                    ))}
                  </select>
                </div>
              )}
              {availableCopyTypes.length > 0 && product.categories.some(category => category.name === 'Hry') && (
                <div className="mb-2">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Vyberte typ kopie</label>
                  <select
                    value={selectedCopyType}
                    onChange={(e) => handleVariantSelection('copyType', e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  >
                    <option value="">Vyberte typ kopie</option>
                    {availableCopyTypes.map((type, idx) => (
                      <option key={idx} value={type}>{type === 'digital' ? 'Digitální' : 'Fyzická'}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}
          <button className="bg-[#8e67ea] text-white py-2 px-4 rounded hover:bg-purple-700">
            Přidat do košíku
          </button>
        </div>
      </div>
      <CommentShareLike
        pageId={product.id}
        shareUrl={`${process.env.NEXT_PUBLIC_SITE_URL}${cleanedUrlPath}`}
        title={product.title}
        contentType="product"
      />
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
