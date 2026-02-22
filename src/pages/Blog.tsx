import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, Search, Tag } from 'lucide-react';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  image: string;
  readTime: string;
}

const BLOG_POSTS: BlogPost[] = [
  {
    id: 1,
    title: "Understanding Brass Grades for Precision Engineering",
    excerpt: "A comprehensive guide to choosing the right brass alloy for your manufacturing needs, including C360, C464, and specialized alloys.",
    content: "Full content here...",
    author: "Rajesh Kumar",
    date: "2024-01-15",
    category: "Materials",
    image: "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&w=800&q=80",
    readTime: "5 min read"
  },
  {
    id: 2,
    title: "ISO 9001:2015: What It Means for Your Supply Chain",
    excerpt: "How ISO certification ensures consistent quality and why it matters when sourcing components for critical applications.",
    content: "Full content here...",
    author: "Priya Sharma",
    date: "2024-02-20",
    category: "Quality",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
    readTime: "7 min read"
  },
  {
    id: 3,
    title: "CNC vs. Automatic Lathe: Choosing the Right Process",
    excerpt: "Compare machining processes to optimize cost, precision, and lead times for your specific component requirements.",
    content: "Full content here...",
    author: "Amit Patel",
    date: "2024-03-10",
    category: "Technology",
    image: "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?auto=format&fit=crop&w=800&q=80",
    readTime: "6 min read"
  },
  {
    id: 4,
    title: "Sustainable Manufacturing: Our ESG Commitment",
    excerpt: "SAVIMAN's roadmap to carbon neutrality and sustainable practices in precision component manufacturing.",
    content: "Full content here...",
    author: "Satyendra Singh",
    date: "2024-04-05",
    category: "Sustainability",
    image: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=800&q=80",
    readTime: "4 min read"
  },
  {
    id: 5,
    title: "Common Mistakes in Engineering Drawings",
    excerpt: "Avoid these frequent errors in CAD drawings to ensure smooth manufacturing and faster lead times.",
    content: "Full content here...",
    author: "Vikram Joshi",
    date: "2024-05-12",
    category: "Engineering",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
    readTime: "8 min read"
  }
];

const CATEGORIES = ["All", "Materials", "Quality", "Technology", "Sustainability", "Engineering"];

export const Blog: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = BLOG_POSTS.filter(post => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Knowledge Hub</h1>
          <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Insights, guides, and news from the world of precision manufacturing.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-12">
          <div className="flex flex-wrap gap-2 justify-center">
            {CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                  ? 'bg-brass-500 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
            />
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map(post => (
            <article key={post.id} className="bg-white dark:bg-gray-2xl overflow-hidden900 rounded- shadow-lg hover:shadow-xl transition-shadow flex flex-col">
              <div className="h-48 overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-2 text-sm text-brass-600 font-medium mb-3">
                  <Tag size={14} />
                  {post.category}
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 hover:text-brass-600 transition-colors">
                  {post.title}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mb-4 flex-1">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <User size={14} />
                    {post.author}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar size={14} />
                    {new Date(post.date).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No articles found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};
