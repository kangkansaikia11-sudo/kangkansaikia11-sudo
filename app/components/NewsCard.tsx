type NewsCardProps = {
  title: string;
  link: string;
  published: string;
  source: string;
  image?: string | null;
  showWhyItMatters?: boolean;
};

function timeAgo(dateString: string) {
  if (!dateString) return "";

  const date = new Date(Date.parse(dateString));
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "Just now";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;

  return date.toLocaleDateString();
}
function whyItMatters(title: string, source: string) {
  if (source === "MIT Technology Review") {
    return "Explains how technology and long-term innovation shape economic and strategic power.";
  }

  if (source === "Our World in Data") {
    return "Uses data to explain long-term trends shaping societies, economies, and living standards.";
  }

  return "";
}
export default function NewsCard({
  title,
  link,
  published,
  source,
  image,
  showWhyItMatters,
}: NewsCardProps) {
  return (
    <article className="flex gap-4 items-start bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition border-l-4 border-slate-300 hover:border-slate-500">
     {image ? (
  <img
    src={image}
    alt={title}
    className="w-28 h-20 object-cover rounded"
  />
) : (
  <div className="w-28 h-20 rounded bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-xs text-slate-600">
    {source}
  </div>
)}

      <div>
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-lg leading-snug font-medium text-slate-900 hover:underline"
        >
          {title}
        </a>
        <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
  <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
    {source}
  </span>
  <span>·</span>
  <span>{timeAgo(published)}</span>
</div>

{showWhyItMatters && (
  <p className="mt-2 text-sm text-gray-600 italic">
    <span className="font-medium not-italic">Why it matters:</span>{" "}
    {whyItMatters(title, source)}
  </p>
)}
      </div>
    </article>
  );
}
