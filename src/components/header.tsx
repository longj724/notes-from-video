// External Dependencies
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useRouter } from "next/router";
import Link from "next/link";

// Internal Dependencies

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center">
            <span className="text-xl font-bold">Notes From Video</span>
          </div>
          <nav className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-gray-600 hover:text-gray-900">
              Features
            </a>
            {/* <a
              href="#how-it-works"
              className="text-gray-600 hover:text-gray-900"
            >
              How it works
            </a> */}
            {/* <a href="#pricing" className="text-gray-600 hover:text-gray-900">
              Pricing
            </a> */}
            <Link
              className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              href="/sign-in"
            >
              Log In
            </Link>
          </nav>
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="border-t bg-white px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-4">
            <a href="#features" className="text-gray-600 hover:text-gray-900">
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-gray-600 hover:text-gray-900"
            >
              How it works
            </a>
            <a href="#pricing" className="text-gray-600 hover:text-gray-900">
              Pricing
            </a>
            <button className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
              Get Started
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};
