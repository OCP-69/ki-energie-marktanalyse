/**
 * KI-Beratungsmarkt Energiewirtschaft Deutschland – Hauptseite
 * Daten werden aus der Datenbank via API geladen
 * Design: Technischer Minimalismus mit Energie-Metaphern
 */

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart, Area, BarChart, Bar, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PieChart, Pie, Cell, ResponsiveContainer,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from "recharts";
import { useMarketData, type PestelDimension, type PorterForce } from "@/hooks/useMarketData";
import DocumentManager from "@/components/DocumentManager";

// ─── Navigation Items ───────────────────────────────────────────────────────
const navItems = [
  { id: "overview", label: "Überblick", icon: "📊" },
  { id: "pestel", label: "PESTEL", icon: "🌐" },
  { id: "swot", label: "SWOT", icon: "⚡" },
  { id: "porter", label: "Porter's 5 Forces", icon: "🏆" },
  { id: "competitors", label: "Wettbewerb", icon: "🎯" },
  { id: "strategy", label: "Strategie", icon: "🚀" },
  { id: "documents", label: "Dokumente", icon: "📁" },
];

// ─── Animated Counter ────────────────────────────────────────────────────────
function AnimatedNumber({ value }: { value: string }) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="font-mono">
      {value}
    </motion.span>
  );
}

// ─── Section Header ──────────────────────────────────────────────────────────
function SectionHeader({ title, subtitle, badge }: { title: string; subtitle: string; badge?: string }) {
  return (
    <div className="mb-10">
      {badge && (
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4"
          style={{ background: "rgba(0,212,255,0.1)", color: "#00D4FF", border: "1px solid rgba(0,212,255,0.2)" }}>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 pulse-indicator" />
          {badge}
        </div>
      )}
      <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ fontFamily: "'Syne', sans-serif", color: "#E8EDF5" }}>
        {title}
      </h2>
      <p className="text-base max-w-2xl" style={{ color: "#8899BB", fontFamily: "'Source Sans 3', sans-serif" }}>
        {subtitle}
      </p>
    </div>
  );
}

