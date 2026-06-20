import type { Metadata } from "next";
import { SenseComparisonTable } from "@/components/SenseComparisonTable";

export const metadata: Metadata = {
  title: "Compare | Segmento Sense",
  description: "Compare Segmento Sense with other data classification platforms",
};

export default function ComparePage() {
  return (
    <main className="min-h-screen w-full bg-[#F8FAFF] dark:bg-[#020617] pt-32 pb-12">
      <div className="container mx-auto px-6 mb-8 max-w-7xl">
        <h1 className="text-3xl xl:text-4xl font-black text-[#0F172A] dark:text-white tracking-tight text-center">
          Compare Segmento Sense
        </h1>
        <p className="text-center text-slate-500 dark:text-slate-400 mt-4 max-w-2xl mx-auto">
          See how our AI Engine and Consensus Architecture stack up against legacy platforms and cloud-native solutions.
        </p>
      </div>
      <SenseComparisonTable className="w-full" />
    </main>
  );
}
