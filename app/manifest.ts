import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Resume Manager",
    short_name: "ResumeMgr",
    description: "Upload, organize, and share all your resumes from one place. Create permanent links, swap files silently, and track recruiter views.",
    start_url: "/",
    display: "standalone",
    background_color: "#111010",
    theme_color: "#111010",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
