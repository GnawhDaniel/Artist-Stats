import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { isAuthenticated } from "./components/auth";

export async function middleware(request: NextRequest) {
  console.log("MIDDLEWARE LOG:");
  let cookie = request.cookies.get("session_id");

  const authenticated = await isAuthenticated(cookie?.value);

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
  matcher: ["/dashboard/:path*", "/login", "/my-artists/:path*"],
};
