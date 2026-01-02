'use client';

import React from 'react';
import { PIICount, SchemaInfo } from '@/lib/apiClient';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface PIIAnalyticsProps {
    piiCounts: PIICount[];
    schema?: SchemaInfo[];
}

const COLORS = ['#3E2F5B', '#3E94560', '#B3945B', '#3F5E96', '#141E30', '#8B7355', '#5A4A6F', '#2E5968'];

export const PIIAnalytics: React.FC<PIIAnalyticsProps> = ({ piiCounts, schema }) => {
    const chartData = piiCounts.map((item) => ({
        name: item['PII Type'],
        value: item.Count,
    }));

    const total = piiCounts.reduce((sum, item) => sum + item.Count, 0);

    return (
        <div className="space-y-6">
            {/* Schema Section */}
            {schema && schema.length > 0 && (
                <div className="bg-gradient-to-br from-[#1A1A1A] to-[#141E30] rounded-lg p-6 border border-[#3E2F5B]/30">
                    <h3 className="text-xl font-semibold text-[#B3945B] mb-4 flex items-center">
                        <span className="mr-2">🧬</span>
                        Data Schema Detected
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-[#3E2F5B]/30">
                                    <th className="text-left py-2 px-3 text-gray-400">Column</th>
                                    <th className="text-left py-2 px-3 text-gray-400">Type</th>
                                </tr>
                            </thead>
                            <tbody>
                                {schema.map((col, idx) => (
                                    <tr key={idx} className="border-b border-[#3E2F5B]/10 hover:bg-[#3E2F5B]/10 transition-colors">
                                        <td className="py-2 px-3 text-white font-mono">{col.Column}</td>
                                        <td className="py-2 px-3 text-gray-300">{col.Type}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Analytics Section */}
            <div className="bg-gradient-to-br from-[#1A1A1A] to-[#141E30] rounded-lg p-6 border border-[#3E2F5B]/30">
                <h3 className="text-xl font-semibold text-[#B3945B] mb-6 flex items-center">
                    <span className="mr-2">📊</span>
                    PII Analytics
                </h3>

                {piiCounts.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-400">No PII data detected to visualize</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Pie Chart */}
                        <div className="flex flex-col items-center">
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        paddingAngle={2}
                                        dataKey="value"
                                        label={(entry: any) => `${entry.name} ${(entry.percent * 100).toFixed(0)}%`}
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#1A1A1A',
                                            border: '1px solid #3E2F5B',
                                            borderRadius: '8px'
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="mt-4 text-center">
                                <p className="text-2xl font-bold text-[#B3945B]">{total}</p>
                                <p className="text-sm text-gray-400">Total PII Detected</p>
                            </div>
                        </div>

                        {/* Data Table */}
                        <div className="overflow-hidden rounded-lg border border-[#3E2F5B]/30">
                            <table className="w-full">
                                <thead className="bg-[#3E2F5B]/20">
                                    <tr>
                                        <th className="text-left py-3 px-4 text-gray-300 font-semibold">PII Type</th>
                                        <th className="text-right py-3 px-4 text-gray-300 font-semibold">Count</th>
                                        <th className="text-right py-3 px-4 text-gray-300 font-semibold">%</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {piiCounts.map((item, idx) => {
                                        const percentage = ((item.Count / total) * 100).toFixed(1);
                                        return (
                                            <tr
                                                key={idx}
                                                className="border-b border-[#3E2F5B]/10 hover:bg-[#3E2F5B]/10 transition-colors"
                                            >
                                                <td className="py-3 px-4 text-white flex items-center">
                                                    <span
                                                        className="w-3 h-3 rounded-full mr-2"
                                                        style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                                                    ></span>
                                                    {item['PII Type']}
                                                </td>
                                                <td className="py-3 px-4 text-right text-[#B3945B] font-semibold">{item.Count}</td>
                                                <td className="py-3 px-4 text-right text-gray-400">{percentage}%</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
