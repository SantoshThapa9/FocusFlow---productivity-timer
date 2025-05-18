"use client";

import { useState, useRef, useEffect } from "react";
import {
  MdBugReport,
  MdOutlineSettings,
  MdMoreVert,
  MdVerifiedUser,
} from "react-icons/md";
import Image from "next/image";

const DEFAULT_BREAK = 5;
const DEFAULT_SESSION = 25;
const MIN_LEN = 1;
const MAX_LEN = 60;

export default function Home() {
  const [breakLen, setBreakLen] = useState<number>(DEFAULT_BREAK);
  const [sessionLen, setSessionLen] = useState<number>(DEFAULT_SESSION);
  const [timeLeft, setTimeLeft] = useState<number>(DEFAULT_SESSION * 60);
  const [label, setLabel] = useState<"Session" | "Break">("Session");
  const [running, setRunning] = useState<boolean>(false);
  const beepRef = useRef<HTMLAudioElement>(null);

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

  return (
    <main className="h-[100dvh] flex flex-col justify-evenly items-center bg-gradient-to-br  from-slate-900 via-slate-500 to-slate-800 text-white">
      <header className="w-full top-0 absolute container mx-auto px-4 py-3 border-b border-gray-600">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Image src="/favicon.ico" width={36} height={36} alt="logo" />
            <h1 className="font-teko text-2xl">FocusFlow</h1>
          </div>
          <ul className="flex space-x-4 text-2xl">
            {[MdBugReport, MdOutlineSettings, MdVerifiedUser, MdMoreVert].map(
              (Icon, i) => (
                <li key={i}>
                  <a
                    href="https://santosh-gamma.vercel.app/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Icon />
                  </a>
                </li>
              )
            )}
          </ul>
        </nav>
      </header>
      <div className="mt-[10dvh] max-w-6xl  flex justify-evenly w-full">
        <button
          className="border p-2 rounded-2xl hover:scale-95 "
          onClick={() => setPreset(25)}
        >
          Pomodoro
        </button>
        <button
          className="border p-2 rounded-2xl hover:scale-95 "
          onClick={() => setPreset(5)}
        >
          Short Break
        </button>
        <button
          className="border p-2 rounded-2xl hover:scale-95 "
          onClick={() => setPreset(15)}
        >
          Long Break
        </button>
      </div>
      <section
        className={`
          w-full max-w-xs 
          bg-gray-500 
          rounded-3xl p-8 text-center 
         border
          ${
            label === "Session"
              ? "text-white bg-slate-700 "
              : "text-green-300 bg-green-900"
          }
        `}
      >
        <h2 className="text-3xl font-bold  mb-2">{label}</h2>
        <div className="text-5xl sm:text-6xl font-mono font-extrabold">
          {formatTime(timeLeft)}
        </div>
      </section>

      <div className="w-full container mx-auto px-4 grid grid-cols-2 gap-1 justify-items-center max-w-6xl">
        {[
          {
            title: "Break",
            length: breakLen,
            onDec: () => adjust("break", -1),
            onInc: () => adjust("break", 1),
          },
          {
            title: "Session",
            length: sessionLen,
            onDec: () => adjust("session", -1),
            onInc: () => adjust("session", 1),
          },
        ].map(({ title, length, onDec, onInc }) => (
          <div
            key={title}
            className="bg-slate-600 backdrop-blur-sm rounded-2xl p-2 text-center shadow-xl  border max-w-[300px]"
          >
            <h3 className={`text-xl mb-3`}>{title}</h3>
            <div className="flex items-center justify-center space-x-3 sm:space-x-6">
              <button
                onClick={onDec}
                className=" w-10 h-10 border p-2 rounded-2xl hover:scale-95 "
              >
                -
              </button>
              <span className="text-2xl font-bold text-white">{length}</span>
              <button
                onClick={onInc}
                className=" w-10 h-10 border p-2 rounded-2xl hover:scale-95 "
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="w-full container mx-auto px-4 flex flex-row justify-evenly items-center gap-4 mt-10 mb-16">
        <button
          onClick={toggleRun}
          className="border p-2 rounded-2xl hover:scale-95 w-2xs"
        >
          {running ? "Pause" : "Start"}
        </button>
        <button
          onClick={reset}
          className="border p-2 rounded-2xl hover:scale-95 w-2xs"
        >
          Reset
        </button>
      </div>

      <audio
        preload="auto"
        ref={beepRef}
        src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
      />
    </main>
  );
}
