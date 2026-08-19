export { default } from "next-auth/middleware";

export const config = {
  // Guard everything under /internal except the sign-in page itself.
  matcher: ["/internal/((?!sign-in).*)"],
};
