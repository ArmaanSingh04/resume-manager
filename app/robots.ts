import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 
    process.env.NEXT_PUBLIC_APP_URL || 
    process.env.NEXTAUTH_URL || 
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");

  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/login", "/register", "/share/"],
      disallow: ["/api/", "/dashboard/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
