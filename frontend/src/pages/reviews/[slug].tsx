// pages/reviews/[slug].tsx
import { GetStaticPaths, GetStaticProps } from 'next';
import { fetchReviews } from '../../services/api';

const ReviewDetail = ({ review }) => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">{review.title}</h1>
      <div className="prose" dangerouslySetInnerHTML={{ __html: review.body }} />
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const reviews = await fetchReviews();
  const paths = reviews.map((review) => ({
    params: { slug: review.slug },
  }));
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const reviews = await fetchReviews();
  const review = reviews.find((review) => review.slug === params.slug);
  return { props: { review } };
};

export default ReviewDetail;
