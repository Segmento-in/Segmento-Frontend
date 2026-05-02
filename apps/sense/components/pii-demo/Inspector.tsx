'use client';

import React, { useState } from 'react';
import { InspectorResult } from '@/lib/apiClient';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface InspectorProps {
    inspectorData: InspectorResult[];
}

const PALETTE = ['#3E2F5B','#B3945B','#3F5E96','#8B7355','#5A4A6F','#2D6A4F','#C77DFF','#F4A261'];

function getModelColor(modelLabel: string): string {
    // Stable mapping: Deterministic color by label hash
    const known: Record<string, string> = {
        '🛠️ Regex':       '#3E2F5B',
        '🧠 NLTK':        '#3E9456',
        '🤖 SpaCy':       '#B3945B',
        '🛡️ Presidio':    '#3F5E96',
        '🦅 GLiNER':      '#8B7355',
        '🚀 DeBERTa':     '#5A4A6F',
        '📋 Pasteproof':  '#2D6A4F',
        '🐟 Piiranha':    '#C77DFF',
        '⚡ NVIDIA-GLiNER':'#F4A261',
        '🌐 mmbert32k':   '#E76F51',
    };
    if (known[modelLabel]) return known[modelLabel];
    // Dynamic fallback: hash label string into palette index
    let hash = 0;
    for (let i = 0; i < modelLabel.length; i++) hash = modelLabel.charCodeAt(i) + ((hash << 5) - hash);
    return PALETTE[Math.abs(hash) % PALETTE.length];
}

export const Inspector: React.FC<InspectorProps> = ({ inspectorData }) => {
    const [expanded, setExpanded] = useState(true);

    if (!inspectorData || inspectorData.length === 0) {
        return null;
    }

    const chartData = inspectorData.map((item) => ({
        model: item.Model,
        accuracy: item.Accuracy * 100,
    }));

    return (
        <div className="bg-gradient-to-br from-[#1A1A1A] to-[#141E30] rounded-lg border border-slate-300 dark:border-slate-200 dark:border-[#3E2F5B]/30 overflow-hidden">
            {/* Header */}
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full flex items-center justify-between p-6 hover:bg-slate-100 dark:bg-[#3E2F5B]/10 transition-colors"
            >
                <h3 className="text-xl font-semibold text-indigo-600 dark:text-[#B3945B] flex items-center">
                    <span className="mr-2">🕵️</span>
                    Inspector: Behind the Scenes
                </h3>
                <span className={`text-indigo-600 dark:text-[#B3945B] transition-transform ${expanded ? 'rotate-180' : ''}`}>
                    ▼
                </span>
            </button>

            {/* Content */}
            {expanded && (
                <div className="p-6 pt-0 space-y-6">
                    {/* Performance Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-300 dark:border-slate-200 dark:border-[#3E2F5B]/30">
                                    <th className="text-left py-3 px-3 text-slate-500 dark:text-gray-400">Model</th>
                                    <th className="text-center py-3 px-3 text-slate-500 dark:text-gray-400">Detected PII</th>
                                    <th className="text-center py-3 px-3 text-slate-500 dark:text-gray-400">Missed PII</th>
                                    <th className="text-right py-3 px-3 text-slate-500 dark:text-gray-400">Accuracy</th>
                                </tr>
                            </thead>
                            <tbody>
                                {inspectorData.map((item, idx) => (
                                    <tr
                                        key={idx}
                                        className="border-b border-slate-300 dark:border-[#3E2F5B]/10 hover:bg-slate-100 dark:bg-[#3E2F5B]/10 transition-colors"
                                    >
                                        <td className="py-3 px-3 text-slate-900 dark:text-white font-medium">{item.Model}</td>
                                        <td className="py-3 px-3 text-center text-green-400">{item['Detected PII']}</td>
                                        <td className="py-3 px-3 text-center text-red-400">{item['Missed PII']}</td>
                                        <td className="py-3 px-3 text-right text-indigo-600 dark:text-[#B3945B] font-semibold">
                                            {(item.Accuracy * 100).toFixed(1)}%
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Accuracy Bar Chart */}
                        <div>
                            <h4 className="text-sm font-semibold text-slate-600 dark:text-gray-300 mb-3">Model Accuracy Graph</h4>
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={chartData} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" stroke="#3E2F5B" opacity={0.3} />
                                    <XAxis type="number" domain={[0, 100]} stroke="#888" />
                                    <YAxis dataKey="model" type="category" width={100} stroke="#888" />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#1A1A1A',
                                            border: '1px solid #3E2F5B',
                                            borderRadius: '8px',
                                        }}
                                        formatter={(value) => `${Number(value).toFixed(1)}%`}
                                    />
                                    <Bar dataKey="accuracy" radius={[0, 8, 8, 0]}>
                                        {chartData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={getModelColor(entry.model)}
                                            />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Efficiency Metrics */}
                        <div>
                            <h4 className="text-sm font-semibold text-slate-600 dark:text-gray-300 mb-3">Efficiency Metrics</h4>
                            <div className="grid grid-cols-2 gap-3">
                                {inspectorData.map((item, idx) => {
                                    const accuracy = item.Accuracy * 100;
                                    return (
                                        <div
                                            key={idx}
                                            className="bg-white dark:bg-[#3E2F5B]/20 rounded-lg p-4 border border-slate-300 dark:border-slate-200 dark:border-[#3E2F5B]/30"
                                        >
                                            <p className="text-xs text-slate-500 dark:text-gray-400 mb-1">{item.Model}</p>
                                            <p className="text-2xl font-bold text-indigo-600 dark:text-[#B3945B]">
                                                {accuracy.toFixed(1)}%
                                            </p>
                                            <div className="mt-2 h-1 bg-[#141E30] rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-[#B3945B] to-[#3E94560] transition-all duration-500"
                                                    style={{ width: `${accuracy}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
