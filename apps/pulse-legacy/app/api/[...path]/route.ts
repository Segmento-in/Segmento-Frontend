/**
 * Catch-all API proxy route for Segmento Pulse.
 *
 * Problem: The backend CORS only allows localhost:3000.
 * Pulse now runs on localhost:3001, so direct browser fetches are blocked.
 *
 * Solution: All browser requests go to /api/* (same origin = no CORS).
 * This route forwards them server-side to the backend (server→server = no CORS).
 */

import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_PULSE_API_URL || 'http://localhost:8000';

async function proxyRequest(request: NextRequest, params: { path: string[] }) {
    const path = params.path.join('/');
    const searchParams = request.nextUrl.searchParams.toString();
    const targetUrl = `${BACKEND_URL}/api/${path}${searchParams ? `?${searchParams}` : ''}`;

    try {
        const headers = new Headers();
        // Forward content-type if present
        const contentType = request.headers.get('content-type');
        if (contentType) headers.set('content-type', contentType);

        const fetchOptions: RequestInit = {
            method: request.method,
            headers,
        };

        // Forward body for non-GET requests
        if (request.method !== 'GET' && request.method !== 'HEAD') {
            fetchOptions.body = await request.text();
        }

        const response = await fetch(targetUrl, fetchOptions);
        const data = await response.json();

        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error(`[Proxy] Failed to reach backend at ${targetUrl}:`, error);
        return NextResponse.json(
            { error: 'Backend unavailable', detail: String(error) },
            { status: 502 }
        );
    }
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    return proxyRequest(request, await params);
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    return proxyRequest(request, await params);
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    return proxyRequest(request, await params);
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    return proxyRequest(request, await params);
}
