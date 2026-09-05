import { Suspense } from 'react';
import JoinClient from './JoinClient';

export const metadata = { title: 'Join Organization — Segmento Sense' };

interface JoinPageProps {
  params: Promise<{ token: string }> | { token: string };
}

export default async function JoinPage({ params }: JoinPageProps) {
  const resolvedParams = await Promise.resolve(params);
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#020617] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
        </div>
      }
    >
      <JoinClient token={resolvedParams.token} />
    </Suspense>
  );
}
