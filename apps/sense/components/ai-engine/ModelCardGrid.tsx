"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as Tabs from "@radix-ui/react-tabs";
import { AI_MODELS, LAYER_META, type ModelLayer } from "@/lib/ai-engine-data";
import { CheckCircle2, Clock } from "lucide-react";

const TAB_LAYERS: ModelLayer[] = ["4a", "4b", "4c", "4d", "fw"];

function ModelCard({
  model,
  index,
}: {
  model: (typeof AI_MODELS)[0];
  index: number;
}) {
  const meta = LAYER_META[model.layer];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      className="
        relative
        bg-white dark:bg-[#0F172A]/90
        border border-slate-200/80 dark:border-white/10
        rounded-xl overflow-hidden group
        hover:-translate-y-1
        hover:shadow-[0_16px_40px_-12px_rgba(15,23,42,0.14)]
        dark:hover:shadow-[0_20px_50px_-12px_rgba(59,130,246,0.18)]
        transition-all duration-300
        backdrop-blur-xl
      "
    >
      {/* Colored left border strip */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1"
        style={{
          background: model.inUse
            ? "linear-gradient(180deg, #10B981, #059669)"
            : "linear-gradient(180deg, #F59E0B, #D97706)",
          boxShadow: model.inUse
            ? "0 0 10px rgba(16,185,129,0.4)"
            : "0 0 10px rgba(245,158,11,0.4)",
        }}
      />

      <div className="pl-5 pr-5 pt-5 pb-5">
        {/* Badges row */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          <span
            className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border"
            style={{
              color: meta.color,
              backgroundColor: meta.bgColor,
              borderColor: meta.borderColor,
            }}
          >
            {LAYER_META[model.layer].label.split(" — ")[0]}
          </span>

          {model.inUse ? (
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/20 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse inline-block" />
              In Use
            </span>
          ) : (
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/20">
              Coming Soon
            </span>
          )}

          {model.trainable === "yes" && (
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/20">
              Trainable
            </span>
          )}
        </div>

        {/* Model name */}
        <h3 className="text-sm font-bold text-[#0F172A] dark:text-white mb-2 leading-snug font-mono">
          {model.name}
        </h3>

        {/* Architecture */}
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 font-medium">
          {model.arch}
        </p>

        {/* Description */}
        <p className="text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
          {model.description}
        </p>

        {/* Metric + Latency row */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-white/10">
          <div>
            <div className="text-lg font-black text-[#0F172A] dark:text-white">
              {model.metricDisplay}
            </div>
            <div className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
              {model.metricLabel}
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-300 font-mono bg-slate-50 dark:bg-white/5 px-2.5 py-1 rounded-md border border-slate-100 dark:border-white/10">
            <Clock className="w-3 h-3" />
            {model.latency}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function ModelCardGrid() {
  const [activeTab, setActiveTab] = useState<ModelLayer>("4a");

  const activeModels = AI_MODELS.filter((m) => m.layer === activeTab);

  const meta = LAYER_META[activeTab];

  return (
    <section
      id="model-stack"
      className="
        py-20
        bg-slate-50/80
        dark:bg-[#020617]
        relative
        overflow-hidden
      "
    >
      {/* Dark mode ambient glow */}
      <div className="hidden dark:block absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="hidden dark:block absolute bottom-0 right-1/4 w-[450px] h-[450px] bg-indigo-500/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-3">
            Model Stack
          </p>

          <h2 className="text-4xl sm:text-5xl font-black text-[#0F172A] dark:text-white tracking-tight mb-4">
            18 models. 5 detection layers.
          </h2>

          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            Each sub-layer targets a specific challenge. Together, they form an
            ensemble no single model can match.
          </p>
        </motion.div>

        {/* Radix Tabs */}
        <Tabs.Root
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as ModelLayer)}
        >
          {/* Tab List */}
          <Tabs.List className="flex flex-wrap gap-2 justify-center mb-10 p-1">
            {TAB_LAYERS.map((layer) => {
              const lm = LAYER_META[layer];

              const count = AI_MODELS.filter(
                (m) => m.layer === layer
              ).length;

              return (
                <Tabs.Trigger
                  key={layer}
                  value={layer}
                  className="
                    px-4 py-2.5 rounded-lg text-sm font-bold border
                    transition-all duration-200
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-indigo-500
                    focus-visible:ring-offset-2

                    data-[state=inactive]:bg-white
                    dark:data-[state=inactive]:bg-white/5

                    data-[state=inactive]:text-slate-500
                    dark:data-[state=inactive]:text-slate-300

                    data-[state=inactive]:border-slate-200
                    dark:data-[state=inactive]:border-white/10

                    data-[state=inactive]:hover:border-slate-300
                    dark:data-[state=inactive]:hover:border-indigo-500/40

                    data-[state=active]:shadow-md
                    dark:data-[state=active]:shadow-[0_10px_30px_-10px_rgba(99,102,241,0.4)]
                  "
                  style={
                    activeTab === layer
                      ? {
                          backgroundColor: lm.bgColor,
                          color: lm.color,
                          borderColor: lm.borderColor,
                        }
                      : {}
                  }
                >
                  {lm.label}

                  <span className="ml-2 text-[10px] font-black opacity-70">
                    ({count})
                  </span>
                </Tabs.Trigger>
              );
            })}
          </Tabs.List>

          {/* Active layer description */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="text-center mb-8"
            >
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
                <span style={{ color: meta.color }} className="font-bold">
                  {meta.label}:{" "}
                </span>

                {meta.description}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Tab Panels */}
          {TAB_LAYERS.map((layer) => (
            <Tabs.Content
              key={layer}
              value={layer}
              className="outline-none"
            >
              <AnimatePresence mode="wait">
                {activeTab === layer && (
                  <motion.div
                    key={layer}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
                  >
                    {activeModels.map((model, i) => (
                      <ModelCard
                        key={model.id}
                        model={model}
                        index={i}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </Tabs.Content>
          ))}
        </Tabs.Root>

        {/* Legend */}
        <div className="flex flex-wrap gap-5 justify-center mt-10 pt-8 border-t border-slate-200 dark:border-white/10">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Green border = Actively deployed</span>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-amber-500" />
            <span>Amber border = Coming soon</span>
          </div>
        </div>
      </div>
    </section>
  );
}