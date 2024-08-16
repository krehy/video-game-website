import React, { useState } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { fetchProducts } from '../../services/api';
import ProductSEO from '../../components/ProductDetailPage/ProductSEO';
import ProductImages from '../../components/ProductDetailPage/ProductImages';
import ProductVariants from '../../components/ProductDetailPage/ProductVariants';
import ProductDetails from '../../components/ProductDetailPage/ProductDetails';
import CommentShareLike from '../../components/ProductDetailPage/CommentShareLike';

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

  return (
    <div>
      <ProductSEO product={product} cleanedUrlPath={cleanedUrlPath} schemaData={schemaData} breadcrumbList={breadcrumbList} />
      <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
      <div className="flex flex-col md:flex-row">
        <ProductImages product={product} mainImage={mainImage} setMainImage={setMainImage} />
        <div className="md:w-1/2 md:pl-8">
          <ProductDetails product={product} selectedVariant={selectedVariant} />
          <ProductVariants 
            product={product}
            variantSelections={variantSelections}
            setVariantSelections={setVariantSelections}
            selectedSize={selectedSize}
            selectedColor={selectedColor}
            selectedPlatform={selectedPlatform}
            selectedCopyType={selectedCopyType}
            availableSizes={availableSizes}
            availableColors={availableColors}
            availablePlatforms={availablePlatforms}
            availableCopyTypes={availableCopyTypes}
          />
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
