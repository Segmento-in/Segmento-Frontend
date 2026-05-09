import { Metadata } from 'next';
import ModelLabClient from './ModelLabClient';

export const metadata: Metadata = {
    title: 'Segmento Sense Model Lab | PII Model Benchmarking Observatory',
    description:
        'Upload labeled PII datasets, run any of 12 AI models, and get honest F1/Precision/Recall scores. Compare model accuracy side-by-side. Supports bigcode JSON, Nemotron Parquet, CSV, JSON with spans, and more.',
};

export default function ModelLabPage() {
    return (
        <main className="min-h-screen bg-[#0B0F1A]">
            <ModelLabClient />
        </main>
    );
}
