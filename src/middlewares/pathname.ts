import { NextRequest, NextResponse } from "next/server";

export function setPathname(request: NextRequest) {
  return (response: NextResponse) => {
    response.headers.set("x-current-path", request.nextUrl.pathname);

    return response;
  };
}
