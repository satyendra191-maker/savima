import React, { useState, useEffect, useCallback } from 'react';
import { 
  DataTable, 
  ModalForm, 
  ConfirmDeleteModal, 
  StatusBadge,
  ToggleSwitch,
  useToast,
  Column,
  FormField
} from '../components';
import { BlogPostsService, BlogPost } from '../services/crud';
import { FileText, Eye, Calendar } from 'lucide-react';

const STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' }
];

export const AdminBlogPage: React.FC = () => {
  const toast = useToast();
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingBlog, setDeletingBlog] = useState<BlogPost | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const result = await BlogPostsService.getAll({
        page: currentPage,
        limit: pageSize,
        search,
        status: statusFilter || undefined,
        category: categoryFilter || undefined
      });
      setBlogs(result.data);
      setTotalCount(result.count);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch blog posts');
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, search, statusFilter, categoryFilter, toast]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, categoryFilter]);

  const handleAdd = () => {
    setEditingBlog(null);
    setShowModal(true);
  };

  const handleEdit = (blog: BlogPost) => {
    setEditingBlog(blog);
    setShowModal(true);
  };

  const handleDelete = (blog: BlogPost) => {
    setDeletingBlog(blog);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingBlog) return;
    
    try {
      await BlogPostsService.delete(deletingBlog.id);
      toast.success('Blog post deleted successfully');
      setShowDeleteModal(false);
      setDeletingBlog(null);
      fetchBlogs();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete blog post');
    }
  };

  const handleSubmit = async (values: Record<string, any>) => {
    setSubmitting(true);
    try {
      let imageUrl = values.featured_image;

      if (values.imageFile) {
        const uploaded = await BlogPostsService.uploadImage(values.imageFile);
        if (uploaded) {
          imageUrl = uploaded;
        }
      }

      const blogData = {
        title: values.title,
        slug: values.slug || BlogPostsService.generateSlug(values.title),
        excerpt: values.excerpt,
        content: values.content,
        category: values.category,
        featured_image: imageUrl,
        author: values.author,
        status: values.status || 'draft',
        featured: values.featured || false,
        meta_title: values.meta_title,
        meta_description: values.meta_description
      };

      if (editingBlog) {
        await BlogPostsService.update(editingBlog.id, blogData);
        toast.success('Blog post updated successfully');
      } else {
        await BlogPostsService.create(blogData);
        toast.success('Blog post created successfully');
      }

      setShowModal(false);
      setEditingBlog(null);
      fetchBlogs();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save blog post');
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await BlogPostsService.update(id, { status });
      toast.success('Status updated successfully');
      fetchBlogs();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update status');
    }
  };

  const columns: Column<BlogPost>[] = [
    {
      key: 'title',
      label: 'Post',
      render: (item) => (
        <div className="flex items-center gap-3">
          {item.featured_image ? (
            <img src={item.featured_image} alt={item.title} className="w-12 h-12 rounded-lg object-cover" />
          ) : (
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <FileText className="text-gray-400" size={20} />
            </div>
          )}
          <div>
            <p className="font-medium text-gray-900 dark:text-white">{item.title}</p>
            <p className="text-sm text-gray-500">{item.category}</p>
          </div>
        </div>
      )
    },
    {
      key: 'slug',
      label: 'Slug',
      render: (item) => (
        <span className="text-gray-500 dark:text-gray-400 text-sm">{item.slug}</span>
      )
    },
    {
      key: 'views',
      label: 'Views',
      render: (item) => (
        <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
          <Eye size={14} />
          {item.views || 0}
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (item) => (
        <select
          value={item.status}
          onChange={(e) => handleStatusChange(item.id, e.target.value)}
          className={`px-2 py-1 text-xs rounded-full border-0 cursor-pointer ${
            item.status === 'published' ? 'bg-green-100 text-green-700' :
            item.status === 'draft' ? 'bg-gray-100 text-gray-700' :
            'bg-yellow-100 text-yellow-700'
          }`}
        >
          {STATUS_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      )
    },
    {
      key: 'created_at',
      label: 'Created',
      render: (item) => item.created_at ? new Date(item.created_at).toLocaleDateString() : '-'
    }
  ];

  const fields: FormField[] = [
    { name: 'title', label: 'Title', type: 'text', required: true, placeholder: 'Blog post title' },
    { name: 'slug', label: 'Slug', type: 'text', placeholder: 'Auto-generated if empty' },
    { name: 'excerpt', label: 'Excerpt', type: 'textarea', rows: 2, placeholder: 'Brief summary' },
    { name: 'content', label: 'Content', type: 'textarea', rows: 8, placeholder: 'Full content...' },
    { name: 'category', label: 'Category', type: 'text', placeholder: 'e.g., News, Updates' },
    { name: 'author', label: 'Author', type: 'text', placeholder: 'Author name' },
    { name: 'featured_image', label: 'Featured Image URL', type: 'text', placeholder: 'https://...' },
    { name: 'imageFile', label: 'Upload Featured Image', type: 'file', accept: 'image/*' },
    { name: 'status', label: 'Status', type: 'select', options: STATUS_OPTIONS },
    { name: 'featured', label: 'Featured Post', type: 'switch' },
    { name: 'meta_title', label: 'SEO Title', type: 'text' },
    { name: 'meta_description', label: 'SEO Description', type: 'textarea', rows: 2 }
  ];

  const initialValues = editingBlog ? {
    title: editingBlog.title,
    slug: editingBlog.slug,
    excerpt: editingBlog.excerpt || '',
    content: editingBlog.content || '',
    category: editingBlog.category || '',
    author: editingBlog.author || '',
    featured_image: editingBlog.featured_image || '',
    status: editingBlog.status,
    featured: editingBlog.featured || false,
    meta_title: editingBlog.meta_title || '',
    meta_description: editingBlog.meta_description || ''
  } : {};

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Blog Posts</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage blog content</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-brass-500 text-white rounded-xl hover:bg-brass-600 transition-colors"
        >
          New Post
        </button>
      </div>

      <div className="flex flex-wrap gap-4 items-center">
        <input
          type="text"
          placeholder="Search posts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 w-full sm:w-64"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          <option value="">All Status</option>
          {STATUS_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <DataTable
        data={blogs}
        columns={columns}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        emptyMessage="No blog posts found"
        searchKeys={['title', 'excerpt', 'category']}
        itemsPerPage={pageSize}
        onItemsPerPageChange={setPageSize}
      />

      <ModalForm
        isOpen={showModal}
        title={editingBlog ? 'Edit Blog Post' : 'Create New Post'}
        fields={fields}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        onClose={() => setShowModal(false)}
        submitText={editingBlog ? 'Update' : 'Publish'}
        loading={submitting}
        size="lg"
      />

      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        title="Delete Blog Post"
        message={`Are you sure you want to delete "${deletingBlog?.title}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteModal(false)}
        itemName={deletingBlog?.title}
      />
    </div>
  );
};

export default AdminBlogPage;
