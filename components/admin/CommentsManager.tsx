'use client';

import { useState, useEffect } from 'react';
import { 
  getAdminComments, 
  updateCommentStatus, 
  batchUpdateCommentStatus,
  deleteComment,
  batchDeleteComments,
  AdminComment 
} from '@/lib/admin-comments';

export default function CommentsManager() {
  const [comments, setComments] = useState<AdminComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedComments, setSelectedComments] = useState<string[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const pageSize = 10;

  useEffect(() => {
    loadComments();
  }, [currentPage, statusFilter, searchQuery]);

  const loadComments = async () => {
    setLoading(true);
    try {
      const result = await getAdminComments(
        currentPage,
        pageSize,
        statusFilter === 'all' ? undefined : statusFilter,
        searchQuery || undefined
      );
      setComments(result.comments);
      setTotal(result.total);
    } catch (error) {
      console.error('加载评论列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (commentId: string, status: 'pending' | 'approved' | 'spam') => {
    try {
      const result = await updateCommentStatus(commentId, status);
      if (result.success) {
        await loadComments();
      } else {
        alert('更新状态失败: ' + result.error);
      }
    } catch (error) {
      console.error('更新评论状态失败:', error);
      alert('更新状态失败');
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      const result = await deleteComment(commentId);
      if (result.success) {
        await loadComments();
        setShowDeleteConfirm(null);
      } else {
        alert('删除失败: ' + result.error);
      }
    } catch (error) {
      console.error('删除评论失败:', error);
      alert('删除失败');
    }
  };

  const handleBatchAction = async (action: string) => {
    if (selectedComments.length === 0) {
      alert('请选择要操作的评论');
      return;
    }

    try {
      let result;
      switch (action) {
        case 'approve':
          result = await batchUpdateCommentStatus(selectedComments, 'approved');
          break;
        case 'pending':
          result = await batchUpdateCommentStatus(selectedComments, 'pending');
          break;
        case 'spam':
          result = await batchUpdateCommentStatus(selectedComments, 'spam');
          break;
        case 'delete':
          if (confirm('确定要删除选中的评论吗？此操作无法撤销。')) {
            result = await batchDeleteComments(selectedComments);
          } else {
            return;
          }
          break;
        default:
          return;
      }

      if (result.success) {
        await loadComments();
        setSelectedComments([]);
      } else {
        alert('批量操作失败: ' + result.error);
      }
    } catch (error) {
      console.error('批量操作失败:', error);
      alert('批量操作失败');
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedComments(comments.map(comment => comment.id));
    } else {
      setSelectedComments([]);
    }
  };

  const handleSelectComment = (commentId: string, checked: boolean) => {
    if (checked) {
      setSelectedComments([...selectedComments, commentId]);
    } else {
      setSelectedComments(selectedComments.filter(id => id !== commentId));
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: '待审核', color: 'bg-yellow-100 text-yellow-800' },
      approved: { label: '已批准', color: 'bg-green-100 text-green-800' },
      spam: { label: '垃圾评论', color: 'bg-red-100 text-red-800' },
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
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const truncateContent = (content: string, maxLength: number = 100) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">评论管理</h1>
        <p className="mt-1 text-sm text-gray-500">
          管理用户评论，审核和维护社区内容质量。
        </p>
      </div>

      {/* 筛选和搜索 */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex items-center space-x-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-32 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="all">全部状态</option>
              <option value="pending">待审核</option>
              <option value="approved">已批准</option>
              <option value="spam">垃圾评论</option>
            </select>

            {selectedComments.length > 0 && (
              <div className="flex items-center space-x-2">
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      handleBatchAction(e.target.value);
                      e.target.value = '';
                    }
                  }}
                  className="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="">批量操作</option>
                  <option value="approve">批准</option>
                  <option value="pending">待审核</option>
                  <option value="spam">标记垃圾</option>
                  <option value="delete">删除</option>
                </select>
                <span className="text-sm text-gray-500">
                  已选择 {selectedComments.length} 条评论
                </span>
              </div>
            )}
          </div>

          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder="搜索评论内容..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>

      {/* 评论列表 */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-500">加载中...</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">没有找到评论</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={selectedComments.length === comments.length}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      评论内容
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      作者
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      文章
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      状态
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      时间
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {comments.map((comment) => (
                    <tr key={comment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedComments.includes(comment.id)}
                          onChange={(e) => handleSelectComment(comment.id, e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs">
                          {truncateContent(comment.content)}
                        </div>
                        {comment.parent_id && (
                          <div className="text-xs text-gray-500 mt-1">
                            回复评论
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {comment.author_name}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {comment.post_title}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(comment.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(comment.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          {comment.status !== 'approved' && (
                            <button
                              onClick={() => handleStatusChange(comment.id, 'approved')}
                              className="text-green-600 hover:text-green-900"
                            >
                              批准
                            </button>
                          )}
                          {comment.status !== 'spam' && (
                            <button
                              onClick={() => handleStatusChange(comment.id, 'spam')}
                              className="text-orange-600 hover:text-orange-900"
                            >
                              垃圾
                            </button>
                          )}
                          <button
                            onClick={() => setShowDeleteConfirm(comment.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            删除
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 分页 */}
            {totalPages > 1 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    上一页
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    下一页
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      显示第 <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> 到{' '}
                      <span className="font-medium">{Math.min(currentPage * pageSize, total)}</span> 条，
                      共 <span className="font-medium">{total}</span> 条记录
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        上一页
                      </button>
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const page = i + 1;
                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              currentPage === page
                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        下一页
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* 删除确认对话框 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg font-medium text-gray-900">确认删除</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  您确定要删除这条评论吗？此操作无法撤销。
                </p>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={() => handleDelete(showDeleteConfirm)}
                  className="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md w-24 mr-2 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
                >
                  删除
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-24 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}