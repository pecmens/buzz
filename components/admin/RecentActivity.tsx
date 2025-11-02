'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getRecentPosts, getRecentComments } from '@/lib/admin-stats';

interface RecentPost {
  id: string;
  title: string;
  status: string;
  created_at: string;
  author: string;
}

interface RecentComment {
  id: string;
  content: string;
  status: string;
  created_at: string;
  author: string;
  postTitle: string;
}

export default function RecentActivity() {
  const [recentPosts, setRecentPosts] = useState<RecentPost[]>([]);
  const [recentComments, setRecentComments] = useState<RecentComment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRecentActivity() {
      try {
        const [posts, comments] = await Promise.all([
          getRecentPosts(5),
          getRecentComments(5),
        ]);
        setRecentPosts(posts);
        setRecentComments(comments);
      } catch (error) {
        console.error('加载最近活动失败:', error);
      } finally {
        setLoading(false);
      }
    }

    loadRecentActivity();
  }, []);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      published: { label: '已发布', color: 'bg-green-100 text-green-800' },
      draft: { label: '草稿', color: 'bg-yellow-100 text-yellow-800' },
      pending: { label: '待审核', color: 'bg-orange-100 text-orange-800' },
      approved: { label: '已批准', color: 'bg-green-100 text-green-800' },
      spam: { label: '垃圾', color: 'bg-red-100 text-red-800' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || {
      label: status,
      color: 'bg-gray-100 text-gray-800'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 最近文章 */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">最近文章</h3>
            <Link 
              href="/admin/posts"
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              查看全部
            </Link>
          </div>
        </div>
        <div className="p-6">
          {recentPosts.length > 0 ? (
            <div className="space-y-4">
              {recentPosts.map((post) => (
                <div key={post.id} className="flex items-start space-x-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {post.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      {post.author} · {formatDate(post.created_at)}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    {getStatusBadge(post.status)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">暂无文章</p>
          )}
        </div>
      </div>

      {/* 最近评论 */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">最近评论</h3>
            <Link 
              href="/admin/comments"
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              查看全部
            </Link>
          </div>
        </div>
        <div className="p-6">
          {recentComments.length > 0 ? (
            <div className="space-y-4">
              {recentComments.map((comment) => (
                <div key={comment.id} className="flex items-start space-x-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 line-clamp-2">
                      {comment.content}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {comment.author} 在 &ldquo;{comment.postTitle}&rdquo; · {formatDate(comment.created_at)}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    {getStatusBadge(comment.status)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">暂无评论</p>
          )}
        </div>
      </div>
    </div>
  );
}