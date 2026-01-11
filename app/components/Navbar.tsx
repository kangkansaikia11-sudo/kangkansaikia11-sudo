export default function Navbar() {
  return (
    <nav className="border-b bg-white sticky top-0 z-50 backdrop-blur">
      <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold">News Hub</h1>
        <div className="space-x-6 text-sm">
          <a href="#top-news" className="hover:underline">
  Top News
</a>
<a href="#opinion" className="hover:underline">
  Opinion & Editorial
</a>
<a href="#interesting" className="hover:underline">
  Interesting
</a>
        </div>
      </div>
    </nav>
  );
}
