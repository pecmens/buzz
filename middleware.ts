import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // 检查用户认证状态
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // 如果访问管理页面
  if (req.nextUrl.pathname.startsWith('/admin')) {
    // 如果用户未登录，重定向到登录页面
    if (!session) {
      const redirectUrl = new URL('/auth/login', req.url);
      redirectUrl.searchParams.set('redirect', req.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // 检查用户是否有管理权限
    try {
      const { data: userProfile } = await supabase
        .from('users')
        .select('role')
        .eq('id', session.user.id)
        .single();

      const userRole = userProfile?.role;
      
      // 如果用户不是管理员或编辑者，返回403
      if (userRole !== 'admin' && userRole !== 'editor') {
        return new NextResponse('Forbidden', { status: 403 });
      }
    } catch (error) {
      console.error('权限检查失败:', error);
      return new NextResponse('Internal Server Error', { status: 500 });
    }
  }

  return res;
}

export const config = {
  matcher: [
    /*
     * 匹配所有请求路径，除了以下开头的路径:
     * - _next/static (静态文件)
     * - _next/image (图片优化文件)
     * - favicon.ico (favicon文件)
     * - public文件夹中的文件
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
  // 使用 Node.js runtime 而不是 Edge Runtime
  runtime: 'nodejs',
};