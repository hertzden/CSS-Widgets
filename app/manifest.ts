import type { MetadataRoute } from "next";
import { siteMetadata } from "@/lib/site";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteMetadata.title,
    short_name: siteMetadata.title,
    description: siteMetadata.description,
    start_url: "/",
    display: "standalone",
    background_color: "#150956",
    theme_color: "#150956",
    icons: [
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
