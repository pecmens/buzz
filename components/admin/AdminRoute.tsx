'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { checkAdminPermission } from '@/lib/permissions';

interface AdminRouteProps {
  children: React.ReactNode;
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function checkPermission() {
      try {
        const result = await checkAdminPermission();
        
        if (!result.hasPermission) {
          // 如果没有权限，重定向到登录页面或403页面
          if (!result.user) {
            router.push('/auth/login?redirect=' + encodeURIComponent(window.location.pathname));
          } else {
            router.push('/403');
          }
          return;
        }
        
        setHasPermission(true);
      } catch (error) {
        console.error('权限检查失败:', error);
        router.push('/auth/login');
      } finally {
        setIsLoading(false);
      }
    }

    checkPermission();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!hasPermission) {
    return null;
  }

  return <>{children}</>;
}