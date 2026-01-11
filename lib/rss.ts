import Parser from "rss-parser";

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

  // 2️⃣ media:content (Indian Express format)
  if (item.mediaContent) {
    if (item.mediaContent.$?.url) {
      return normalizeImageUrl(item.mediaContent.$.url);
    }

    if (Array.isArray(item.mediaContent)) {
      if (item.mediaContent[0]?.$?.url) {
        return normalizeImageUrl(item.mediaContent[0].$.url);
      }
    }
  }

  // 3️⃣ media:thumbnail
  if (item.mediaThumbnail?.$?.url) {
    return normalizeImageUrl(item.mediaThumbnail.$.url);
  }

  // 4️⃣ HTML fallback
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

export async function fetchTopNews(
  url: string,
  limit: number
) {
  try {
    const feed = await parser.parseURL(url);

    const scored: ScoredItem[] = feed.items.map((item: any) => {
  const image = extractImage(item);


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
