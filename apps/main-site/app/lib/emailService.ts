export async function triggerWelcomeEmail(name: string, email: string) {
    try {
        console.log(`[Email Service] Triggering welcome email to ${name} (${email})`)
        const apiKey = process.env.BREVO_API_KEY;
        const senderEmail = process.env.BREVO_SENDER_EMAIL;

        if (!apiKey || !senderEmail) {
            console.error("Missing Brevo env vars");
            return { success: false, error: "Missing env vars" };
        }

        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': apiKey
            },
            body: JSON.stringify({
                sender: { email: senderEmail },
                to: [{ email }],
                subject: 'Welcome to Segmento',
                htmlContent: `<p>Hi ${name},</p><p>Thanks for reaching out to Segmento — we've received your message and will be in touch shortly.</p><p>— The Segmento Team</p>`
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Brevo API error:", response.status, errorText);
            return { success: false, error: `Brevo error ${response.status}` };
        }

        console.log(`[Email Service] Welcome email sent successfully to ${email}`);
        return { success: true }
    } catch (error) {
        console.error("Failed to trigger welcome email:", error)
        return { success: false, error }
    }
}
