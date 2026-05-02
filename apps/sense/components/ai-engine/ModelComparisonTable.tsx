"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { AI_MODELS, LAYER_META, type ModelLayer } from "@/lib/ai-engine-data";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

type FilterKey = "all" | ModelLayer | "inuse" | "trainable";
type SortKey = "metric" | "latency" | null;

const FILTER_BUTTONS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All Models (18)" },
  { key: "4a", label: "4A — Primary NER" },
  { key: "4b", label: "4B — GLiNER" },
  { key: "4c", label: "4C — Spatial" },
  { key: "4d", label: "4D — Lang Detect" },
  { key: "fw", label: "Framework" },
  { key: "inuse", label: "In Use Only" },
  { key: "trainable", label: "Trainable" },
];

function SortIcon({ sortKey, activeKey, dir }: { sortKey: SortKey; activeKey: SortKey; dir: 1 | -1 }) {
  if (sortKey !== activeKey) return <ArrowUpDown className="w-3.5 h-3.5 opacity-40" />;
  return dir === 1
    ? <ArrowDown className="w-3.5 h-3.5 text-indigo-500" />
    : <ArrowUp className="w-3.5 h-3.5 text-indigo-500" />;
}

export function ModelComparisonTable() {
  const [filter, setFilter] = useState<FilterKey>("all");
  const [sortKey, setSortKey] = useState<SortKey>(null);
  const [sortDir, setSortDir] = useState<1 | -1>(1);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 1 ? -1 : 1));
    } else {
      setSortKey(key);
      setSortDir(1);
    }
  };

  const filteredSorted = useMemo(() => {
    let data = [...AI_MODELS];
    if (filter === "inuse") data = data.filter((m) => m.inUse);
    else if (filter === "trainable") data = data.filter((m) => m.trainable === "yes");
    else if (filter !== "all") data = data.filter((m) => m.layer === filter);

    if (sortKey === "metric") data.sort((a, b) => (b.metricVal - a.metricVal) * sortDir);
    if (sortKey === "latency") data.sort((a, b) => (a.latencyRaw - b.latencyRaw) * sortDir);
    return data;
  }, [filter, sortKey, sortDir]);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-3">
            Technical Comparison
          </p>
          <h2 className="text-4xl sm:text-5xl font-black text-[#0F172A] tracking-tight mb-4">
            Every model. Every metric.
          </h2>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">
            Filter and sort across the full stack. Click column headers to re-rank by accuracy or speed.
          </p>
        </motion.div>

        {/* Filter bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap gap-2 justify-center mb-8"
        >
          {FILTER_BUTTONS.map((btn) => (
            <button
              key={btn.key}
              onClick={() => setFilter(btn.key)}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                filter === btn.key
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200"
                  : "bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-700 hover:-translate-y-0.5"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </motion.div>

        {/* Live count */}
        <p className="text-center text-sm text-slate-400 font-medium mb-6">
          Showing{" "}
          <span className="text-[#0F172A] font-bold">{filteredSorted.length}</span>{" "}
          model{filteredSorted.length !== 1 ? "s" : ""}
        </p>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-[0_8px_30px_-8px_rgba(15,23,42,0.1)]"
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-widest text-slate-500">
                    Model
                  </th>
                  <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-widest text-slate-500">
                    Layer
                  </th>
                  <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-widest text-slate-500">
                    Architecture
                  </th>
                  <th
                    className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-widest text-slate-500 cursor-pointer hover:text-indigo-600 transition-colors select-none"
                    onClick={() => handleSort("metric")}
                  >
                    <span className="flex items-center gap-1.5">
                      Top Metric
                      <SortIcon sortKey="metric" activeKey={sortKey} dir={sortDir} />
                    </span>
                  </th>
                  <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-widest text-slate-500">
                    Context Window
                  </th>
                  <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-widest text-slate-500">
                    Best For
                  </th>
                  <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-widest text-slate-500">
                    Trainable
                  </th>
                  <th
                    className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-widest text-slate-500 cursor-pointer hover:text-indigo-600 transition-colors select-none"
                    onClick={() => handleSort("latency")}
                  >
                    <span className="flex items-center gap-1.5">
                      Latency
                      <SortIcon sortKey="latency" activeKey={sortKey} dir={sortDir} />
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredSorted.map((model, i) => {
                  const meta = LAYER_META[model.layer];
                  return (
                    <motion.tr
                      key={model.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: i * 0.03 }}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      {/* Model name + IN USE badge */}
                      <td className="px-5 py-4 max-w-[220px]">
                        <div className="text-sm font-bold text-[#0F172A] font-mono leading-snug mb-1">
                          {model.name}
                        </div>
                        {model.inUse && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
                            In Use
                          </span>
                        )}
                      </td>

                      {/* Layer badge */}
                      <td className="px-5 py-4">
                        <span
                          className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border whitespace-nowrap"
                          style={{
                            color: meta.color,
                            backgroundColor: meta.bgColor,
                            borderColor: meta.borderColor,
                          }}
                        >
                          {meta.label.split(" — ")[0]}
                        </span>
                      </td>

                      {/* Architecture */}
                      <td className="px-5 py-4 text-sm text-slate-600 max-w-[180px]">
                        {model.arch}
                      </td>

                      {/* Metric */}
                      <td className="px-5 py-4">
                        <div className="text-base font-black text-[#0F172A]">
                          {model.metricDisplay}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{model.metricLabel}</div>
                      </td>

                      {/* Context Window */}
                      <td className="px-5 py-4">
                        <span className="px-2 py-1 rounded-md text-xs font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-100">
                          {model.context}
                        </span>
                      </td>

                      {/* Best For */}
                      <td className="px-5 py-4 text-sm text-slate-500 max-w-[220px] leading-relaxed">
                        {model.bestFor}
                      </td>

                      {/* Trainable */}
                      <td className="px-5 py-4">
                        {model.trainable === "yes" && (
                          <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Yes
                          </span>
                        )}
                        {model.trainable === "limited" && (
                          <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            Limited
                          </span>
                        )}
                        {model.trainable === "partial" && (
                          <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            Partial
                          </span>
                        )}
                        {model.trainable === "customizable" && (
                          <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                            Customizable
                          </span>
                        )}
                      </td>

                      {/* Latency */}
                      <td className="px-5 py-4">
                        <span className="px-2 py-1 rounded-md text-xs font-mono font-bold text-slate-700 bg-slate-100 border border-slate-200">
                          {model.latency}
                        </span>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