// ─── PESTEL Factor Card ──────────────────────────────────────────────────────
function PestelCard({ category, data }: { category: string; data: PestelDimension }) {
  const [expanded, setExpanded] = useState<number | null>(null);
  return (
    <div className="energy-card p-6 rounded-xl" style={{ borderColor: `${data.color}33` }}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
          style={{ background: `${data.color}20`, border: `1px solid ${data.color}40` }}>
          {data.icon}
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-widest mb-0.5" style={{ color: data.color }}>
            {category}
          </div>
          <h3 className="font-bold text-sm" style={{ fontFamily: "'Syne', sans-serif", color: "#E8EDF5" }}>
            {data.label}
          </h3>
        </div>
        <div className="ml-auto flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="w-2 h-2 rounded-full"
              style={{ background: i < data.rating ? data.color : "#2A3550" }} />
          ))}
        </div>
      </div>
      <p className="text-xs mb-4 leading-relaxed" style={{ color: "#8899BB" }}>
        {data.summary}
      </p>
      <div className="space-y-2">
        {data.factors.map((factor, idx) => (
          <div key={idx}
            className="rounded-lg overflow-hidden cursor-pointer transition-all"
            style={{
              background: expanded === idx ? `${data.color}10` : "rgba(255,255,255,0.02)",
              border: `1px solid ${expanded === idx ? data.color + "40" : "#2A3550"}`,
            }}
            onClick={() => setExpanded(expanded === idx ? null : idx)}>
            <div className="flex items-center gap-3 p-3">
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                style={{
                  background: factor.impact === "positiv" ? "rgba(16,185,129,0.15)" : factor.impact === "negativ" ? "rgba(239,68,68,0.15)" : "rgba(245,158,11,0.15)",
                  color: factor.impact === "positiv" ? "#10B981" : factor.impact === "negativ" ? "#EF4444" : "#F59E0B",
                }}>
                {factor.impact}
              </span>
              <span className="text-xs font-medium flex-1" style={{ color: "#C8D4E8" }}>{factor.title}</span>
              <span className="text-xs" style={{ color: "#556677" }}>{expanded === idx ? "▲" : "▼"}</span>
            </div>
            <AnimatePresence>
              {expanded === idx && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}>
                  <div className="px-3 pb-3 text-xs leading-relaxed" style={{ color: "#8899BB" }}>
                    {factor.description}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SWOT Quadrant ───────────────────────────────────────────────────────────
function SwotQuadrant({ title, items, color, bgClass, icon }: {
  title: string; items: { title: string; description: string }[];
  color: string; bgClass: string; icon: string;
}) {
  const [expanded, setExpanded] = useState<number | null>(null);
  return (
    <div className={`rounded-xl p-5 border ${bgClass}`}>
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">{icon}</span>
        <h3 className="text-lg font-bold" style={{ fontFamily: "'Syne', sans-serif", color }}>{title}</h3>
        <span className="ml-auto text-xs font-mono px-2 py-0.5 rounded"
          style={{ background: `${color}20`, color }}>{items.length}</span>
      </div>
      <div className="space-y-2">
        {items.map((item, idx) => (
          <div key={idx}
            className="rounded-lg cursor-pointer transition-all p-3"
            style={{
              background: expanded === idx ? `${color}10` : "rgba(255,255,255,0.02)",
              border: `1px solid ${expanded === idx ? color + "40" : "rgba(255,255,255,0.06)"}`,
            }}
            onClick={() => setExpanded(expanded === idx ? null : idx)}>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: color }} />
              <span className="text-sm font-semibold" style={{ color: "#D0DCF0" }}>{item.title}</span>
              <span className="ml-auto text-xs" style={{ color: "#556677" }}>{expanded === idx ? "▲" : "▼"}</span>
            </div>
            <AnimatePresence>
              {expanded === idx && (
                <motion.p
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="text-xs mt-2 leading-relaxed"
                  style={{ color: "#8899BB" }}>
                  {item.description}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Porter Force Card ───────────────────────────────────────────────────────
function PorterCard({ force }: { force: PorterForce }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      className="energy-card rounded-xl p-5 cursor-pointer"
      style={{ borderColor: `${force.color}33` }}
      whileHover={{ scale: 1.01 }}
      onClick={() => setOpen(!open)}>
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
          style={{ background: `${force.color}15`, border: `1px solid ${force.color}30` }}>
          {force.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <h3 className="font-bold text-sm" style={{ fontFamily: "'Syne', sans-serif", color: "#E8EDF5" }}>
              {force.force}
            </h3>
            <span className="ml-auto text-xs font-bold px-3 py-1 rounded-full flex-shrink-0"
              style={{ background: `${force.color}20`, color: force.color }}>
              {force.level}
            </span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <div className="flex-1 h-1.5 rounded-full" style={{ background: "#2A3550" }}>
              <motion.div className="h-full rounded-full" style={{ background: force.color }}
                initial={{ width: 0 }}
                animate={{ width: `${(force.score / 5) * 100}%` }}
                transition={{ duration: 0.8, delay: 0.2 }} />
            </div>
            <span className="text-xs font-mono" style={{ color: force.color }}>{force.score}/5</span>
          </div>
          <p className="text-xs leading-relaxed" style={{ color: "#8899BB" }}>{force.description}</p>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-4 pt-4"
            style={{ borderTop: "1px solid #2A3550" }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {force.factors.map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-xs p-2 rounded-lg"
                  style={{ background: f.direction === "enabler" ? "rgba(16,185,129,0.08)" : "rgba(239,68,68,0.08)" }}>
                  <span style={{ color: f.direction === "enabler" ? "#10B981" : "#EF4444" }}>
                    {f.direction === "enabler" ? "+" : "−"}
                  </span>
                  <span style={{ color: "#C8D4E8" }}>{f.name}</span>
                  <span className="ml-auto font-semibold" style={{ color: f.direction === "enabler" ? "#10B981" : "#EF4444" }}>
                    {f.impact}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Custom Tooltip ──────────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg px-3 py-2 text-xs" style={{ background: "#1A2235", border: "1px solid #2A3550", color: "#E8EDF5" }}>
        <div className="font-semibold mb-1" style={{ color: "#00D4FF" }}>{label}</div>
        <div>USD {payload[0].value} Mio.</div>
      </div>
    );
  }
  return null;
}

// ─── Loading Skeleton ────────────────────────────────────────────────────────
function LoadingSkeleton() {
  return (
    <div className="px-6 md:px-12 py-12 space-y-4">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="h-24 rounded-xl animate-pulse" style={{ background: "#1A2235" }} />
      ))}
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function Home() {
  const [activeSection, setActiveSection] = useState("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const { data, loading, error } = useMarketData();

  // Intersection observer for active section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );
    Object.values(sectionRefs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [data]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) { el.scrollIntoView({ behavior: "smooth", block: "start" }); setMobileMenuOpen(false); }
  };

  // Radar data from PESTEL
  const radarData = data ? Object.entries(data.pestel).map(([, d]) => ({
    subject: d.label, A: d.rating * 20,
  })) : [];

  return (
    <div className="min-h-screen" style={{ background: "#0D1421", fontFamily: "'Source Sans 3', sans-serif" }}>

      {/* ── Fixed Sidebar Navigation ── */}
      <nav className="fixed left-0 top-0 h-full w-64 z-40 hidden lg:flex flex-col"
        style={{ background: "#111827", borderRight: "1px solid #1E2D45" }}>
        <div className="p-6 border-b" style={{ borderColor: "#1E2D45" }}>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
              style={{ background: "linear-gradient(135deg, #00D4FF, #0088CC)" }}>⚡</div>
            <div>
              <div className="text-xs font-bold" style={{ color: "#00D4FF", fontFamily: "'Syne', sans-serif" }}>KI-MARKTANALYSE</div>
              <div className="text-xs" style={{ color: "#556677" }}>Energiewirtschaft DE</div>
            </div>
          </div>
          <div className="mt-3 text-xs px-2 py-1 rounded" style={{ background: "rgba(0,212,255,0.08)", color: "#8899BB" }}>
            Stand: Mai 2025
          </div>
          {/* DB Status */}
          <div className="mt-2 flex items-center gap-1.5 text-xs" style={{ color: "#445566" }}>
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: data ? "#10B981" : loading ? "#F59E0B" : "#EF4444" }} />
            {data ? "Datenbank verbunden" : loading ? "Lädt..." : "Verbindungsfehler"}
          </div>
        </div>
        <div className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => scrollTo(item.id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all text-sm"
              style={{
                background: activeSection === item.id ? "rgba(0,212,255,0.1)" : "transparent",
                color: activeSection === item.id ? "#00D4FF" : "#8899BB",
                border: activeSection === item.id ? "1px solid rgba(0,212,255,0.2)" : "1px solid transparent",
              }}>
              <span className="text-base">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
              {activeSection === item.id && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: "#00D4FF" }} />
              )}
            </button>
          ))}
        </div>
        <div className="p-4 border-t" style={{ borderColor: "#1E2D45" }}>
          <div className="text-xs" style={{ color: "#445566" }}>
            <div className="font-semibold mb-1" style={{ color: "#556677" }}>Quellen</div>
            <div>Grand View Research · Fraunhofer IPK · EY · Bundesnetzagentur · BDEW</div>
          </div>
        </div>
      </nav>

      {/* ── Mobile Header ── */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3"
        style={{ background: "rgba(17,24,39,0.95)", backdropFilter: "blur(10px)", borderBottom: "1px solid #1E2D45" }}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
            style={{ background: "linear-gradient(135deg, #00D4FF, #0088CC)" }}>⚡</div>
          <span className="text-sm font-bold" style={{ color: "#00D4FF", fontFamily: "'Syne', sans-serif" }}>KI-MARKTANALYSE</span>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg" style={{ background: "#1A2235", color: "#8899BB" }}>
          {mobileMenuOpen ? "✕" : "☰"}
        </button>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: -300 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -300 }}
            className="lg:hidden fixed top-14 left-0 bottom-0 w-64 z-40 p-4 space-y-1 overflow-y-auto"
            style={{ background: "#111827", borderRight: "1px solid #1E2D45" }}>
            {navItems.map((item) => (
              <button key={item.id} onClick={() => scrollTo(item.id)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm"
                style={{
                  background: activeSection === item.id ? "rgba(0,212,255,0.1)" : "transparent",
                  color: activeSection === item.id ? "#00D4FF" : "#8899BB",
                }}>
                <span>{item.icon}</span><span>{item.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main Content ── */}
      <main className="lg:ml-64 pt-14 lg:pt-0">

        {/* ── HERO SECTION ── */}
        <section id="overview" ref={(el) => { sectionRefs.current.overview = el; }}
          className="relative overflow-hidden">
          <div className="relative h-[480px] md:h-[560px]">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/111170663/NfUqkLa5fJYKpbK43hHWPu/hero_energy_ai-HEGp7gkSNvXrwdf8EnN2y7.webp"
              alt="KI-Energienetz Deutschland"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ filter: "brightness(0.55) saturate(1.1)" }}
            />
            <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(13,20,33,0.3) 0%, rgba(13,20,33,0.7) 60%, #0D1421 100%)" }} />
            <div className="relative z-10 h-full flex flex-col justify-end px-6 md:px-12 pb-12">
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4"
                  style={{ background: "rgba(0,212,255,0.15)", color: "#00D4FF", border: "1px solid rgba(0,212,255,0.3)", backdropFilter: "blur(10px)" }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 pulse-indicator" />
                  Strategische Marktanalyse · Deutschland 2025
                </div>
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-4"
                  style={{ fontFamily: "'Syne', sans-serif", color: "#FFFFFF" }}>
                  KI-Beratungs- &<br />
                  <span style={{ color: "#00D4FF" }}>Implementierungsmarkt</span>
                </h1>
                <p className="text-base md:text-lg max-w-2xl mb-6" style={{ color: "#A0B4CC" }}>
                  Energieversorgungsunternehmen · Stadtwerke · Netzbetreiber · Energiedienstleister
                </p>
                <div className="flex flex-wrap gap-3">
                  {["PESTEL-Analyse", "SWOT-Matrix", "Porter's Five Forces"].map((tag) => (
                    <span key={tag} className="px-3 py-1 rounded-full text-xs font-semibold"
                      style={{ background: "rgba(255,255,255,0.08)", color: "#C8D4E8", border: "1px solid rgba(255,255,255,0.15)", backdropFilter: "blur(10px)" }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>

          {/* ── Key Stats ── */}
          <div className="px-6 md:px-12 py-8 grid-bg">
            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-24 rounded-xl animate-pulse" style={{ background: "#1A2235" }} />)}
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {(data?.marketStats ?? []).map((stat, idx) => (
                  <motion.div key={stat.id}
                    className="energy-card p-5 rounded-xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 + 0.3 }}>
                    <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: stat.color }}>
                      {stat.label}
                    </div>
                    <div className="text-xl md:text-2xl font-extrabold mb-1" style={{ fontFamily: "'Syne', sans-serif", color: "#E8EDF5" }}>
                      <AnimatedNumber value={stat.value} />
                    </div>
                    <div className="text-xs" style={{ color: "#667788" }}>{stat.sub}</div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── Market Overview Charts ── */}
        <section className="px-6 md:px-12 py-12">
          <div className="section-divider mb-12" />
          {loading ? <LoadingSkeleton /> : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Growth Chart */}
              <div className="energy-card p-6 rounded-xl">
                <h3 className="text-lg font-bold mb-1" style={{ fontFamily: "'Syne', sans-serif", color: "#E8EDF5" }}>
                  Marktentwicklung KI in Energie
                </h3>
                <p className="text-xs mb-5" style={{ color: "#667788" }}>Deutschland, 2021–2033 (USD Mio.) · CAGR 20,6%</p>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={data?.marketGrowth ?? []}>
                    <defs>
                      <linearGradient id="cyanGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#00D4FF" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E2D45" />
                    <XAxis dataKey="year" tick={{ fill: "#667788", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#667788", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="value" stroke="#00D4FF" strokeWidth={2} fill="url(#cyanGrad)" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Use Case Distribution */}
              <div className="energy-card p-6 rounded-xl">
                <h3 className="text-lg font-bold mb-1" style={{ fontFamily: "'Syne', sans-serif", color: "#E8EDF5" }}>
                  KI-Anwendungsfelder nach Segment
                </h3>
                <p className="text-xs mb-5" style={{ color: "#667788" }}>Marktanteil nach Anwendungsbereich 2025</p>
                <div className="flex items-center gap-6">
                  <ResponsiveContainer width="50%" height={200}>
                    <PieChart>
                      <Pie data={data?.useCases ?? []} cx="50%" cy="50%" innerRadius={50} outerRadius={80}
                        paddingAngle={3} dataKey="value">
                        {(data?.useCases ?? []).map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, ""]}
                        contentStyle={{ background: "#1A2235", border: "1px solid #2A3550", borderRadius: "8px", color: "#E8EDF5", fontSize: "12px" }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex-1 space-y-2">
                    {(data?.useCases ?? []).map((item) => (
                      <div key={item.id} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: item.color }} />
                        <span className="text-xs flex-1" style={{ color: "#A0B4CC" }}>{item.name}</span>
                        <span className="text-xs font-mono font-bold" style={{ color: item.color }}>{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Market Context */}
          <div className="mt-8 energy-card p-6 rounded-xl">
            <h3 className="text-lg font-bold mb-4" style={{ fontFamily: "'Syne', sans-serif", color: "#E8EDF5" }}>
              Marktkontext & Rahmenbedingungen
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#00D4FF" }}>Marktteilnehmer</div>
                <div className="space-y-2 text-sm" style={{ color: "#A0B4CC" }}>
                  {[["~1.000", "Stadtwerke in Deutschland"], ["~900", "Strom-Netzbetreiber"], ["4", "Übertragungsnetzbetreiber"], ["250+", "Energiedienstleister"]].map(([num, label]) => (
                    <div key={label} className="flex items-center gap-3">
                      <span className="font-mono font-bold text-base" style={{ color: "#E8EDF5", minWidth: "40px" }}>{num}</span>
                      <span className="text-xs">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#10B981" }}>Wichtige Treiber</div>
                <div className="space-y-2">
                  {["80% EE-Ziel bis 2030", "600 Mrd. EUR Netzinvestitionen bis 2045", "53 Mio. Smart Meter bis 2032", "15 Mio. E-Autos bis 2030 (Ziel)", "Fachkräftemangel in der Branche"].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-xs" style={{ color: "#A0B4CC" }}>
                      <span style={{ color: "#10B981" }}>→</span>{item}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#F59E0B" }}>Zentrale Herausforderungen</div>
                <div className="space-y-2">
                  {["Legacy IT-Infrastruktur (20-30 Jahre alt)", "EU AI Act Compliance-Aufwand", "KRITIS-Cybersecurity-Anforderungen", "Datenschutz (DSGVO) bei Kundendaten", "Investitionsbudgets bei Stadtwerken"].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-xs" style={{ color: "#A0B4CC" }}>
                      <span style={{ color: "#F59E0B" }}>!</span>{item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── PESTEL SECTION ── */}
        <section id="pestel" ref={(el) => { sectionRefs.current.pestel = el; }}
          className="px-6 md:px-12 py-12" style={{ background: "rgba(0,0,0,0.2)" }}>
          <div className="section-divider mb-12" />
          <SectionHeader
            badge="Framework 1 von 3"
            title="PESTEL-Analyse"
            subtitle="Systematische Analyse der sechs externen Makroumfeld-Faktoren, die den KI-Beratungsmarkt für die deutsche Energiewirtschaft prägen."
          />
          {loading ? <LoadingSkeleton /> : (
            <>
              <div className="energy-card p-6 rounded-xl mb-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
                  <div>
                    <h3 className="text-lg font-bold mb-2" style={{ fontFamily: "'Syne', sans-serif", color: "#E8EDF5" }}>
                      PESTEL-Bewertungsübersicht
                    </h3>
                    <p className="text-xs mb-4" style={{ color: "#667788" }}>Einflussintensität je Dimension (1–5)</p>
                    <div className="space-y-3">
                      {Object.entries(data?.pestel ?? {}).map(([key, d]) => (
                        <div key={key} className="flex items-center gap-3">
                          <span className="text-base w-6">{d.icon}</span>
                          <span className="text-xs w-24" style={{ color: "#A0B4CC" }}>{d.label}</span>
                          <div className="flex-1 h-2 rounded-full" style={{ background: "#2A3550" }}>
                            <motion.div className="h-full rounded-full"
                              style={{ background: d.color }}
                              initial={{ width: 0 }}
                              animate={{ width: `${(d.rating / 5) * 100}%` }}
                              transition={{ duration: 0.8 }} />
                          </div>
                          <span className="text-xs font-mono" style={{ color: d.color }}>{d.rating}/5</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={250}>
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="#2A3550" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: "#8899BB", fontSize: 11 }} />
                      <Radar name="Einfluss" dataKey="A" stroke="#00D4FF" fill="#00D4FF" fillOpacity={0.15} strokeWidth={2} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {Object.entries(data?.pestel ?? {}).map(([key, d]) => (
                  <PestelCard key={key} category={key.toUpperCase()} data={d} />
                ))}
              </div>
            </>
          )}
        </section>

        {/* ── SWOT SECTION ── */}
        <section id="swot" ref={(el) => { sectionRefs.current.swot = el; }}
          className="px-6 md:px-12 py-12">
          <div className="section-divider mb-12" />
          <SectionHeader
            badge="Framework 2 von 3"
            title="SWOT-Analyse"
            subtitle="Interne Stärken und Schwächen sowie externe Chancen und Risiken des KI-Beratungsmarkts für die deutsche Energiewirtschaft."
          />
          {loading ? <LoadingSkeleton /> : (
            <>
              <div className="rounded-xl overflow-hidden mb-8 relative h-40">
                <img src="https://d2xsxph8kpxj0f.cloudfront.net/111170663/NfUqkLa5fJYKpbK43hHWPu/swot_visual-4JnCkZKhZ9r77k2NPFVq5N.webp"
                  alt="SWOT Matrix" className="w-full h-full object-cover" style={{ filter: "brightness(0.6)" }} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    {[
                      { label: "Stärken", count: data?.swot.strengths.length ?? 0, color: "#10B981" },
                      { label: "Chancen", count: data?.swot.opportunities.length ?? 0, color: "#00D4FF" },
                      { label: "Schwächen", count: data?.swot.weaknesses.length ?? 0, color: "#F59E0B" },
                      { label: "Risiken", count: data?.swot.threats.length ?? 0, color: "#EF4444" },
                    ].map((item) => (
                      <div key={item.label} className="text-center">
                        <div className="text-3xl font-extrabold" style={{ fontFamily: "'Syne', sans-serif", color: item.color }}>{item.count}</div>
                        <div className="text-xs font-semibold" style={{ color: "#C8D4E8" }}>{item.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <SwotQuadrant title="Stärken (Strengths)" items={data?.swot.strengths ?? []} color="#10B981" bgClass="swot-strengths" icon="💪" />
                <SwotQuadrant title="Chancen (Opportunities)" items={data?.swot.opportunities ?? []} color="#00D4FF" bgClass="swot-opportunities" icon="🚀" />
                <SwotQuadrant title="Schwächen (Weaknesses)" items={data?.swot.weaknesses ?? []} color="#F59E0B" bgClass="swot-weaknesses" icon="⚠️" />
                <SwotQuadrant title="Risiken (Threats)" items={data?.swot.threats ?? []} color="#EF4444" bgClass="swot-threats" icon="🛡️" />
              </div>
              <div className="mt-6 energy-card p-6 rounded-xl">
                <h3 className="text-base font-bold mb-4" style={{ fontFamily: "'Syne', sans-serif", color: "#E8EDF5" }}>SWOT-Kernbotschaft</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm" style={{ color: "#A0B4CC" }}>
                  <div className="p-4 rounded-lg" style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)" }}>
                    <div className="font-semibold mb-2" style={{ color: "#10B981" }}>SO-Strategie (Stärken nutzen)</div>
                    <p className="text-xs leading-relaxed">Die starke technologische Basis Deutschlands (Siemens, SAP, Fraunhofer) kombiniert mit dem politischen Energiewende-Druck schafft ideale Bedingungen für skalierbare KI-Lösungen in Netzplanung und Smart Grid.</p>
                  </div>
                  <div className="p-4 rounded-lg" style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)" }}>
                    <div className="font-semibold mb-2" style={{ color: "#EF4444" }}>WT-Strategie (Risiken minimieren)</div>
                    <p className="text-xs leading-relaxed">Dem Vordringen internationaler Tech-Giganten muss durch tiefe regulatorische Expertise (EU AI Act, KRITIS) und Branchenpartnerschaften begegnet werden, die reine Technologieanbieter nicht replizieren können.</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </section>

        {/* ── PORTER'S FIVE FORCES ── */}
        <section id="porter" ref={(el) => { sectionRefs.current.porter = el; }}
          className="px-6 md:px-12 py-12" style={{ background: "rgba(0,0,0,0.2)" }}>
          <div className="section-divider mb-12" />
          <SectionHeader
            badge="Framework 3 von 3"
            title="Porter's Five Forces"
            subtitle="Analyse der Wettbewerbskräfte im KI-Beratungsmarkt für die deutsche Energiewirtschaft nach dem Modell von Michael E. Porter."
          />
          {loading ? <LoadingSkeleton /> : (
            <>
              <div className="energy-card p-6 rounded-xl mb-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
                  <div>
                    <h3 className="text-base font-bold mb-4" style={{ fontFamily: "'Syne', sans-serif", color: "#E8EDF5" }}>
                      Gesamtbewertung der Wettbewerbskräfte
                    </h3>
                    <div className="space-y-3">
                      {(data?.porter ?? []).map((force, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <span className="text-base">{force.icon}</span>
                          <span className="text-xs flex-1 truncate" style={{ color: "#A0B4CC" }}>{force.force}</span>
                          <div className="flex gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <div key={i} className="w-3 h-3 rounded-sm"
                                style={{ background: i < force.score ? force.color : "#2A3550" }} />
                            ))}
                          </div>
                          <span className="text-xs font-semibold w-20 text-right" style={{ color: force.color }}>{force.level}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={(data?.porter ?? []).map(f => ({ name: f.icon, score: f.score, color: f.color }))}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1E2D45" />
                      <XAxis dataKey="name" tick={{ fill: "#667788", fontSize: 14 }} axisLine={false} tickLine={false} />
                      <YAxis domain={[0, 5]} tick={{ fill: "#667788", fontSize: 11 }} axisLine={false} tickLine={false} />
                      <Tooltip formatter={(value) => [value + "/5", "Intensität"]}
                        contentStyle={{ background: "#1A2235", border: "1px solid #2A3550", borderRadius: "8px", color: "#E8EDF5", fontSize: "12px" }} />
                      <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                        {(data?.porter ?? []).map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="space-y-4">
                {(data?.porter ?? []).map((force, idx) => (
                  <PorterCard key={idx} force={force} />
                ))}
              </div>
            </>
          )}
        </section>

        {/* ── COMPETITORS ── */}
        <section id="competitors" ref={(el) => { sectionRefs.current.competitors = el; }}
          className="px-6 md:px-12 py-12">
          <div className="section-divider mb-12" />
          <SectionHeader
            badge="Wettbewerbslandschaft"
            title="Competitive Landscape"
            subtitle="Hauptakteure im KI-Beratungsmarkt für die deutsche Energiewirtschaft – von internationalen Großberatungen bis zu spezialisierten Startups."
          />
          {loading ? <LoadingSkeleton /> : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="energy-card p-6 rounded-xl">
                <h3 className="text-base font-bold mb-5" style={{ fontFamily: "'Syne', sans-serif", color: "#E8EDF5" }}>
                  Marktpräsenz-Index (Schätzung)
                </h3>
                <div className="space-y-4">
                  {(data?.competitors ?? []).map((comp, idx) => (
                    <div key={comp.id}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div>
                          <span className="text-sm font-semibold" style={{ color: "#E8EDF5" }}>{comp.name}</span>
                          <span className="text-xs ml-2" style={{ color: "#667788" }}>{comp.type}</span>
                        </div>
                        <span className="text-xs font-mono" style={{ color: comp.color }}>{comp.strength}%</span>
                      </div>
                      <div className="h-2 rounded-full" style={{ background: "#2A3550" }}>
                        <motion.div className="h-full rounded-full" style={{ background: comp.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${comp.strength}%` }}
                          transition={{ duration: 0.8, delay: idx * 0.1 }} />
                      </div>
                      <div className="text-xs mt-1" style={{ color: "#556677" }}>{comp.focus}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                {[
                  { category: "Internationale Großberatungen", color: "#A855F7", players: ["Accenture", "McKinsey & Company", "BCG X", "Deloitte", "PwC", "KPMG"], description: "Dominieren durch globale Ressourcen, KI-Investitionen in Milliardenhöhe und breite Industriepräsenz. Accenture ist mit über 1.000 KI-Projekten im Energiesektor Marktführer." },
                  { category: "IT-Dienstleister & Technologieanbieter", color: "#0EA5E9", players: ["IBM", "Capgemini Invent", "SAP", "Siemens Energy", "T-Systems", "Atos/Eviden"], description: "Stärke durch proprietäre Technologieplattformen und tiefe System-Integration. SAP IS-U und Siemens MindSphere sind Marktstandards in der Energiewirtschaft." },
                  { category: "Spezialisierte Energie-KI-Startups", color: "#00D4FF", players: ["Envelio (Netzplanung)", "Ampeers Energy", "gridX", "Octopus Energy", "Flexidao", "Enpal"], description: "Agile Nischenanbieter mit tiefer Domänenexpertise. Wachsen schnell durch fokussierte Lösungen, fehlen aber oft Skalierungskapazität und regulatorische Breite." },
                ].map((cat, idx) => (
                  <div key={idx} className="energy-card p-5 rounded-xl" style={{ borderColor: `${cat.color}30` }}>
                    <div className="font-bold text-sm mb-2" style={{ fontFamily: "'Syne', sans-serif", color: cat.color }}>{cat.category}</div>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {cat.players.map((p) => (
                        <span key={p} className="text-xs px-2 py-0.5 rounded"
                          style={{ background: `${cat.color}15`, color: "#C8D4E8", border: `1px solid ${cat.color}25` }}>{p}</span>
                      ))}
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: "#8899BB" }}>{cat.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* ── STRATEGY SECTION ── */}
        <section id="strategy" ref={(el) => { sectionRefs.current.strategy = el; }}
          className="px-6 md:px-12 py-12" style={{ background: "rgba(0,0,0,0.2)" }}>
          <div className="section-divider mb-12" />
          <SectionHeader
            badge="Strategische Empfehlungen"
            title="Handlungsempfehlungen & Ausblick"
            subtitle="Priorisierte Strategieempfehlungen für KI-Beratungsunternehmen, die im deutschen Energiemarkt tätig sind oder eintreten wollen."
          />
          {loading ? <LoadingSkeleton /> : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
                {(data?.strategicRecommendations ?? []).map((rec, idx) => (
                  <motion.div key={rec.id}
                    className="energy-card p-6 rounded-xl"
                    style={{ borderColor: `${rec.color}30` }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    viewport={{ once: true }}>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                        style={{ background: `${rec.color}15`, border: `1px solid ${rec.color}30` }}>
                        {rec.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                            style={{ background: `${rec.color}20`, color: rec.color }}>{rec.priority}</span>
                          <span className="text-xs" style={{ color: "#556677" }}>{rec.timeframe}</span>
                        </div>
                        <h3 className="font-bold text-sm mb-2" style={{ fontFamily: "'Syne', sans-serif", color: "#E8EDF5" }}>{rec.title}</h3>
                        <p className="text-xs leading-relaxed" style={{ color: "#8899BB" }}>{rec.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="energy-card p-6 rounded-xl mb-8">
                <h3 className="text-lg font-bold mb-5" style={{ fontFamily: "'Syne', sans-serif", color: "#E8EDF5" }}>Marktausblick 2025–2030</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { year: "2025–2026", title: "Konsolidierungsphase", color: "#00D4FF", points: ["EU AI Act Compliance wird Pflicht", "Generative KI für Backoffice-Automatisierung", "Erste Stadtwerke-KI-Kooperationen", "Marktbereinigung bei Startups"] },
                    { year: "2027–2028", title: "Skalierungsphase", color: "#10B981", points: ["Smart Meter Rollout treibt Datenprojekte", "KI-Netzplanung wird Industriestandard", "Digitale Zwillinge für Netze verbreitet", "E-Mobilitäts-KI-Lösungen skalieren"] },
                    { year: "2029–2030", title: "Transformationsphase", color: "#F59E0B", points: ["Autonome KI-Agenten im Netzbetrieb", "Wasserstoff-KI-Infrastruktur entsteht", "Marktgröße >800 Mio. USD in DE", "Neue Geschäftsmodelle durch KI-Plattformen"] },
                  ].map((phase, idx) => (
                    <div key={idx} className="p-4 rounded-xl" style={{ background: `${phase.color}08`, border: `1px solid ${phase.color}25` }}>
                      <div className="text-xs font-mono mb-1" style={{ color: phase.color }}>{phase.year}</div>
                      <div className="font-bold text-sm mb-3" style={{ fontFamily: "'Syne', sans-serif", color: "#E8EDF5" }}>{phase.title}</div>
                      <div className="space-y-1.5">
                        {phase.points.map((p) => (
                          <div key={p} className="flex items-start gap-2 text-xs" style={{ color: "#A0B4CC" }}>
                            <span style={{ color: phase.color, flexShrink: 0 }}>▸</span>{p}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-xl p-6 relative overflow-hidden"
                style={{ background: "linear-gradient(135deg, rgba(0,212,255,0.08), rgba(16,185,129,0.05))", border: "1px solid rgba(0,212,255,0.2)" }}>
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-5"
                  style={{ background: "#00D4FF", transform: "translate(30%, -30%)" }} />
                <h3 className="text-xl font-bold mb-3" style={{ fontFamily: "'Syne', sans-serif", color: "#E8EDF5" }}>Fazit: Ein Markt im Aufbruch</h3>
                <p className="text-sm leading-relaxed max-w-3xl" style={{ color: "#A0B4CC" }}>
                  Der KI-Beratungs- und Implementierungsmarkt für die deutsche Energiewirtschaft befindet sich an einem strategischen Wendepunkt. Die Kombination aus Energiewende-Druck, regulatorischem Wandel (EU AI Act) und technologischer Reife schafft ein Marktfenster, das in den nächsten 3–5 Jahren entschieden wird. Anbieter, die tiefe Branchenexpertise mit KI-Kompetenz und regulatorischem Know-how verbinden, werden überproportional von einem Markt profitieren, der bis 2033 auf über 1,1 Mrd. USD anwachsen soll.
                </p>
              </div>
            </>
          )}
        </section>

        {/* ── DOCUMENTS SECTION ── */}
        <section id="documents" ref={(el) => { sectionRefs.current.documents = el; }}
          className="px-6 md:px-12 py-12">
          <div className="section-divider mb-12" />
          <SectionHeader
            badge="Dokumentenverwaltung"
            title="Dokumente & Dateien"
            subtitle="Laden Sie relevante Studien, Berichte und Analysen hoch. Alle Dateien werden sicher in der Cloud gespeichert und sind jederzeit abrufbar."
          />
          <DocumentManager />
        </section>

        {/* ── FOOTER ── */}
        <footer className="px-6 md:px-12 py-8 mt-4" style={{ borderTop: "1px solid #1E2D45" }}>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="text-sm font-bold mb-1" style={{ fontFamily: "'Syne', sans-serif", color: "#E8EDF5" }}>
                KI-Beratungsmarkt Energiewirtschaft Deutschland
              </div>
              <div className="text-xs" style={{ color: "#445566" }}>
                Marktanalyse 2025 · PESTEL · SWOT · Porter's Five Forces · Full-Stack mit PostgreSQL
              </div>
            </div>
            <div className="text-xs" style={{ color: "#445566" }}>
              <div className="font-semibold mb-1" style={{ color: "#556677" }}>Datenquellen</div>
              <div>Grand View Research · Fraunhofer IPK · EY Deutschland · Bundesnetzagentur · BDEW · Market Research Future</div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
