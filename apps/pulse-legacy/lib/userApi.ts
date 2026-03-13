import { database } from "./firebase";
import { ref, get } from "firebase/database";

export interface UserSubscription {
    email: string;
    name: string;
    subscribed: boolean;
    token: string;
    subscribedAt: string;
    topics: string[];
    preference: string; // 'Daily', 'Weekly', etc.
    subscriptions?: Record<string, boolean>; // New granular subscriptions
}

/**
 * Fetch user subscription details from Realtime Database
 * Note: Uses SHA-256 hash of email as the key
 */
export async function fetchUserSubscription(email: string): Promise<UserSubscription | null> {
    if (!database || !email) return null;

    try {
        // Use Backend API (Single Source of Truth)
        const API_BASE = process.env.NEXT_PUBLIC_PULSE_API_URL || 'http://localhost:8000';

        try {
            const response = await fetch(`${API_BASE}/api/subscription/status?email=${encodeURIComponent(email)}`, {
                cache: 'no-store', // Always fetch fresh data
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                // 404 means not subscribed, which returns valid null
                if (response.status === 404) return null;
                console.error(`Status check failed: ${response.status}`);
                return null;
            }

            const data = await response.json();

            // If API returns mock data for non-subscriber (subscribed: false), return it
            // The dashboard handles "subscribed: false" correctly
            return data as UserSubscription;

        } catch (error) {
            console.error("Error fetching user subscription from API:", error);
            return null;
        }
    } catch (error) {
        console.error("Error in outer try-catch block:", error);
        return null;
    }
}
