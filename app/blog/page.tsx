"use client"
import { useEffect, useState } from 'react';
import PageWrapper from "@/components/wrapper/page-wrapper";
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ArrowLeft } from 'lucide-react';


// Define an interface for your blog post
interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  createdAt: string; // Assuming this is the timestamp field
  updatedAt: string; // Assuming this is the timestamp field
}

// Update the return type of getAllBlogPosts
async function getAllBlogPosts(): Promise<BlogPost[]> {
  const response = await fetch(`/api/blogs`);
  if (!response.ok) {
    return [];
  }
  const posts: BlogPost[] = await response.json();
  return posts;
}

// Format date function
function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

// Dynamic route page for blog
export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const allPosts = await getAllBlogPosts();
      setPosts(allPosts);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  return (
    <PageWrapper>
      <div className="flex flex-col items-center py-16 relative w-screen">
        <Link href="/" className="absolute left-8 top-8 bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group">
          <ArrowLeft className="h-6 w-6 text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
        </Link>
        <div className="flex flex-col items-center p-3 w-full max-w-6xl">
          <div className="flex flex-col justify-start items-center gap-4 w-full mb-12">
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white text-center">
              Blog Articles
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 text-center max-w-2xl">
              Explore our latest blog posts below.
            </p>
          </div>
          <div className="grid blog-grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full">
            {loading
              ? Array(6).fill(0).map((_, index) => <SkeletonCard key={index} />)
              : posts?.map((post) => (
                  <Link href={`/blog/${post.id}`} key={post.id} className="group">
                    <article className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                      <Image
                        src={post.image || 'https://i.postimg.cc/Jz2drKXr/Screenshot-2024-10-01-at-16-30-49.png'} // Fallback if image is null
                        alt={post.title}
                        width={400}
                        height={225}
                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="p-6 flex flex-col flex-grow">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow line-clamp-3">
                          {post.excerpt}
                        </p>
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(post.createdAt)}
                          </p>
                          <span className="text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform inline-flex items-center">
                            Read more <ArrowRight className="ml-1 h-4 w-4" />
                          </span>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

// New component for skeleton loading
const SkeletonCard = () => (
  <div className="flex flex-col space-y-4 bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg animate-pulse">
    <div className="w-full h-48 bg-gray-300 dark:bg-gray-700" />
    <div className="p-6 flex flex-col flex-grow">
      <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2" />
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2" />
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3" />
    </div>
  </div>
);
