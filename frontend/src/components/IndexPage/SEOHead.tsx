import Head from 'next/head';

interface SEOHeadProps {
  seoData: any;
  breadcrumbList: any;
}

const SEOHead: React.FC<SEOHeadProps> = ({ seoData, breadcrumbList }) => (
  <Head>
    <title>{seoData.seo_title || 'Hlavní stránka'}</title>
    <meta name="description" content={seoData.search_description || 'Hlavní stránka description'} />
    {seoData.keywords && <meta name="keywords" content={seoData.keywords} />}
    <meta property="og:title" content={seoData.seo_title || 'Hlavní stránka'} />
    <meta property="og:description" content={seoData.search_description || 'Hlavní stránka description'} />
    <meta property="og:url" content={`${process.env.NEXT_PUBLIC_SITE_URL}/`} />
    <meta property="og:type" content="website" />
    {seoData.main_image && <meta property="og:image" content={`${process.env.NEXT_PUBLIC_INDEX_URL}${seoData.main_image.url}`} />}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={seoData.seo_title || 'Hlavní stránka'} />
    <meta name="twitter:description" content={seoData.search_description || 'Hlavní stránka description'} />
    {seoData.main_image && <meta name="twitter:image" content={`${process.env.NEXT_PUBLIC_INDEX_URL}${seoData.main_image.url}`} />}
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbList) }} />
  </Head>
);

export default SEOHead;
