import AutoRefresh from "./components/AutoRefresh";
import { fetchTopNews } from "@/lib/rss";
import NewsCard from "./components/NewsCard";

type NewsItem = {
  title: string;
  link: string;
  published: string;
  image?: string | null;
  score?: number;
  source?: string;
};

export default async function Home() {
  const indianExpress = await fetchTopNews(
    "https://indianexpress.com/section/india/feed/",
    4
  );
const theHindu = await fetchTopNews(
  "https://www.thehindu.com/news/national/feeder/default.rss",
  5
);

const bbc = await fetchTopNews(
  "https://feeds.bbci.co.uk/news/world/rss.xml",
  2
);

const nytWorld = await fetchTopNews(
  "https://rss.nytimes.com/services/xml/rss/nyt/World.xml",
  2
);

const thePrintWorld = await fetchTopNews(
  "https://theprint.in/category/world/feed/",
  2
);

const ieOpinion = await fetchTopNews(
  "https://indianexpress.com/section/opinion/feed/",
  3
);

const hinduEditorial = await fetchTopNews(
  "https://www.thehindu.com/opinion/editorial/feeder/default.rss",
  3
);

const mitRead = await fetchTopNews(
  "https://www.technologyreview.com/feed/",
  1
);
const owidRead = await fetchTopNews(
  "https://ourworldindata.org/atom.xml",
  1
);


const interestingRead = [
  ...mitRead.map((item: any) => ({
    ...item,
    source: "MIT Technology Review",
  })),
  ...owidRead.map((item: any) => ({
    ...item,
    source: "Our World in Data",
  })),
];

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-4xl mx-auto space-y-12 px-4">
<header className="mb-12">
  <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
    India & World News
  </h1>
  <p className="mt-3 text-lg text-slate-600 max-w-2xl">
    Curated headlines that explain what’s happening — and why it matters.
  </p>
</header>
        <h2 className="text-3xl font-semibold mb-6 tracking-tight text-slate-900">
          Today’s Top News
        </h2>

        <section>
          <div className="space-y-6">
            {indianExpress.map((item: NewsItem, index: number) => (
              <NewsCard
                key={index}
                {...item}
                source="The Indian Express"
              />
            ))}
{theHindu.map((item: NewsItem, index: number) => (
  <NewsCard
    key={`hindu-${index}`}
    {...item}
    source="The Hindu"
  />
))}

          </div>
        </section>
<section>
  <h2 className="text-3xl font-semibold mb-6 tracking-tight text-slate-900 border-b pb-3">
    World Top News
  </h2>

  <div className="space-y-6">
    {bbc.map((item: NewsItem, index: number) => (
      <NewsCard
        key={`bbc-${index}`}
        {...item}
        source="BBC"
      />
    ))}

    {nytWorld.map((item: NewsItem, index: number) => (
      <NewsCard
        key={`nyt-${index}`}
        {...item}
        source="New York Times"
      />
    ))}

{thePrintWorld.map((item: NewsItem, index: number) => (
  <NewsCard
    key={`print-world-${index}`}
    {...item}
    source="The Print"
  />
))}
  </div>
</section>
<section id="opinion">
  <h2 className="text-3xl font-semibold mb-6 tracking-tight text-slate-900 border-b pb-3">
    Opinion & Editorial
  </h2>

  <div className="space-y-10">
    <div>
      <h3 className="text-xl font-medium mb-4">
        Opinion — The Indian Express
      </h3>

      <div className="space-y-6">
        {ieOpinion.map((item: NewsItem, index: number) => (
          <NewsCard
            key={`ie-op-${index}`}
            {...item}
            source="The Indian Express"
          />
        ))}
      </div>
    </div>

    <div>
      <h3 className="text-xl font-medium mb-4">
        Editorial — The Hindu
      </h3>

      <div className="space-y-6">
        {hinduEditorial.map((item: NewsItem, index: number) => (
          <NewsCard
            key={`hindu-ed-${index}`}
            {...item}
            source="The Hindu"
          />
        ))}
      </div>
    </div>
  </div>
</section>
<section id="interesting">
  <h2 className="text-3xl font-semibold mb-6 tracking-tight text-slate-900 border-b pb-3">
    Interesting Read
  </h2>

  <div className="space-y-6">
    {interestingRead.map((item: NewsItem, index: number) => (
      <NewsCard
        key={`interesting-${index}`}
        {...item}
        source={item.source ?? "Interesting Read"}
        showWhyItMatters
      />
    ))}
  </div>
</section>

      </div>
    </div>
  );
}
