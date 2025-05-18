"use client";

import React, { useState, useRef } from "react";
import { Teko, Roboto } from "next/font/google";

const DEFAULT_BREAK = 5;
const DEFAULT_SESSION = 25;
const MIN_LEN = 1;
const MAX_LEN = 60;
const teko = Teko({ weight: ["300", "400", "700"], subsets: ["latin"] });
const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
});

export default function Home() {
  const [breakLen, setBreakLen] = useState(DEFAULT_BREAK);
  const [sessionLen, setSessionLen] = useState(DEFAULT_SESSION);
  const [timeLeft, setTimeLeft] = useState(DEFAULT_SESSION * 60);
  const [label, setLabel] = useState("Session");
  const [running, setRunning] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const beepRef = useRef<HTMLAudioElement | null>(null);

  const mmss = (secs: number) => {
    const m = String(Math.floor(secs / 60)).padStart(2, "0");
    const s = String(secs % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  const clearTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const adjust = (type: "break" | "session", delta: number) => {
    if (running) return;
    if (type === "break") {
      setBreakLen((len) => {
        const next = Math.min(MAX_LEN, Math.max(MIN_LEN, len + delta));
        return next;
      });
    } else {
      setSessionLen((len) => {
        const next = Math.min(MAX_LEN, Math.max(MIN_LEN, len + delta));
        if (label === "Session") setTimeLeft(next * 60);
        return next;
      });
    }
  };

  const toggleRun = () => {
    if (running) {
      clearTimer();
      setRunning(false);
    } else {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === 0) {
            clearTimer();
            if (beepRef.current) {
              beepRef.current.currentTime = 0;
              beepRef.current.play();
            }
            setTimeout(() => {
              setLabel((lab) => {
                const nextLabel = lab === "Session" ? "Break" : "Session";
                const nextLength =
                  nextLabel === "Session" ? sessionLen : breakLen;
                setTimeLeft(nextLength * 60);
                toggleRun();
                return nextLabel;
              });
            }, 1000);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      setRunning(true);
    }
  };

  const reset = () => {
    clearTimer();
    setRunning(false);
    setBreakLen(DEFAULT_BREAK);
    setSessionLen(DEFAULT_SESSION);
    setLabel("Session");
    setTimeLeft(DEFAULT_SESSION * 60);
    if (beepRef.current) {
      beepRef.current.pause();
      beepRef.current.currentTime = 0;
    }
  };

  return (
    <div
      id="clock"
      className={`${roboto.className} min-h-screen flex flex-col items-center justify-center bg-gray-900 p-8 text-gray-100`}
    >
      <h1 className="text-5xl font-extrabold mb-12 text-indigo-400 tracking-wide">
        25 + 5 Clock
      </h1>

      <div className="flex flex-wrap gap-10 justify-center max-w-3xl w-full mb-12">
        {/* Break Length */}
        <section className="bg-gray-800 rounded-2xl p-8 shadow-lg w-64 flex flex-col items-center">
          <h2
            id="break-label"
            className={`${teko.className} text-2xl font-semibold mb-4 text-indigo-300`}
          >
            Break Length
          </h2>
          <div className="flex items-center justify-center gap-6">
            <button
              id="break-decrement"
              onClick={() => adjust("break", -1)}
              className="bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-red-400 rounded-full w-12 h-12 flex items-center justify-center text-3xl select-none transition"
              aria-label="Decrease Break Length"
            >
              &#8722;
            </button>
            <span
              id="break-length"
              className="text-3xl font-semibold w-12 text-center"
            >
              {breakLen}
            </span>
            <button
              id="break-increment"
              onClick={() => adjust("break", +1)}
              className="bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-green-400 rounded-full w-12 h-12 flex items-center justify-center text-3xl select-none transition"
              aria-label="Increase Break Length"
            >
              &#43;
            </button>
          </div>
        </section>

        {/* Session Length */}
        <section className="bg-indigo-900 rounded-2xl p-8 shadow-lg w-64 flex flex-col items-center">
          <h2
            id="session-label"
            className="text-2xl font-semibold mb-4 text-indigo-200"
          >
            Session Length
          </h2>
          <div className="flex items-center justify-center gap-6">
            <button
              id="session-decrement"
              onClick={() => adjust("session", -1)}
              className="bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-red-400 rounded-full w-12 h-12 flex items-center justify-center text-3xl select-none transition"
              aria-label="Decrease Session Length"
            >
              &#8722;
            </button>
            <span
              id="session-length"
              className="text-3xl font-semibold w-12 text-center text-indigo-100"
            >
              {sessionLen}
            </span>
            <button
              id="session-increment"
              onClick={() => adjust("session", +1)}
              className="bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-green-400 rounded-full w-12 h-12 flex items-center justify-center text-3xl select-none transition"
              aria-label="Increase Session Length"
            >
              &#43;
            </button>
          </div>
        </section>
      </div>

      <section
        className={`p-12 rounded-3xl shadow-2xl w-96 text-center transition-colors duration-500
        ${
          label === "Session"
            ? "bg-indigo-100 text-indigo-900"
            : "bg-green-100 text-green-900"
        }`}
      >
        <h2
          id="timer-label"
          className="text-4xl font-bold mb-6 tracking-wide"
          aria-live="polite"
        >
          {label}
        </h2>
        <div
          id="time-left"
          className="text-7xl font-extrabold font-mono tracking-widest select-none"
        >
          {mmss(timeLeft)}
        </div>
      </section>

      <div className="flex gap-8 mt-12">
        <button
          id="start_stop"
          onClick={toggleRun}
          className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-400 rounded-xl font-semibold text-xl shadow-lg transition"
          aria-pressed={running}
        >
          {running ? "Pause" : "Start"}
        </button>
        <button
          id="reset"
          onClick={reset}
          className="px-8 py-4 bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:ring-gray-500 rounded-xl font-semibold text-xl shadow-lg transition"
        >
          Reset
        </button>
      </div>

      <audio
        id="beep"
        preload="auto"
        ref={beepRef}
        src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
      />
    </div>
  );
}
