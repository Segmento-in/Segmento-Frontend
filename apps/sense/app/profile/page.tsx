// app/profile/page.tsx — Server Component wrapper
import { Suspense } from 'react';
import ProfileClient from './ProfileClient';

export const metadata = { title: 'Profile — Segmento Sense' };

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#020617] flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" /></div>}>
      <ProfileClient />
    </Suspense>
  );
}
