"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Great_Vibes } from "next/font/google";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import ReviewSection from "@/components/ReviewSection";
import DelhiGallery from "@/components/DelhiGallery";
import DelhiCivicIndex from "@/components/DelhiCivicIndex";
import {
  ArrowUpRight,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,

} from "lucide-react";


const citiesList = [
  "Smart Delhi",
  "Smart Citizen",
  "Digital India",
  "Clean India",
];

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
});

export default function Home() {
  // =========================================================
  // TYPING ANIMATION
  // =========================================================

  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(100);

  const [currentCityIndex, setCurrentCityIndex] = useState(0);

  useEffect(() => {
    const i = loopNum % citiesList.length;
    // Heatmap / Issue Filter State
    const fullText = citiesList[i];

    const timer = setTimeout(() => {
      const updatedText = isDeleting
        ? fullText.substring(0, displayText.length - 1)
        : fullText.substring(0, displayText.length + 1);

      setDisplayText(updatedText);

      if (!isDeleting && updatedText === fullText) {
        setTimeout(() => setIsDeleting(true), 2100);
        setTypingSpeed(80);
      } else if (isDeleting && updatedText === "") {
        setIsDeleting(false);
        setLoopNum((prev) => prev + 1);
        setCurrentCityIndex((prev) => (prev + 1) % citiesList.length);
        setTypingSpeed(150);
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, loopNum, typingSpeed]);

  // =========================================================
  // BACKGROUND PARTICLE NETWORK
  // =========================================================

  useEffect(() => {
    const canvas = document.getElementById(
      "bg-canvas"
    ) as HTMLCanvasElement | null;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    let width = 0;
    let height = 0;
    let animationFrameId = 0;

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    resize();

    window.addEventListener("resize", resize);

    // Mouse interaction
    const mouse = {
      x: -1000,
      y: -1000,
      radius: 150,
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    // =========================================================
    // PARTICLE CLASS
    // =========================================================

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      baseRadius: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;

        this.vx = (Math.random() - 0.5) * 0.6;
        this.vy = (Math.random() - 0.5) * 0.6;

        // Thoda base size improve kiya
        this.baseRadius = Math.random() * 1.8 + 1.2;
        this.radius = this.baseRadius;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) {
          this.vx *= -1;
        }

        if (this.y < 0 || this.y > height) {
          this.vy *= -1;
        }

        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;

        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius) {
          this.radius =
            this.baseRadius +
            (1 - distance / mouse.radius) * 2.5;
        } else {
          this.radius = this.baseRadius;
        }
      }

      draw() {
        if (!ctx) return;

        ctx.save();
        ctx.beginPath();

        ctx.arc(
          this.x,
          this.y,
          this.radius,
          0,
          Math.PI * 2
        );

        // Bright neon glow effect
        ctx.shadowColor = "rgba(34, 211, 238, 0.9)";
        ctx.shadowBlur = 10;
        ctx.fillStyle = "rgba(56, 232, 255, 0.95)";
        ctx.fill();
        ctx.restore();
      }
    }

    // Density badhai: formula ko 6000 kiya aur max limit 160 kar di
    const particleCount = Math.min(
      Math.floor((width * height) / 6000),
      160
    );

    const particles: Particle[] = Array.from(
      { length: particleCount },
      () => new Particle()
    );

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;

          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            ctx.beginPath();

            ctx.moveTo(
              particles[i].x,
              particles[i].y
            );

            ctx.lineTo(
              particles[j].x,
              particles[j].y
            );

            ctx.strokeStyle = `rgba(14, 165, 233, ${0.35 * (1 - dist / 150)
              })`;

            ctx.lineWidth = 0.9;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener(
        "mousemove",
        handleMouseMove
      );
      window.removeEventListener(
        "mouseleave",
        handleMouseLeave
      );

      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // =========================================================
  // RETURN
  // =========================================================

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#030712] text-white">

      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="fixed inset-0 z-0 pointer-events-none">
        <Image
          src="/images/auth-bg.png"
          alt="SmartDELHI Background"
          fill
          priority
          className="object-cover object-center opacity-00"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-[#030712]/85 via-[#030712]/75 to-[#030712]/98" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(14,165,233,0.12),transparent_45%)]" />
      </div>

      {/* =====================================================
          PARTICLE CANVAS
      ===================================================== */}

      <canvas
        id="bg-canvas"
        className="fixed inset-0 z-[1] pointer-events-none"
      />

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <div className="relative z-10 flex min-h-screen flex-col px-4 sm:px-6 lg:px-8">

        {/* ===================================================
            SECTION 1 — HERO
        =================================================== */}

        <section className="min-h-screen flex flex-col">

          {/* =================================================
              NAVBAR
          ================================================= */}

          <header className="max-w-7xl mx-auto w-full flex items-center justify-between py-4">

            {/* LOGO */}

            <div className="flex items-center gap-3">

              <div className="relative w-14 h-14">
                <Image
                  src="/images/logo-image.png"
                  alt="SmartDELHI Logo"
                  fill
                  priority
                  className="object-contain"
                />
              </div>

              <div>
                <div className="flex items-center">

                  <span className="font-bold text-3xl tracking-[0.08em]">



                    <span className="-ml-1">
                      Smart
                    </span>

                    <span className="-ml-1 text-blue-500">
                      {" "}
                      DELHI
                    </span>

                  </span>

                </div>

                <div className="text-[8px] tracking-[0.4em] uppercase text-slate-500 ml-1">
                  Make You Responsible
                </div>
              </div>

            </div>

            {/* NAVIGATION */}

            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">

              <a
                href="#"
                className="text-white hover:text-blue-400 transition"
              >
                Home
              </a>

              <a
                href="/auth"
                className="hover:text-blue-400 transition"
              >
                Complains
              </a>

              <a
                href="/auth"
                className="text-blue-400 transition"
              >
                Heat Map
              </a>

              <a
                href="/report"
                className="hover:text-blue-400 transition"
              >
                Report
              </a>

              <Link
                href="/about-us"
                className="text-cyan-400 hover:text-cyan-300 transition"
              >
                About Us
              </Link>

              <a
                href="/contact"
                className="hover:text-blue-400 transition"
              >
                Contact Us
              </a>

            </nav>

            {/* LOGIN */}

            <Link
              href="/auth"
              className="relative overflow-hidden bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium text-sm px-5 py-2.5 rounded-xl shadow-lg shadow-cyan-500/20 transition duration-300"
            >
              <span className="relative z-10">
                Login | Register
              </span>
            </Link>

          </header>

          {/* =================================================
              HERO CONTENT
          ================================================= */}

          <main className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 my-auto py-8 items-center">

            {/* =================================================
                LEFT HERO
            ================================================= */}

            <div className="lg:col-span-7 space-y-6 relative">



              <h1 className="text-4xl sm:text-6xl lg:text-[68px] font-extrabold tracking-tight leading-[0.95]">

                The Digital
                <br />

                <span className="text-white">
                  Opera
                </span>

                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400">
                  ting System
                </span>

                <br />

                for{" "}

                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400">
                  {displayText}
                </span>

                {!isDeleting && (
                  <span className="animate-pulse text-cyan-400 ml-1">
                    .
                  </span>
                )}

              </h1>

              <p className="text-gray-300 text-sm sm:text-base max-w-xl leading-relaxed">
                SmartDELHI combines AI, GIS mapping, citizen
                reporting, predictive analytics and ward
                intelligence into a single real-time civic
                operating platform.
              </p>

              {/* HERO BUTTONS */}

              <div className="flex flex-wrap items-center gap-4 pt-2">

                <button className="group flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-xl font-medium text-sm shadow-xl shadow-blue-500/30 hover:brightness-110 hover:-translate-y-0.5 transition">

                  <i className="fa-solid fa-paper-plane text-xs" />

                  <Link
                    href="/auth"
                  >
                    <span className="relative z-10">
                      Recent Analysis Delhi Report
                    </span>
                  </Link>

                  <span className="group-hover:translate-x-1 transition">
                    →
                  </span>

                </button>



              </div>

              {/* HERO MINI STATS */}

              <div className="grid grid-cols-3 gap-4 max-w-2xl pt-6">

                {/* Wards Card */}
                <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-b from-cyan-950/30 to-slate-900/60 shadow-[0_0_20px_rgba(6,182,212,0.18)] backdrop-blur-xl p-5 transition-all hover:border-cyan-400/60 hover:shadow-[0_0_25px_rgba(6,182,212,0.3)]">
                  <div className="text-3xl font-extrabold text-cyan-300 drop-shadow-[0_0_12px_rgba(6,182,212,0.5)]">
                    250
                  </div>
                  <div className="text-xs font-semibold uppercase tracking-widest text-slate-300 mt-1">
                    Wards
                  </div>
                </div>

                {/* AI Verified Card */}
                <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-b from-emerald-950/30 to-slate-900/60 shadow-[0_0_20px_rgba(16,185,129,0.18)] backdrop-blur-xl p-5 transition-all hover:border-emerald-400/60 hover:shadow-[0_0_25px_rgba(16,185,129,0.3)]">
                  <div className="text-3xl font-extrabold text-emerald-300 drop-shadow-[0_0_12px_rgba(16,185,129,0.5)]">
                    95.8%
                  </div>
                  <div className="text-xs font-semibold uppercase tracking-widest text-slate-300 mt-1">
                    AI Verified
                  </div>
                </div>


              </div>

            </div>
            {/* yahan pr radar ka code pate hoga */}

          </main>

          {/* =================================================
              BOTTOM UTILITY CARDS
          ================================================= */}

          <footer className="max-w-7xl mx-auto w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 pb-6">

            {/* GARBAGE */}

            <div className="bg-gray-900/80 backdrop-blur-md p-4 rounded-2xl relative overflow-hidden group border border-blue-500/20 hover:border-red-500/60 transition shadow-lg">

              <div className="absolute bottom-0 left-0 w-full h-[3px] bg-red-500" />

              <div className="text-red-400 text-lg mb-2">
                <i className="fa-solid fa-trash-can" />
              </div>

              <div className="text-xs text-gray-400 font-medium">
                Garbage
              </div>

              <div className="text-xl font-bold mt-0.5">
                1250
              </div>

              <div className="text-[10px] text-gray-400 mt-1">
                Active Complaints
              </div>

            </div>

            {/* ROADS */}

            <div className="bg-gray-900/80 backdrop-blur-md p-4 rounded-2xl relative overflow-hidden group border border-blue-500/20 hover:border-amber-500/60 transition shadow-lg">

              <div className="absolute bottom-0 left-0 w-full h-[3px] bg-amber-500" />

              <div className="text-amber-400 text-lg mb-2">
                <i className="fa-solid fa-road" />
              </div>

              <div className="text-xs text-gray-400 font-medium">
                Roads Damage
              </div>

              <div className="text-xl font-bold mt-0.5">
                529
              </div>

              <div className="text-[10px] text-gray-400 mt-1">
                Active Complaints
              </div>

            </div>

            {/* WATER */}

            <div className="bg-gray-900/80 backdrop-blur-md p-4 rounded-2xl relative overflow-hidden group border border-blue-500/20 hover:border-cyan-500/60 transition shadow-lg">

              <div className="absolute bottom-0 left-0 w-full h-[3px] bg-cyan-400" />

              <div className="text-cyan-400 text-lg mb-2">
                <i className="fa-solid fa-droplet" />
              </div>

              <div className="text-xs text-gray-400 font-medium">
                Water
              </div>

              <div className="text-xl font-bold mt-0.5">
                100
              </div>

              <div className="text-[10px] text-gray-400 mt-1">
                Active Complaints
              </div>

            </div>

            {/* ELECTRICITY */}

            <div className="bg-gray-900/80 backdrop-blur-md p-4 rounded-2xl relative overflow-hidden group border border-blue-500/20 hover:border-emerald-500/60 transition shadow-lg">

              <div className="absolute bottom-0 left-0 w-full h-[3px] bg-emerald-400" />

              <div className="text-emerald-400 text-lg mb-2">
                <i className="fa-solid fa-bolt-lightning" />
              </div>

              <div className="text-xs text-gray-400 font-medium">
                Electricity
              </div>

              <div className="text-xl font-bold mt-0.5">
                52
              </div>

              <div className="text-[10px] text-gray-400 mt-1">
                Active Complaints
              </div>

            </div>

            {/* SEWAGE */}

            <div className="bg-gray-900/80 backdrop-blur-md p-4 rounded-2xl relative overflow-hidden group border border-blue-500/20 hover:border-purple-500/60 transition shadow-lg">

              <div className="absolute bottom-0 left-0 w-full h-[3px] bg-purple-500" />

              <div className="text-purple-400 text-lg mb-2">
                <i className="fa-solid fa-wave-square" />
              </div>

              <div className="text-xs text-gray-400 font-medium">
                Sewage
              </div>

              <div className="text-xl font-bold mt-0.5">
                200
              </div>

              <div className="text-[10px] text-gray-400 mt-1">
                Active Complaints
              </div>

            </div>

            {/* AQI */}

            <div className="bg-gray-900/80 backdrop-blur-md p-4 rounded-2xl relative overflow-hidden group border border-blue-500/20 hover:border-orange-500/60 transition shadow-lg">

              <div className="absolute bottom-0 left-0 w-full h-[3px] bg-orange-500" />

              <div className="text-orange-400 text-lg mb-2">
                <i className="fa-solid fa-cloud-sun" />
              </div>

              <div className="text-xs text-gray-400 font-medium">
                AvG Delhi AQI
              </div>

              <div className="text-xl font-bold mt-0.5">
                250
              </div>



            </div>

          </footer>

        </section>

        {/* =====================================================
            SECTION 2 — LIVE DELHI HEATMAP
        ===================================================== */}

        <section
          id="heatmap"
          className="max-w-7xl mx-auto w-full pt-16 pb-16 space-y-6"
        >

          {/* =================================================
              HEATMAP HEADER
          ================================================= */}



          {/* =================================================
              LOWER GRID
          ================================================= */}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-12">

            {/* =================================================
                TOP PERFORMING WARDS
            ================================================= */}

            <div className="lg:col-span-7 bg-gray-900/85 backdrop-blur-xl rounded-3xl border border-blue-500/30 p-5 shadow-[0_0_25px_rgba(0,102,255,0.25)]">

              <div className="flex items-center justify-between mb-4">

                <h3 className="text-sm font-bold tracking-wider text-white uppercase">
                  TOP PERFORMING WARDS
                </h3>

                <a
                  href="/report"
                  className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1"
                >
                  <span>
                    View All 272 Wards
                  </span>

                  <i className="fa-solid fa-arrow-right text-[10px]" />
                </a>

              </div>

              {/* TABLE HEADER */}

              <div className="grid grid-cols-12 text-[11px] font-semibold text-gray-400 pb-2 border-b border-white/10 px-2">

                <span className="col-span-1">
                  Rank
                </span>

                <span className="col-span-4">
                  Ward
                </span>

                <span className="col-span-4">
                  Performance Score
                </span>

                <span className="col-span-3 text-right">
                  Avg. Response Time
                </span>

              </div>

              {/* TABLE ROWS */}

              <div className="space-y-3 pt-3 text-xs">

                {/* ROHINI */}

                <div className="grid grid-cols-12 items-center px-2 py-2 rounded-xl bg-white/5 border border-white/5 hover:border-emerald-400/20 transition">

                  <span className="col-span-1 font-bold text-blue-400">
                    1
                  </span>

                  <span className="col-span-4 font-medium text-white">
                    Rohini
                  </span>

                  <span className="col-span-4 flex items-center gap-2">

                    <span className="font-bold">
                      98.7%
                    </span>

                    <div className="w-20 h-1.5 bg-black/50 rounded-full overflow-hidden">
                      <div className="w-[98%] h-full bg-emerald-400 rounded-full" />
                    </div>

                  </span>

                  <span className="col-span-3 text-right font-medium text-gray-300">
                    20 min
                  </span>

                </div>

                {/* janakpuri */}

                <div className="grid grid-cols-12 items-center px-2 py-2 rounded-xl bg-white/5 border border-white/5 hover:border-emerald-400/20 transition">

                  <span className="col-span-1 font-bold text-blue-400">
                    2
                  </span>

                  <span className="col-span-4 font-medium text-white">
                    Janakpuri
                  </span>

                  <span className="col-span-4 flex items-center gap-2">

                    <span className="font-bold">
                      97.2%
                    </span>

                    <div className="w-20 h-1.5 bg-black/50 rounded-full overflow-hidden">
                      <div className="w-[95%] h-full bg-emerald-400 rounded-full" />
                    </div>

                  </span>

                  <span className="col-span-3 text-right font-medium text-gray-300">
                    30 min
                  </span>

                </div>
                {/* Sunder Nagar */}

                <div className="grid grid-cols-12 items-center px-2 py-2 rounded-xl bg-white/5 border border-white/5 hover:border-emerald-400/20 transition">

                  <span className="col-span-1 font-bold text-blue-400">
                    3
                  </span>

                  <span className="col-span-4 font-medium text-white">
                    Sunder Nagar
                  </span>

                  <span className="col-span-4 flex items-center gap-2">

                    <span className="font-bold">
                      94.2%
                    </span>

                    <div className="w-20 h-1.5 bg-black/50 rounded-full overflow-hidden">
                      <div className="w-[95%] h-full bg-emerald-400 rounded-full" />
                    </div>

                  </span>

                  <span className="col-span-3 text-right font-medium text-gray-300">
                    30 min
                  </span>

                </div>
                {/* vasant kunj */}

                <div className="grid grid-cols-12 items-center px-2 py-2 rounded-xl bg-white/5 border border-white/5 hover:border-emerald-400/20 transition">

                  <span className="col-span-1 font-bold text-blue-400">
                    4
                  </span>

                  <span className="col-span-4 font-medium text-white">
                    Vasant Kunj
                  </span>

                  <span className="col-span-4 flex items-center gap-2">

                    <span className="font-bold">
                      92.2%
                    </span>

                    <div className="w-20 h-1.5 bg-black/50 rounded-full overflow-hidden">
                      <div className="w-[95%] h-full bg-emerald-400 rounded-full" />
                    </div>

                  </span>

                  <span className="col-span-3 text-right font-medium text-gray-300">
                    40 min
                  </span>

                </div>
              </div>

            </div>

            {/* =================================================
                SYSTEM PERFORMANCE
            ================================================= */}

            <div className="lg:col-span-5 bg-gray-900/85 backdrop-blur-xl rounded-3xl border border-blue-500/30 p-5 shadow-[0_0_25px_rgba(0,102,255,0.25)]">

              <div className="flex items-center justify-between mb-5">

                <div>

                  <div className="text-[10px] uppercase tracking-[0.2em] text-cyan-400">
                    System Intelligence
                  </div>

                  <h3 className="text-lg font-bold text-white mt-1">
                    City Performance
                  </h3>

                </div>

                <div className="px-3 py-1 rounded-full bg-emerald-400/10 border border-emerald-400/20 text-emerald-300 text-[10px]">
                  Operational
                </div>

              </div>

              {/* PERFORMANCE BARS */}

              <div className="space-y-5">

                <div>

                  <div className="flex justify-between text-xs mb-2">

                    <span className="text-slate-400">
                      Complaint Resolution
                    </span>

                    <span className="text-white font-semibold">
                      92%
                    </span>

                  </div>

                  <div className="h-2 rounded-full bg-black/50 overflow-hidden">

                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: "92%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1 }}
                      className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
                    />

                  </div>

                </div>

                <div>

                  <div className="flex justify-between text-xs mb-2">

                    <span className="text-slate-400">
                      AI Verification
                    </span>

                    <span className="text-white font-semibold">
                      96.8%
                    </span>

                  </div>

                  <div className="h-2 rounded-full bg-black/50 overflow-hidden">

                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: "96.8%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1 }}
                      className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400"
                    />

                  </div>

                </div>

                <div>

                  <div className="flex justify-between text-xs mb-2">

                    <span className="text-slate-400">
                      Worker Availability
                    </span>

                    <span className="text-white font-semibold">
                      88%
                    </span>

                  </div>

                  <div className="h-2 rounded-full bg-black/50 overflow-hidden">

                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: "88%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1 }}
                      className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-400"
                    />

                  </div>

                </div>

              </div>




            </div>

          </div>
          {/* civic index */}
          <DelhiCivicIndex />
          {/*delhi imaage galary*/}
          <DelhiGallery />
          {/* review section  */}
          <ReviewSection />
          {/* =========================================================
    SMARTDELHI — PREMIUM DASHBOARD FOOTER
========================================================= */}

          <footer className="relative mt-24 overflow-hidden border-t border-white/[0.08] bg-[#030814]">

            {/* Ambient glow */}
            <div className="pointer-events-none absolute -top-32 left-[15%] h-72 w-72 rounded-full bg-cyan-500/[0.06] blur-[110px]" />
            <div className="pointer-events-none absolute -bottom-32 right-[10%] h-80 w-80 rounded-full bg-blue-600/[0.07] blur-[120px]" />

            {/* Subtle grid */}
            <div
              className="
      pointer-events-none
      absolute
      inset-0
      opacity-[0.025]
      bg-[linear-gradient(rgba(56,189,248,0.8)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.8)_1px,transparent_1px)]
      bg-[size:42px_42px]
    "
            />

            <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8">

              {/* =====================================================
        TOP BRAND ROW
    ===================================================== */}

              <div className="mb-14 flex flex-col gap-8 border-b border-white/[0.07] pb-10 lg:flex-row lg:items-end lg:justify-between">

                <div className="max-w-xl">

                  <div className="flex items-center gap-3">

                    {/* Logo */}
                    <div
                      className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-2xl
              border
              border-cyan-400/20
              bg-gradient-to-br
              from-cyan-400/10
              to-blue-600/10
              shadow-[0_0_30px_rgba(34,211,238,0.08)]
            "
                    >
                      <span className="text-lg font-black tracking-tight text-cyan-300">
                        SD
                      </span>
                    </div>

                    <div>
                      <h2 className="text-xl font-bold tracking-tight text-white">
                        Smart<span className="text-cyan-400">DELHI</span>
                      </h2>

                      <p className="mt-0.5 text-[10px] uppercase tracking-[0.25em] text-slate-500">
                        Digital Civic Intelligence
                      </p>
                    </div>

                  </div>

                  <p className="mt-6 max-w-lg text-sm leading-7 text-slate-500">
                    A unified digital platform designed to connect citizens,
                    civic workers and administration through intelligent
                    complaint management and real-time civic insights.
                  </p>

                </div>

                {/* System status */}

                <div
                  className="
          inline-flex
          w-fit
          items-center
          gap-3
          rounded-full
          border
          border-emerald-400/15
          bg-emerald-400/[0.04]
          px-4
          py-2.5
        "
                >

                  <span className="relative flex h-2 w-2">
                    <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/60" />
                    <span className="relative h-2 w-2 rounded-full bg-emerald-400" />
                  </span>



                </div>

              </div>


              {/* =====================================================
        MAIN FOOTER GRID
    ===================================================== */}

              <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-5 lg:gap-8">

                {/* -----------------------------------------------------
          SMARTDELHI
      ----------------------------------------------------- */}

                <div className="lg:col-span-1">

                  <h3 className="mb-6 inline-block border-b border-cyan-400/40 pb-2 text-sm font-semibold text-white">
                    SmartDELHI
                  </h3>

                  <ul className="space-y-3.5">

                    <li>
                      <Link
                        href="/"
                        className="group flex items-center gap-1.5 text-sm text-slate-400 transition-colors duration-300 hover:text-cyan-300"
                      >
                        Home
                        <ArrowUpRight className="h-3 w-3 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                      </Link>
                    </li>

                    <li>
                      <Link
                        href="/about-us"
                        className="group flex items-center gap-1.5 text-sm text-slate-400 transition-colors duration-300 hover:text-cyan-300"
                      >
                        About Us
                        <ArrowUpRight className="h-3 w-3 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                      </Link>
                    </li>

                    <li>
                      <Link
                        href="/contact"
                        className="group flex items-center gap-1.5 text-sm text-slate-400 transition-colors duration-300 hover:text-cyan-300"
                      >
                        Contact
                        <ArrowUpRight className="h-3 w-3 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                      </Link>
                    </li>

                  </ul>

                </div>


                {/* -----------------------------------------------------
          CIVIC SERVICES
      ----------------------------------------------------- */}

                <div>

                  <h3 className="mb-6 inline-block border-b border-cyan-400/40 pb-2 text-sm font-semibold text-white">
                    Civic Services
                  </h3>

                  <ul className="space-y-3.5">

                    <li>
                      <Link
                        href="/auth"
                        className="text-sm text-slate-400 transition-colors duration-300 hover:text-cyan-300"
                      >
                        Report a Complaint
                      </Link>
                    </li>

                    <li>
                      <Link
                        href="/auth"
                        className="text-sm text-slate-400 transition-colors duration-300 hover:text-cyan-300"
                      >
                        Track Complaint
                      </Link>
                    </li>

                    <li>
                      <Link
                        href="/auth"
                        className="text-sm text-slate-400 transition-colors duration-300 hover:text-cyan-300"
                      >
                        Citizen Dashboard
                      </Link>
                    </li>

                    <li>
                      <Link
                        href="/live-intelligence"
                        className="text-sm text-slate-400 transition-colors duration-300 hover:text-cyan-300"
                      >
                        Live Intelligence
                      </Link>
                    </li>

                  </ul>

                </div>


                {/* -----------------------------------------------------
          PLATFORM
      ----------------------------------------------------- */}

                <div>

                  <h3 className="mb-6 inline-block border-b border-cyan-400/40 pb-2 text-sm font-semibold text-white">
                    Platform
                  </h3>

                  <ul className="space-y-3.5">

                    <li>
                      <Link
                        href="/reports"
                        className="text-sm text-slate-400 transition-colors duration-300 hover:text-cyan-300"
                      >
                        Reports & Analytics
                      </Link>
                    </li>

                    <li>
                      <Link
                        href="/auth"
                        className="text-sm text-slate-400 transition-colors duration-300 hover:text-cyan-300"
                      >
                        Ward Intelligence
                      </Link>
                    </li>

                    <li>
                      <Link
                        href="/auth"
                        className="text-sm text-slate-400 transition-colors duration-300 hover:text-cyan-300"
                      >
                        Delhi Civic Map
                      </Link>
                    </li>

                    <li>
                      <Link
                        href="/auth"
                        className="text-sm text-slate-400 transition-colors duration-300 hover:text-cyan-300"
                      >
                        Notifications
                      </Link>
                    </li>

                  </ul>

                </div>


                {/* -----------------------------------------------------
          CONNECT
      ----------------------------------------------------- */}

                <div>

                  <h3 className="mb-6 inline-block border-b border-cyan-400/40 pb-2 text-sm font-semibold text-white">
                    Connect
                  </h3>

                  <ul className="space-y-4">

                    <li>
                      <a
                        href="www.linkedin.com/in/vishwanath-s-19858b333"
                        className="group flex items-center gap-3 text-sm text-slate-400 transition-colors duration-300 hover:text-cyan-300"
                      >
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-[11px] font-bold text-slate-400 transition-all group-hover:border-cyan-400/30 group-hover:bg-cyan-400/10 group-hover:text-cyan-300">
                          in
                        </span>
                        LinkedIn
                      </a>
                    </li>

                    <li>
                      <a
                        href=""
                        className="group flex items-center gap-3 text-sm text-slate-400 transition-colors duration-300 hover:text-cyan-300"
                      >
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-[13px] font-semibold text-slate-400 transition-all group-hover:border-cyan-400/30 group-hover:bg-cyan-400/10 group-hover:text-cyan-300">
                          ◎
                        </span>
                        Instagram
                      </a>
                    </li>

                    <li>
                      <a
                        href="https://github.com/vishwanathsingh1703-hub?tab=overview&from=2026-08-01&to=2026-08-14"
                        className="group flex items-center gap-3 text-sm text-slate-400 transition-colors duration-300 hover:text-cyan-300"
                      >
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-[11px] font-bold text-slate-400 transition-all group-hover:border-cyan-400/30 group-hover:bg-cyan-400/10 group-hover:text-cyan-300">
                          GH
                        </span>
                        GitHub
                      </a>
                    </li>

                  </ul>

                </div>


                {/* -----------------------------------------------------
          DELHI CIVIC OFFICE
      ----------------------------------------------------- */}

                <div>

                  <h3 className="mb-6 inline-block border-b border-cyan-400/40 pb-2 text-sm font-semibold text-white">
                    Delhi Civic Network
                  </h3>

                  <div className="space-y-5">

                    <div className="flex gap-3">

                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />

                      <div>
                        <p className="text-sm font-medium text-slate-300">
                          Delhi, India
                        </p>

                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          National Capital Territory (NCR)
                        </p>
                      </div>

                    </div>


                    <div className="flex gap-3">

                      <Phone className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />

                      <div>

                        <p className="text-sm font-medium text-slate-300">
                          +91 8957403462
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          Available through SmartDELHI
                        </p>

                      </div>

                    </div>


                    <div className="flex gap-3">

                      <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />

                      <div>

                        <p className="text-sm font-medium text-slate-300">
                          Secure Platform
                        </p>

                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          Protected civic data infrastructure
                        </p>

                      </div>

                    </div>

                  </div>

                </div>

              </div>


              {/* =====================================================
        BOTTOM BAR
    ===================================================== */}

              <div className="mt-14 flex flex-col gap-5 border-t border-white/[0.07] pt-7 md:flex-row md:items-center md:justify-between">

                <p className="text-xs text-slate-600">
                  © {new Date().getFullYear()} SmartDELHI. Built for a smarter Delhi.
                </p>

                <div className="flex flex-wrap items-center gap-x-6 gap-y-2">

                  <Link
                    href="/privacy"
                    className="text-xs text-slate-600 transition-colors hover:text-cyan-400"
                  >
                    Privacy
                  </Link>

                  <Link
                    href="/terms"
                    className="text-xs text-slate-600 transition-colors hover:text-cyan-400"
                  >
                    Terms
                  </Link>

                  <span className="hidden h-3 w-px bg-white/10 sm:block" />

                  <span className="flex items-center gap-2 text-xs text-slate-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]" />
                    Platform Online
                  </span>

                </div>

              </div>

            </div>
          </footer>
        </section>

      </div>

    </div>
  );
}