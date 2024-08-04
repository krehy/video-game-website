// pages/blog/[slug].tsx
import { GetStaticPaths, GetStaticProps } from 'next';
import { fetchArticles } from '../../services/api';

const ArticleDetail = ({ article }) => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
      <div className="prose" dangerouslySetInnerHTML={{ __html: article.body }} />
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const articles = await fetchArticles();
  const paths = articles.map((article) => ({
    params: { slug: article.slug },
  }));
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const articles = await fetchArticles();
  const article = articles.find((article) => article.slug === params.slug);
  return { props: { article } };
};

export default ArticleDetail;
