export async function triggerWelcomeEmail(name: string, email: string) {
    try {
        console.log(`[Email Service] Triggering welcome email to ${name} (${email})`)
        // Legacy site implementation placeholder - this usually calls an external service or another API route
        // In the legacy code, this was imported and called but the internal implementation was simple or handled elsewhere.
        // We'll maintain consistency with the legacy lib/emailService.ts
        return { success: true }
    } catch (error) {
        console.error("Failed to trigger welcome email:", error)
        return { success: false, error }
    }
}
