'use client';

import Link from 'next/link';

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-6xl font-bold text-gray-900">403</h1>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            访问被拒绝
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            抱歉，您没有权限访问此页面。
          </p>
        </div>
        
        <div className="mt-8 space-y-4">
          <p className="text-gray-600">
            如果您认为这是一个错误，请联系管理员。
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              返回首页
            </Link>
            
            <Link 
              href="/auth/login"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              重新登录
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}