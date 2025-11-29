"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface WelcomeVideoProps {
  onSkip: () => void;
}

export function WelcomeVideo({ onSkip }: WelcomeVideoProps) {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const handleSkip = () => {
    if (dontShowAgain) {
      localStorage.setItem("hasSeenIntro", "true");
    }
    onSkip();
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="max-w-5xl w-full mx-auto bg-white dark:bg-black rounded-2xl shadow-2xl flex overflow-hidden flex-col lg:flex-row">
        {/* Left side: Video */}
        <div className="w-full lg:w-2/5 h-64 lg:h-auto bg-black flex items-center justify-center">
          <video
            src="/uploads/video/Video_HTR_Intro.mp4"
            controls
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right side: Content */}
        <div className="w-full lg:w-3/5 p-8 flex flex-col justify-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome to HTR
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Your all-in-one platform for intelligent media analysis.
            </p>
            <ul className="mt-6 space-y-4 text-gray-700 dark:text-gray-200">
              <li className="flex items-start">
                <span className="text-blue-500 mr-3">&#10003;</span>
                <div>
                  <h3 className="font-semibold">AI-Powered Summaries</h3>
                  <p className="text-sm">
                    Instantly summarize documents and articles with Google
                    Gemini.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-3">&#10003;</span>
                <div>
                  <h3 className="font-semibold">Unified Media Hub</h3>
                  <p className="text-sm">
                    Manage podcasts, videos, and documents in one place.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-3">&#10003;</span>
                <div>
                  <h3 className="font-semibold">Insightful Keyword Analysis</h3>
                  <p className="text-sm">
                    Automatically extract and highlight key terms for deeper
                    understanding.
                  </p>
                </div>
              </li>
            </ul>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <Button onClick={handleSkip} size="lg">
              Get Started
            </Button>
            <div className="flex items-center space-x-2 mt-4 sm:mt-0">
              <Checkbox
                id="dont-show-again"
                checked={dontShowAgain}
                onCheckedChange={(checked: boolean) =>
                  setDontShowAgain(checked)
                }
              />
              <label
                htmlFor="dont-show-again"
                className="text-sm font-medium leading-none text-gray-600 dark:text-gray-300"
              >
                Don't show this again
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
