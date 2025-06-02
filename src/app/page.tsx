"use client";

import { useState, useRef, useEffect } from "react";
import {
  MdBugReport,
  MdOutlineSettings,
  MdMoreVert,
  MdVerifiedUser,
  MdPlayArrow,
  MdPause,
  MdRefresh,
  MdEmail,
} from "react-icons/md";
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";
import Image from "next/image";
import { IoMdGlobe } from "react-icons/io";

const DEFAULT_BREAK = 5;
const DEFAULT_SESSION = 25;
const MIN_LEN = 1;
const MAX_LEN = 60;
const HOLD_DELAY = 500; // Initial delay before rapid change starts
const HOLD_INTERVAL = 100; // Interval between changes while holding

export default function Home() {
  const [breakLen, setBreakLen] = useState<number>(DEFAULT_BREAK);
  const [sessionLen, setSessionLen] = useState<number>(DEFAULT_SESSION);
  const [timeLeft, setTimeLeft] = useState<number>(DEFAULT_SESSION * 60);
  const [label, setLabel] = useState<"Session" | "Break">("Session");
  const [running, setRunning] = useState<boolean>(false);
  const beepRef = useRef<HTMLAudioElement>(null);
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isHolding, setIsHolding] = useState<boolean>(false);

  const formatTime = (secs: number) =>
    `${String(Math.floor(secs / 60)).padStart(2, "0")}:${String(
      secs % 60
    ).padStart(2, "0")}`;

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setTimeLeft((t) => {
        return t > 0 ? t - 1 : 0;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  useEffect(() => {
    if (timeLeft > 0) return;
    beepRef.current?.play();
    const timeoutId = setTimeout(() => {
      setLabel((lab) => {
        const next = lab === "Session" ? "Break" : "Session";
        setTimeLeft((next === "Session" ? sessionLen : breakLen) * 60);
        return next;
      });
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [timeLeft, sessionLen, breakLen]);

  const toggleRun = () => setRunning((r) => !r);

  const reset = () => {
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

  const clamp = (v: number) => Math.min(MAX_LEN, Math.max(MIN_LEN, v));

  const clearTimers = () => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsHolding(false);
  };

  const handleAdjustStart = (type: "break" | "session", delta: number) => {
    if (running) return;

    // Initial adjustment
    adjust(type, delta);

    // Set up hold timer
    holdTimerRef.current = setTimeout(() => {
      setIsHolding(true);
      // Start rapid adjustments
      intervalRef.current = setInterval(() => {
        adjust(type, delta);
      }, HOLD_INTERVAL);
    }, HOLD_DELAY);
  };

  const handleAdjustEnd = () => {
    clearTimers();
  };

  useEffect(() => {
    // Cleanup timers when component unmounts
    return () => {
      clearTimers();
    };
  }, []);

  // Prevent holding when running
  useEffect(() => {
    if (running) {
      clearTimers();
    }
  }, [running]);

  const adjust = (type: "break" | "session", delta: number) => {
    if (running) return;
    if (type === "break") {
      setBreakLen((len) => clamp(len + delta));
    } else {
      setSessionLen((len) => {
        const next = clamp(len + delta);
        if (label === "Session") setTimeLeft(next * 60);
        return next;
      });
    }
  };

  const setPreset = (value: number) => {
    setSessionLen(value);
    setTimeLeft(value * 60);
  };

  const progress =
    (((label === "Session" ? sessionLen : breakLen) * 60 - timeLeft) /
      ((label === "Session" ? sessionLen : breakLen) * 60)) *
    100;

  return (
    <main className="h-[100svh] flex flex-col bg-[#0a0f1f] text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[120px] animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <header className="w-full sticky top-0 z-50 backdrop-blur-md bg-black/10">
        <nav className="container mx-auto px-4 py-2 border-b border-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 group">
              <div className="relative">
                <Image
                  src="/favicon.ico"
                  width={28}
                  height={28}
                  alt="logo"
                  className="group-hover:rotate-180 transition-transform duration-500 relative z-10"
                />
                <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-md transform group-hover:scale-150 transition-transform duration-500"></div>
              </div>
              <h1 className="font-teko text-2xl bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent font-bold">
                FocusFlow
              </h1>
            </div>
            <ul className="flex space-x-4 text-xl">
              {[MdBugReport, MdOutlineSettings, MdVerifiedUser, MdMoreVert].map(
                (Icon, i) => (
                  <li key={i}>
                    <button className="text-white/70 hover:text-white transition-colors duration-200 hover:scale-110 transform">
                      <Icon />
                    </button>
                  </li>
                )
              )}
            </ul>
          </div>
        </nav>
      </header>

      <div className="flex-1 container mx-auto px-4 flex flex-col justify-between py-4 relative z-10 overflow-y-auto">
        <div className="flex flex-col items-center gap-6">
          {/* Timer Display */}
          <div className="relative w-64 h-64 sm:w-72 sm:h-72">
            <div className="absolute inset-0 rounded-full border-4 border-white/5"></div>
            <div
              className="absolute inset-0 rounded-full border-4 border-blue-500/50 transition-all duration-1000"
              style={{
                clipPath: `polygon(0% 0%, ${progress}% 0%, ${progress}% 100%, 0% 100%)`,
              }}
            ></div>
            <div className="absolute inset-4 rounded-full bg-black/20 backdrop-blur-xl flex flex-col items-center justify-center border border-white/10">
              <h2 className="text-xl font-medium text-white/80 mb-1">
                {label}
              </h2>
              <div className="text-5xl sm:text-6xl font-mono font-bold tracking-wider text-white">
                {formatTime(timeLeft)}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-4">
            <button
              onClick={toggleRun}
              className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-2xl hover:scale-110 transition-transform duration-200 shadow-lg shadow-blue-500/20"
            >
              {running ? <MdPause /> : <MdPlayArrow />}
            </button>
            <button
              onClick={reset}
              className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-2xl hover:scale-110 transition-transform duration-200"
            >
              <MdRefresh />
            </button>
          </div>
        </div>

        {/* Settings and Presets */}
        <div className="space-y-4">
          {/* Settings */}
          <div className="grid grid-cols-2 gap-3 w-full">
            {[
              {
                title: "Break",
                length: breakLen,
                onDec: () => handleAdjustStart("break", -1),
                onInc: () => handleAdjustStart("break", 1),
              },
              {
                title: "Session",
                length: sessionLen,
                onDec: () => handleAdjustStart("session", -1),
                onInc: () => handleAdjustStart("session", 1),
              },
            ].map(({ title, length, onDec, onInc }) => (
              <div
                key={title}
                className="bg-white/5 backdrop-blur-md rounded-xl p-3 border border-white/10 hover:border-blue-500/30 transition-all duration-300"
              >
                <h3 className="text-sm font-medium text-white/80 mb-2">
                  {title}
                </h3>
                <div className="flex items-center justify-between">
                  <button
                    onMouseDown={onDec}
                    onMouseUp={handleAdjustEnd}
                    onMouseLeave={handleAdjustEnd}
                    onTouchStart={onDec}
                    onTouchEnd={handleAdjustEnd}
                    className={`w-8 h-8 rounded-lg bg-black/20 hover:bg-black/30 flex items-center justify-center text-lg 
                      transition-colors duration-200 ${
                        isHolding ? "bg-black/40" : ""
                      }`}
                  >
                    -
                  </button>
                  <span className="text-2xl font-bold">{length}</span>
                  <button
                    onMouseDown={onInc}
                    onMouseUp={handleAdjustEnd}
                    onMouseLeave={handleAdjustEnd}
                    onTouchStart={onInc}
                    onTouchEnd={handleAdjustEnd}
                    className={`w-8 h-8 rounded-lg bg-black/20 hover:bg-black/30 flex items-center justify-center text-lg 
                      transition-colors duration-200 ${
                        isHolding ? "bg-black/40" : ""
                      }`}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Presets */}
          <div className="flex gap-2 w-full">
            {[
              { name: "Pomodoro", duration: 25 },
              { name: "Short", duration: 5 },
              { name: "Long", duration: 15 },
            ].map((preset) => (
              <button
                key={preset.name}
                onClick={() => setPreset(preset.duration)}
                className="flex-1 px-3 py-2 rounded-xl bg-white/5 backdrop-blur-sm
                  border border-white/10 hover:border-blue-500/30 hover:bg-white/10
                  transition-all duration-300 text-white/80 hover:text-white text-sm"
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <footer className="w-full backdrop-blur-md bg-black/10 border-t border-white/5 py-4 relative z-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col  items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Image
                src="/favicon.ico"
                width={20}
                height={20}
                alt="logo"
                className="opacity-50"
              />
              <p className="text-sm text-white/50">
                FocusFlow &copy; {new Date().getFullYear()}
              </p>
            </div>

            <div className="flex items-center gap-6">
              <a
                href="https://github.com/SantoshThapa9"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/50 hover:text-white transition-colors duration-200"
              >
                <FaGithub className="text-xl" />
              </a>
              <a
                href="https://x.com/SantoshThapa689"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/50 hover:text-white transition-colors duration-200"
              >
                <FaTwitter className="text-xl" />
              </a>
              <a
                href="https://www.linkedin.com/in/santosh986/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/50 hover:text-white transition-colors duration-200"
              >
                <FaLinkedin className="text-xl" />
              </a>
              <a
                href="https://santosh-gamma.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/50 hover:text-white transition-colors duration-200"
              >
                <IoMdGlobe className="text-xl" />
              </a>

              <a
                href="mailto:contact@focusflow.com"
                className="text-white/50 hover:text-white transition-colors duration-200"
              >
                <MdEmail className="text-xl" />
              </a>
            </div>
          </div>
        </div>
      </footer>

      <audio
        preload="auto"
        ref={beepRef}
        src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
      />
    </main>
  );
}
