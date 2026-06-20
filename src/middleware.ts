import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 对 /admin 子路径进行认证检查（不拦截主路径 /admin）
  if (pathname.startsWith('/admin/') && pathname !== '/admin/login') {
    const authCookie = request.cookies.get('admin_auth');
    
    if (authCookie?.value !== 'true') {
      // 未登录，重定向到管理页面（会在那里显示登录表单）
      const adminUrl = new URL('/admin', request.url);
      return NextResponse.redirect(adminUrl);
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
