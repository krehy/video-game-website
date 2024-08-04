// pages/shop/[slug].tsx
import { GetStaticPaths, GetStaticProps } from 'next';
import { fetchProducts } from '../../services/api';

const ProductDetail = ({ product }) => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
      <div className="prose" dangerouslySetInnerHTML={{ __html: product.description }} />
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const products = await fetchProducts();
  const paths = products.map((product) => ({
    params: { slug: product.slug },
  }));
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const products = await fetchProducts();
  const product = products.find((product) => product.slug === params.slug);
  return { props: { product } };
};

export default ProductDetail;
