import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { fetchUserProfile } from '@/services/api';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faEye } from '@fortawesome/free-solid-svg-icons';
import { UserProfile } from '@/types'; // Import správného typu

const ProfilePage = () => {
  const router = useRouter();
  const { slug } = router.query;

  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [hoveredPost, setHoveredPost] = useState<number | null>(null);

  useEffect(() => {
    if (slug) {
      const controller = new AbortController();
      const signal = controller.signal;
  
      fetchUserProfile(slug as string, signal)
        .then((data: UserProfile) => {
          if (!signal.aborted && data) {
            setUserData(data);
          }
        })
        .catch((error) => {
          if (!signal.aborted && error?.message !== 'canceled') {
            console.error(error);
          }
        })
        .finally(() => {
          if (!signal.aborted) {
            setLoading(false);
          }
        });
  
      return () => controller.abort();
    }
  }, [slug]);

  if (loading) return <p className="text-center text-gray-500">Načítání...</p>;
  if (!userData) return <p className="text-center text-red-500">Uživatel nenalezen.</p>;

  return (
    <div className="container mx-auto p-6">
      <div className="bg-[#121212] p-8 rounded-lg shadow-lg text-left">
        <div className="flex items-center">
          <div className="relative w-32 h-32 mr-6">
            {userData.profile_image && (
              <Image
                src={userData.profile_image}
                alt={`${userData.username} profilový obrázek`}
                width={128}
                height={128}
                className="rounded-full border-4 border-[#8e67ea] shadow-lg"
              />
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">{userData.first_name} {userData.last_name}</h1>
            <p className="text-[#8e67ea] text-lg">@{userData.username}</p>
            <p className="text-gray-400 text-sm mt-2">
              <span className="font-semibold text-white">{userData.groups.join(', ')}</span>
            </p>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mt-8 text-white border-b-2 border-[#8e67ea] pb-2">
        Nejnovější příspěvky od uživatele
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {userData.latest_posts.map((post) => (
          <motion.div 
            key={post.id}
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            onMouseEnter={() => setHoveredPost(post.id)}
            onMouseLeave={() => setHoveredPost(null)}
            className={`bg-white shadow-md rounded overflow-hidden relative transition-transform duration-300 ${hoveredPost === post.id ? 'shadow-lg' : ''}`}
          >
            {post.main_image && (
              <div className="relative">
                <Link href={`/${post.type === 'review' ? 'reviews' : 'blog'}/${post.slug}`}>
                  <Image
                    src={post.main_image}
                    alt={post.title}
                    width={800}
                    height={300}
                    className="rounded-t object-cover"
                  />
                </Link>
                {hoveredPost === post.id && (
                  <motion.div 
                    initial={{ y: '-100%' }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute top-0 left-0 w-full p-2 bg-black bg-opacity-50 text-center text-white text-4xl font-bold"
                  >
                    {post.type === 'review' ? 'Recenze' : 'Článek'}
                  </motion.div>
                )}
                <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white p-2">
                  <Link href={`/${post.type === 'review' ? 'reviews' : 'blog'}/${post.slug}`}>
                    <h2 className="text-lg font-semibold">{post.title}</h2>
                  </Link>
                </div>
              </div>
            )}
            <div className="p-4">
              <p className="text-gray-700 mb-4">{post.intro}</p>
              <div className="flex items-center text-gray-500 text-sm">
                <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 text-[#8e67ea]" />
                <span>{new Date(post.published_at).toLocaleDateString()}</span>
                <FontAwesomeIcon icon={faEye} className="ml-4 mr-2 text-[#8e67ea]" />
                <span>{post.read_count}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ProfilePage;
