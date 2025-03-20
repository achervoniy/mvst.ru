import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { compose, setPathname } from './middlewares';

export function middleware(request: NextRequest) {
  const register = compose(setPathname(request));

  return register(NextResponse.next());
}

export const config = {
  matcher: [
    // match all routes except static files and APIs
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
