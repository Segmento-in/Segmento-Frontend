import { NextRequest, NextResponse } from "next/server"
import { ID } from "node-appwrite"
import { getAppwriteClient } from "@/app/lib/db"

interface ContactFormData {
    name: string
    email: string
    company?: string
    message: string
}

export async function POST(request: NextRequest) {
    try {
        const body: ContactFormData = await request.json()

        // ── Validate required fields ──────────────────────────────────────────
        if (!body.name || !body.email || !body.message) {
            return NextResponse.json(
                { error: "Required fields missing: name, email, and message are required" },
                { status: 400 }
            )
        }

        // ── Validate email format ─────────────────────────────────────────────
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(body.email)) {
            return NextResponse.json(
                { error: "Invalid email format" },
                { status: 400 }
            )
        }

        // ── Persist to Appwrite ───────────────────────────────────────────────
        const databases = getAppwriteClient()
        const databaseId = process.env.APPWRITE__MAIN_SITE_DATABASE_ID!
        const collectionId = process.env.APPWRITE__MAIN_SITE_DATABASE_CONTACT_COLLECTION_ID!

        await databases.createDocument(
            databaseId,
            collectionId,
            ID.unique(),
            {
                name: body.name,
                email: body.email,
                company: body.company || "",
                message: body.message,
            }
        )

        return NextResponse.json(
            {
                success: true,
                message: "Contact form submitted successfully",
            },
            { status: 201 }
        )

    } catch (error) {
        console.error("Contact form error:", error)

        return NextResponse.json(
            {
                error: "Failed to process contact form. Please try again later.",
                details: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        )
    }
}
