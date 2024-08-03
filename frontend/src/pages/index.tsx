import { useEffect, useState } from 'react';
import api from '../services/api';

interface BlogPost {
  id: number;
  title: string;
  intro: string;
  body: string;
}

const HomePage = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await api.get('/blogs/');
        setBlogs(response.data);
      } catch (error) {
        console.error("There was an error fetching the blogs!", error);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <div>
      <h1>Blog Posts</h1>
      <ul>
        {blogs.map((blog) => (
          <li key={blog.id}>
            <h2>{blog.title}</h2>
            <p>{blog.intro}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;
