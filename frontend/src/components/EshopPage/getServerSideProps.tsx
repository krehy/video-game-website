import { createStorefrontApiClient } from '@shopify/storefront-api-client';
import ProductIndex from '../components/EshopPage/ProductIndex';

export const getServerSideProps = async () => {
  const client = createStorefrontApiClient({
    storeDomain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN,
    apiVersion: '2024-01',
    publicAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
  });

  const query = `
    {
      products(first: 20) {
        edges {
          node {
            id
            title
            handle
            descriptionHtml
            images(first: 5) {
              edges {
                node {
                  src
                }
              }
            }
            variants(first: 5) {
              edges {
                node {
                  id
                  title
                  priceV2 {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await client.request(query);
    const products = response.data.products.edges.map(edge => edge.node);

    return {
      props: {
        products,
      },
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    return {
      props: {
        products: [],
      },
    };
  }
};

export default function EshopPage({ products }) {
  return <ProductIndex products={products} />;
}
