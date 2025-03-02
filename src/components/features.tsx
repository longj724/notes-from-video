// External Dependencies
import { Clock, Edit3 } from "lucide-react";

export const Features = () => {
  const features = [
    {
      icon: <Clock className="h-6 w-6 text-blue-600" />,
      title: "Timestamp Integration",
      description:
        "Create notes with automatic timestamps that sync with your video playback.",
    },
    {
      icon: <Edit3 className="h-6 w-6 text-blue-600" />,
      title: "AI Powered Tools",
      description:
        "Get summaries of videos and ask AI questions about the video content.",
    },
    // {
    //   icon: <BookOpen className="h-6 w-6 text-blue-600" />,
    //   title: "Study Mode",
    //   description:
    //     "Review your notes in an organized study interface with video references.",
    // },
    // {
    //   icon: <Share2 className="h-6 w-6 text-blue-600" />,
    //   title: "Easy Sharing",
    //   description:
    //     "Share your notes with classmates or team members in one click.",
    // },
  ];
  return (
    <div className="bg-white pb-24" id="features">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900">
            Everything You Need for Better Video Notes
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-gray-600">
            Powerful features that help you capture and organize information
            effectively.
          </p>
        </div>
        <div className="flex flex-col gap-4 md:flex-row">
          {features.map((feature, index) => (
            <div
              key={index}
              className="rounded-lg border p-6 transition-shadow hover:shadow-lg"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
