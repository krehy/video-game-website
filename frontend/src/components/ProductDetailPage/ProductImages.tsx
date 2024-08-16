import React from 'react';

const ProductImages = ({ product, mainImage, setMainImage }) => (
  <div className="md:w-1/2">
    <img src={mainImage} alt={product.title} className="w-full h-auto" />
    <div className="flex mt-4">
      {product.images.map((image, index) => (
        <img
          key={index}
          src={image.url}
          alt={product.title}
          className={`w-1/4 cursor-pointer ${image.url === mainImage ? 'border-2 border-blue-500' : ''}`}
          onClick={() => setMainImage(image.url)}
        />
      ))}
    </div>
  </div>
);

export default ProductImages;
