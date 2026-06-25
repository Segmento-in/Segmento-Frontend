// app/profile/page.tsx — Server Component wrapper
import ProfileClient from './ProfileClient';

export const metadata = { title: 'Profile — Segmento Sense' };

export default function ProfilePage() {
  return <ProfileClient />;
}
