import Parser from "rss-parser";

export const revalidate = 1800; // 30 minutes

const PLACEHOLDER_IMAGE = "/news-placeholder.jpg";

type ScoredItem = {
  title: string;
  link: string;
  published: string;
  image: string | null;
  score: number;
};

const parser: Parser<any, any> = new Parser({
  customFields: {
    item: [
      ["media:content", "mediaContent"],
      ["media:thumbnail", "mediaThumbnail"],
      ["content:encoded", "contentEncoded"],
    ],
  },
});

const POSITIVE_KEYWORDS = [
  "government",
  "supreme court",
  "election",
  "budget",
  "policy",
  "economy",
  "war",
  "crisis",
  "verdict",
  "cabinet",
  "protest",
];

const NEGATIVE_KEYWORDS = [
  "said",
  "sources",
  "according to",
  "probe",
  "update",
];

function scoreArticle(title: string, published: string) {
  let score = 0;
  const lowerTitle = title.toLowerCase();

  const publishedDate = new Date(published);
  const today = new Date();
  if (publishedDate.toDateString() === today.toDateString()) {
    score += 5;
  }

  POSITIVE_KEYWORDS.forEach((word) => {
    if (lowerTitle.includes(word)) score += 3;
  });

  NEGATIVE_KEYWORDS.forEach((word) => {
    if (lowerTitle.includes(word)) score -= 2;
  });

  return score;
}
function isRecent(published: string, maxDays = 1): boolean {
  if (!published) return false;

  const publishedDate = new Date(published);
  const now = new Date();

  const diffDays =
    (now.getTime() - publishedDate.getTime()) / (1000 * 60 * 60 * 24);

  return diffDays <= maxDays;
}

function normalizeImageUrl(url: string | null): string | null {
  if (!url) return null;

  // Fix mixed-content issues
  if (url.startsWith("http://")) {
    return url.replace("http://", "https://");
  }

  return url;
}
function extractImage(item: any): string | null {
  // 1️⃣ enclosure
  if (item.enclosure?.url) {
    return normalizeImageUrl(item.enclosure.url);
  }

  // 2️⃣ media:content (handles IE + The Print)
  if (item.mediaContent) {
    // Object form
    if (item.mediaContent.$?.url) {
      return normalizeImageUrl(item.mediaContent.$.url);
    }

    // Array form
    if (Array.isArray(item.mediaContent)) {
      for (const media of item.mediaContent) {
        if (media?.$?.url) {
          return normalizeImageUrl(media.$.url);
        }
      }
    }
  }

  // 3️⃣ media:thumbnail
  if (item.mediaThumbnail?.$?.url) {
    return normalizeImageUrl(item.mediaThumbnail.$.url);
  }

  // 4️⃣ HTML fallback (last resort)
  const html =
    item.contentEncoded ||
    item.content ||
    item.description ||
    "";

  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (match && match[1]) {
    return normalizeImageUrl(match[1]);
  }

  return null;
}

async function fetchOgImage(pageUrl: string): Promise<string | null> {
  if (!pageUrl) return null;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    const res = await fetch(pageUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome Safari",
      },
      redirect: "follow",
    });

    clearTimeout(timeout);

    if (!res.ok) return null;

    const html = await res.text();

    const og =
      html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);

    if (og?.[1]) return normalizeImageUrl(og[1]);

    const tw =
      html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i) ||
      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i);

    if (tw?.[1]) return normalizeImageUrl(tw[1]);

    return null;
  } catch {
    return null;
  }
}

export async function fetchTopNews(
  url: string,
  limit: number
) {
  try {
    const feed = await parser.parseURL(url);

    const scored: ScoredItem[] = feed.items
  .filter((item: any) =>
    url.includes("opinion/editorial")
      ? isRecent(item.pubDate, 1)
      : true
  )
  .map((item: any) => {
  let image = extractImage(item);

  // STEP 5A: Force placeholder if image is missing
  if (!image) {
    image = PLACEHOLDER_IMAGE;
  }

  return {
    title: item.title ?? "",
    link: item.link ?? "",
    published: item.pubDate ?? "",
    image,
    score: scoreArticle(item.title ?? "", item.pubDate ?? ""),
  };
});

    return scored
      .sort((a: ScoredItem, b: ScoredItem) => b.score - a.score)
      .slice(0, limit);
  } catch (error) {
    console.warn(`RSS fetch failed for ${url}`);
    return [];
  }
}
