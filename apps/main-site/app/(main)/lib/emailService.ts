/**
 * Email Service - Triggers welcome emails via Hugging Face backend
 */

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ||
    "https://workwithshafisk-segmento-sense-backend.hf.space";

interface WelcomeEmailPayload {
    name: string;
    email: string;
}

/**
 * Trigger a welcome email to be sent to a new user.
 * This function makes a fire-and-forget request to the backend.
 * It doesn't await the response to avoid blocking the user experience.
 * 
 * @param name - User's name
 * @param email - User's email address
 */
export async function triggerWelcomeEmail(name: string, email: string): Promise<void> {
    try {
        // Fire-and-forget: don't await to avoid blocking
        fetch(`${BACKEND_URL}/api/send-welcome`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, email } as WelcomeEmailPayload),
        })
            .then(response => {
                if (response.ok) {
                    console.log(`✅ Welcome email triggered for ${email}`);
                } else {
                    console.warn(`⚠️ Failed to trigger welcome email: ${response.statusText}`);
                }
            })
            .catch(error => {
                console.error("❌ Error triggering welcome email:", error);
            });
    } catch (error) {
        console.error("❌ Failed to trigger welcome email:", error);
    }
}
