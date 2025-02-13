// import { authMiddleware } from "@clerk/nextjs";

// export default authMiddleware({
//   publicRoutes: ["/", "/sign-in", "/sign-up"], // Public routes
//   ignoredRoutes: ["/api/checkout"], // Ignore CORS issues for the checkout API
// });

// export const config = {
//   matcher: ["/((?!.+\\.[\\w]+$|_next).*)"],
// };

import { clerkMiddleware } from '@clerk/nextjs/server';
 
export default clerkMiddleware()
 
export const config = {
  matcher: [
    '/((?!.*\\..*|_next).*)', // Don't run middleware on static files
    '/', // Run middleware on index page
    '/(api|trpc)(.*)'], // Run middleware on API routes
};