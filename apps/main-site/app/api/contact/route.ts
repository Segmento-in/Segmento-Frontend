import { NextRequest, NextResponse } from "next/server"
import { createConnection } from "@/app/(main)/lib/db"

interface ContactFormData {
    name: string
    email: string
    company?: string
    message: string
}

export async function POST(request: NextRequest) {
    try {
        const body: ContactFormData = await request.json()

        // Validate required fields
        if (!body.name || !body.email || !body.message) {
            return NextResponse.json(
                { error: "Required fields missing: name, email, and message are required" },
                { status: 400 }
            )
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(body.email)) {
            return NextResponse.json(
                { error: "Invalid email format" },
                { status: 400 }
            )
        }

        // Get database connection
        const connection = await createConnection()

        try {
            // Insert contact data
            const query = `
        INSERT INTO contacts (name, email, company, message, created_at)
        VALUES (?, ?, ?, ?, NOW())
      `

            await connection.execute(query, [
                body.name,
                body.email,
                body.company || "",
                body.message,
            ])

            return NextResponse.json(
                {
                    success: true,
                    message: "Contact form submitted successfully"
                },
                { status: 201 }
            )
        } finally {
            // Always close the connection
            await connection.end()
        }
    } catch (error) {
        console.error("Contact form error:", error)

        return NextResponse.json(
            {
                error: "Failed to process contact form. Please try again later.",
                details: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        )
    }
}
