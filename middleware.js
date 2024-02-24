import { authMiddleware } from '@clerk/nextjs';


export default authMiddleware({
  publicRoutes: ["/", "/api/getusers"]
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};

//  Protects access from all the other pages except the home page