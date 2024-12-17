'use client'

import { useState } from 'react';
import Link from 'next/link';
import { Appbar } from './components/Appbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users, Radio, Headphones } from 'lucide-react';

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-gray-100">
      <Appbar />
      <header className="px-4 lg:px-6 h-16 flex items-center border-b border-gray-800">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-gray-400 hover:text-white"
        >
          Menu
        </button>
      </header>

      {isMenuOpen && (
        <nav className="flex flex-col items-center space-y-4 py-4 bg-gray-900 border-b border-gray-800 md:hidden">
          <Link className="text-sm font-medium text-gray-300 hover:text-indigo-400" href="#features">
            Features
          </Link>
          <Link className="text-sm font-medium text-gray-300 hover:text-indigo-400" href="#how-it-works">
            How It Works
          </Link>
        </nav>
      )}

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container mx-auto px-4 md:px-6 max-w-screen-lg">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl text-white">
                  Empower Your Stream with Fan-Chosen Music
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-400 md:text-xl lg:text-base">
                  FanTune revolutionizes live streaming by letting your audience pick the soundtrack. Boost engagement and create unforgettable experiences.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex space-x-2">
                  <Input
                    className="flex-1 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                    placeholder="Enter your email"
                    type="email"
                    required
                  />
                  <Button type="submit" className="bg-indigo-500 text-white hover:bg-indigo-600">
                    Get Started
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-gray-900">
          <div className="container mx-auto px-4 md:px-6 max-w-screen-lg">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8 text-white">
              Why Creators Choose FanTune
            </h2>
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
              {[
                { icon: Users, title: 'Boost Engagement', description: 'Increase viewer interaction by letting them choose the music.' },
                { icon: Radio, title: 'Real-time Voting', description: 'Fans vote on the next song in real-time during your stream.' },
                { icon: Headphones, title: 'Extensive Library', description: 'Access millions of tracks to keep your stream fresh and exciting.' },
              ].map(({ icon: Icon, title, description }, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center space-y-2 border border-gray-800 p-4 rounded-lg bg-gray-950"
                >
                  <Icon className="h-12 w-12 mb-2 text-indigo-400" />
                  <h3 className="text-xl font-bold text-white">{title}</h3>
                  <p className="text-sm text-gray-400 text-center">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6 max-w-screen-lg">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8 text-white">
              How FanTune Works
            </h2>
            <div className="grid gap-10 sm:grid-cols-3">
              {[
                { step: '1', title: 'Connect', description: 'Integrate FanTune with your favorite streaming platform.' },
                { step: '2', title: 'Vote', description: 'Your audience votes on the next track to be played.' },
                { step: '3', title: 'Play', description: 'The winning song starts playing on your stream seamlessly.' },
              ].map(({ step, title, description }, index) => (
                <div key={index} className="flex flex-col items-center space-y-2 p-4 rounded-lg">
                  <div className="bg-indigo-500 text-white rounded-full p-2 w-12 h-12 flex items-center justify-center text-2xl font-bold">
                    {step}
                  </div>
                  <h3 className="text-xl font-bold text-white">{title}</h3>
                  <p className="text-sm text-gray-400 text-center">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call-to-Action Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-900">
          <div className="container mx-auto px-4 md:px-6 max-w-screen-lg">
            <div className="flex flex-col items-center space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
                Ready to Amplify Your Stream?
              </h2>
              <p className="mx-auto max-w-[600px] text-gray-400 md:text-xl lg:text-base">
                Join FanTune today and start creating unforgettable streaming experiences with your fans.
              </p>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex space-x-2">
                  <Input
                    className="flex-1 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                    placeholder="Enter your email"
                    type="email"
                    required
                  />
                  <Button type="submit" className="bg-indigo-500 text-white hover:bg-indigo-600">
                    Get Started
                  </Button>
                </form>
                <p className="text-xs text-gray-400">
                  By signing up, you agree to our{' '}
                  <Link className="underline underline-offset-2 hover:text-indigo-400" href="#">
                    Terms & Conditions
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-gray-800">
        <p className="text-xs text-gray-400">© 2024 FanTune. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4 text-gray-400 hover:text-indigo-400" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4 text-gray-400 hover:text-indigo-400" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
