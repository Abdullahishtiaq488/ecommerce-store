import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ["/", "/sign-in", "/sign-up"], // Public routes
  ignoredRoutes: ["/api/checkout"], // Ignore CORS issues for the checkout API
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)"],
};
