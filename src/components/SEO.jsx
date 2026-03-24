import { Helmet } from "react-helmet-async";

export default function SEO({ title, description, image }) {
  const siteTitle = "Swayam Purwar | Creative Developer";
  const defaultDesc =
    "Portfolio of Swayam Purwar, a Full Stack Developer specializing in React, Node.js, and High-Performance UI.";
  const siteUrl = "https://swayampurwar.vercel.app";
  const defaultImage = "/assets/images/ui/og-image.png"; // Make sure you have a default thumbnail

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{title ? `${title} | SP.DEV` : siteTitle}</title>
      <meta name="description" content={description || defaultDesc} />

      {/* Open Graph / Facebook / LinkedIn */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title || siteTitle} />
      <meta property="og:description" content={description || defaultDesc} />
      <meta
        property="og:image"
        content={image ? `${siteUrl}${image}` : `${siteUrl}${defaultImage}`}
      />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title || siteTitle} />
      <meta name="twitter:description" content={description || defaultDesc} />
      <meta
        name="twitter:image"
        content={image ? `${siteUrl}${image}` : `${siteUrl}${defaultImage}`}
      />
    </Helmet>
  );
}
