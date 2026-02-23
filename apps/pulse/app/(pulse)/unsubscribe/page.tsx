'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card } from '@/ui/card';
import { Button } from '@/ui/button';
import Link from 'next/link';

function UnsubscribeContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token');
    const preference = searchParams.get('preference');

    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('Processing your unsubscribe request...');

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage('Invalid unsubscribe link. Missing token.');
            return;
        }

        const handleUnsubscribe = async () => {
            try {
                // Determine API URL (Local vs Prod)
                const apiUrl = typeof window !== 'undefined' ? '/pulse' : (process.env.NEXT_PUBLIC_PULSE_API_URL || 'http://localhost:8000');

                // Construct URL with query params
                let endpoint = `${apiUrl}/api/subscription/unsubscribe?token=${encodeURIComponent(token)}`;
                if (preference) {
                    endpoint += `&preference=${encodeURIComponent(preference)}`;
                }

                const response = await fetch(endpoint, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const data = await response.json();

                if (response.ok) {
                    setStatus('success');
                    setMessage(data.message || 'You have been successfully unsubscribed.');
                } else {
                    setStatus('error');
                    setMessage(data.detail || 'Failed to unsubscribe. The link may have expired.');
                }
            } catch (error) {
                console.error('Unsubscribe error:', error);
                setStatus('error');
                setMessage('An error occurred while processing your request. Please try again later.');
            }
        };

        handleUnsubscribe();
    }, [token, preference]);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <Card className="max-w-md w-full p-8 shadow-lg text-center bg-white">
                <div className="mb-6 flex justify-center">
                    {/* Logo/Icon Area */}
                    <div className={`p-4 rounded-full ${status === 'success' ? 'bg-green-100' : status === 'error' ? 'bg-red-100' : 'bg-blue-100'}`}>
                        {status === 'loading' && <span className="text-2xl">⏳</span>}
                        {status === 'success' && <span className="text-2xl">✅</span>}
                        {status === 'error' && <span className="text-2xl">⚠️</span>}
                    </div>
                </div>

                <h1 className="text-2xl font-bold mb-2 text-gray-900">
                    {status === 'loading' ? 'Unsubscribing...' :
                        status === 'success' ? 'Unsubscribed' : 'Error'}
                </h1>

                <p className="text-gray-600 mb-8 leading-relaxed">
                    {message}
                </p>

                <div className="space-y-3">
                    <Link href="/">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                            Return to Segmento Pulse
                        </Button>
                    </Link>

                    {status === 'success' && (
                        <p className="text-xs text-gray-400 mt-4">
                            You removed {preference ? `the ${preference} edition` : 'all subscriptions'}.
                            <br />
                            <Link href="/" className="underline hover:text-gray-600">
                                Manage subscriptions
                            </Link>
                        </p>
                    )}
                </div>
            </Card>
        </div>
    );
}

export default function UnsubscribePage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <UnsubscribeContent />
        </Suspense>
    );
}
