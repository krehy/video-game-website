import Link from 'next/link';
import PropTypes from 'prop-types';

const ProductCard = ({ product }) => (
  <div key={product.handle} className="bg-white shadow-lg rounded p-4 mb-4">
    <Link href={`/eshop/${product.handle}`}>
      <h2 className="text-2xl font-bold mb-2">{product.title}</h2>
    </Link>
    <div dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} />
  </div>
);

ProductCard.propTypes = {
  product: PropTypes.object.isRequired,
};

export default ProductCard;
