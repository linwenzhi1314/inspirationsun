import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 暂时移除所有中间件拦截，完全在页面层面处理认证
export function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
