import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  console.log("MIDDLEWARE LOG:");

  let cookie = request.cookies.get("session_id");
  console.log(cookie);

  
  console.log("test")
  if (!cookie && !request.url.endsWith("/login")) {
    console.log("return to home page");
    return NextResponse.redirect(new URL("/", request.url));
  } else if (cookie && request.url.endsWith("/login")) {
    console.log("Redirecting to dashboard.");
    console.log(request.url);
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
