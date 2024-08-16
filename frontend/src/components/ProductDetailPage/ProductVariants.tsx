import React from 'react';

const ProductVariants = ({
  product,
  variantSelections,
  setVariantSelections,
  selectedSize,
  selectedColor,
  selectedPlatform,
  selectedCopyType,
  availableSizes,
  availableColors,
  availablePlatforms,
  availableCopyTypes,
}) => (
  <div className="mt-4">
    <div>
      <label>Size:</label>
      <select
        value={selectedSize}
        onChange={(e) => setVariantSelections({ ...variantSelections, size: e.target.value })}
      >
        <option value="">Select Size</option>
        {availableSizes.map((size) => (
          <option key={size.name} value={size.name}>
            {size.name}
          </option>
        ))}
      </select>
    </div>

    <div>
      <label>Color:</label>
      <select
        value={selectedColor}
        onChange={(e) => setVariantSelections({ ...variantSelections, color: e.target.value })}
      >
        <option value="">Select Color</option>
        {availableColors.map((color) => (
          <option key={color.name} value={color.name}>
            {color.name}
          </option>
        ))}
      </select>
    </div>

    <div>
      <label>Platform:</label>
      <select
        value={selectedPlatform}
        onChange={(e) => setVariantSelections({ ...variantSelections, platform: e.target.value })}
      >
        <option value="">Select Platform</option>
        {availablePlatforms.map((platform) => (
          <option key={platform.name} value={platform.name}>
            {platform.name}
          </option>
        ))}
      </select>
    </div>

    <div>
      <label>Copy Type:</label>
      <select
        value={selectedCopyType}
        onChange={(e) => setVariantSelections({ ...variantSelections, copyType: e.target.value })}
      >
        <option value="">Select Copy Type</option>
        {availableCopyTypes.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>
    </div>
  </div>
);

export default ProductVariants;
