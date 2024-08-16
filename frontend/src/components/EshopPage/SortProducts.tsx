export const sortProducts = (products, sortBy) => {
    switch (sortBy) {
      case 'newest':
        return products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case 'oldest':
        return products.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      case 'aToZ':
        return products.sort((a, b) => a.title.localeCompare(b.title));
      case 'zToA':
        return products.sort((a, b) => b.title.localeCompare(a.title));
      case 'priceLowToHigh':
        return products.sort(
          (a, b) =>
            Math.min(...a.variants.edges.map((v) => parseFloat(v.node.priceV2.amount))) -
            Math.min(...b.variants.edges.map((v) => parseFloat(v.node.priceV2.amount)))
        );
      case 'priceHighToLow':
        return products.sort(
          (a, b) =>
            Math.max(...b.variants.edges.map((v) => parseFloat(v.node.priceV2.amount))) -
            Math.max(...a.variants.edges.map((v) => parseFloat(v.node.priceV2.amount)))
        );
      default:
        return products;
    }
  };
  