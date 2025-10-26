"use server";

export async function getOGImage(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; OGImageFetcher/1.0)",
      },
      next: { revalidate: 86400 }, // Cache for 24 hours
    });

    if (!response.ok) return null;

    const html = await response.text();

    // Try og:image first
    const ogImageMatch = html.match(
      /<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i
    );
    if (ogImageMatch) return ogImageMatch[1];

    // Try twitter:image
    const twitterImageMatch = html.match(
      /<meta\s+name=["']twitter:image["']\s+content=["']([^"']+)["']/i
    );
    if (twitterImageMatch) return twitterImageMatch[1];

    // Try meta image
    const metaImageMatch = html.match(
      /<meta\s+property=["']image["']\s+content=["']([^"']+)["']/i
    );
    if (metaImageMatch) return metaImageMatch[1];

    return null;
  } catch (error) {
    console.error("Error fetching OG image:", error);
    return null;
  }
}
