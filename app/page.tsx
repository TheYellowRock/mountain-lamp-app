"use client";

import dynamic from "next/dynamic";
import Image from "next/image";

const MapSearch = dynamic(() => import("./components/MapSearch"), {
  ssr: false,
});

export default function HomePage() {
  return (
<main className="p-4">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-4">
    {/* Map & Heading */}
    <div>
      <h1 className="text-2xl font-bold mb-4">Let's find your Mountain</h1>
      <MapSearch />
    </div>

    {/* Image Section */}
    <div className="flex items-center justify-center p-8">
      <Image
        src="/handle.jpg"
        alt="Mountain handle"
        width={500}
        height={500}
      />
    </div>
  </div>
</main>
  );
}
