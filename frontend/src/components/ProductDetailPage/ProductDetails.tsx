import React, { useState } from 'react';
import ProductSEO from './ProductSEO';
import ProductImages from './ProductImages';
import ProductVariants from './ProductVariants';
import ProductDetails from './ProductDetails';
import CommentShareLike from './CommentShareLike';
import { createSchemaData, createBreadcrumbList } from './utils';

const ProductDetail = ({ product }) => {
  const cleanedUrlPath = product.url_path.replace('/placeholder', '');

  const schemaData = createSchemaData(product);
  const breadcrumbList = createBreadcrumbList(product, cleanedUrlPath);

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

export default ProductDetail;
