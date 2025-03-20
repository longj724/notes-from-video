// External Dependencies
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  BrainCircuit,
  Pencil,
  Video,
} from "lucide-react";

// Internal Dependencies
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          <div className="flex gap-6 md:gap-10">
            <Link href="/" className="flex items-center space-x-2">
              <BookOpen className="h-6 w-6" />
              <span className="inline-block font-bold">Notes From Video</span>
            </Link>
            <nav className="hidden gap-6 md:flex">
              <Link
                href="#features"
                className="flex items-center text-lg font-medium transition-colors hover:text-primary"
              >
                Features
              </Link>
            </nav>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-2">
              <Link
                href="#"
                className="text-sm font-medium text-muted-foreground hover:text-primary"
              >
                Log in
              </Link>
              <Button asChild>
                <Link href="#">Sign up</Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Take Better Notes from YouTube Videos
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Use AI to summarize videos, ask questions, and take
                    timestamped notes — all in one place.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" className="gap-1">
                    Get Started
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="mx-auto flex items-center justify-center">
                <div className="relative aspect-video w-full max-w-[600px] overflow-hidden rounded-xl border bg-muted shadow-xl">
                  <iframe
                    src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                    title="VideoNotes AI Demo"
                    className="absolute inset-0 h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-2">
              <div className="space-y-8">
                <div>
                  <div className="inline-block border-b-2 border-blue-500 pb-1 font-medium text-blue-500">
                    Features
                  </div>
                  <h2 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
                    Turn your videos into
                    <br />
                    Actionable Notes
                  </h2>
                  <p className="mt-4 text-xl text-gray-500">
                    Empower your learning with AI-powered video analysis, smart
                    summaries, and intuitive note organization.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="rounded-lg bg-gray-50 p-6">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <BrainCircuit className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">
                      AI-Powered Summaries
                    </h3>
                    <p className="mt-2 text-gray-500">
                      Extract key insights automatically from any YouTube video.
                    </p>
                  </div>

                  <div className="rounded-lg bg-gray-50 p-6">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Video className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">
                      Timestamp Navigation
                    </h3>
                    <p className="mt-2 text-gray-500">
                      Jump to specific moments with intelligent video
                      timestamps.
                    </p>
                  </div>

                  <div className="rounded-lg bg-gray-50 p-6">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Pencil className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">
                      Custom Annotations
                    </h3>
                    <p className="mt-2 text-gray-500">
                      Create personalized notes that enhance AI-generated
                      content.
                    </p>
                  </div>

                  <div className="rounded-lg bg-gray-50 p-6">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <svg
                        className="h-5 w-5 text-primary"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold">Smart Search</h3>
                    <p className="mt-2 text-gray-500">
                      Find exactly what you need with powerful semantic search.
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative flex items-center justify-center rounded-xl bg-purple-500 p-6">
                <div className="w-full max-w-md space-y-4">
                  <div className="rounded-full bg-white p-3 shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="flex">
                        <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-white bg-gray-200">
                          <img
                            src="/placeholder.svg?height=40&width=40"
                            alt="User avatar"
                          />
                        </div>
                        <div className="-ml-4 h-10 w-10 overflow-hidden rounded-full border-2 border-white bg-gray-200">
                          <img
                            src="/placeholder.svg?height=40&width=40"
                            alt="User avatar"
                          />
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          You have a notification.
                        </p>
                        <p className="text-xs text-gray-500">
                          Click to see more
                        </p>
                      </div>
                      <svg
                        className="h-5 w-5 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>

                  <div className="rounded-xl bg-white p-4 shadow-lg">
                    <div className="mb-3 flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 overflow-hidden rounded-full bg-gray-200">
                          <img
                            src="/placeholder.svg?height=40&width=40"
                            alt="User avatar"
                          />
                        </div>
                        <div>
                          <p className="font-medium">Connor Jackson</p>
                          <p className="text-xs text-gray-500">28 mins ago</p>
                        </div>
                      </div>
                      <button className="text-gray-400 hover:text-gray-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                    <p className="text-sm">
                      Hi Susan, have you seen the lecture notes yet?
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-1 text-gray-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                          />
                        </svg>
                        <span className="text-xs">24</span>
                      </div>
                      <button className="rounded-md bg-gray-900 px-4 py-1 text-xs font-medium text-white">
                        View
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t bg-background py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm text-muted-foreground md:text-left">
            © 2025 Notes From Video. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
