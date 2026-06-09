import { Metadata } from 'next';
import ConnectorsClient from './ConnectorsClient';

export const metadata: Metadata = {
    title: 'Segmento Sense | Data Connectors — Cloud PII Scanner',
    description:
        'Scan PII across your cloud infrastructure in one place. Connect Google Drive, Amazon S3, Azure Blob Storage, and Google Cloud Storage — then run all AI detection models in-memory, with zero data retention.',
};

export default function ConnectorsPage() {
    return (
        <main className="h-screen pt-16 flex flex-col bg-white text-slate-900 overflow-hidden">
            <ConnectorsClient />
        </main>
    );
}
