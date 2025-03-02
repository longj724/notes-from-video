// External Dependencies
import { Play } from "lucide-react";

export const Hero = () => {
  return (
    <div className="bg-gradient-to-b from-blue-50 to-white p-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mt-4 text-center">
          <h1 className="mb-6 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
            Take Smart Notes While Watching YouTube
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-gray-600">
            Transform your video watching experience. Create organized notes,
            timestamps, and summaries directly while watching YouTube videos.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <button className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-8 py-3 text-white hover:bg-blue-700">
              <Play size={20} />
              Try it now
            </button>
            {/* <button className="rounded-lg border border-gray-300 px-8 py-3 hover:bg-gray-50">
              See how it works
            </button> */}
          </div>
        </div>
        <div className="relative mt-16">
          <div className="aspect-video overflow-hidden rounded-lg border shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=1200&q=80"
              alt="VideoNotes app interface"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
