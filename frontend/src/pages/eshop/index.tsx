// pages/shop/index.tsx
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchProducts } from '../../services/api';

const ShopIndex = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const getProducts = async () => {
      const data = await fetchProducts();
      setProducts(data);
    };
    getProducts();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Eshop</h1>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <div key={product.slug} className="bg-white shadow-md rounded p-4">
            <Link href={`/eshop/${product.slug}`}>
              {product.title}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShopIndex;
