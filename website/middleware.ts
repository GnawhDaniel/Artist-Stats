import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { isAuthenticatedGoogle } from "./functions/auth";

export async function middleware(request: NextRequest) {
  console.log("MIDDLEWARE LOG:");
  // console.log("Full URL:", request.url);
  // console.log("Pathname:", request.nextUrl.pathname);
  // console.log("Search:", request.nextUrl.search);
  // console.log("SearchParams:", request.nextUrl.searchParams);
  
  let session_id = request.cookies.get("session_id");

  const authenticated = await isAuthenticatedGoogle(session_id?.value);
  console.log(authenticated)
  // let authenticated =true;
  if (!authenticated && !request.url.endsWith("/login")) {
    console.log("return to login");
    return NextResponse.redirect(new URL("/login", request.url));
  } else if (authenticated && request.url.endsWith("/login")) {
    console.log("Redirecting to dashboard.");
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login:path*", "/graph/:path*", "/help"],
};
