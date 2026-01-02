"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, CheckCircle2, Send } from "lucide-react"

interface FormData {
    name: string
    email: string
    company: string
    message: string
}

interface FormState {
    status: "idle" | "loading" | "success" | "error"
    message: string
}

export function ContactForm() {
    const [formData, setFormData] = useState<FormData>({
        name: "",
        email: "",
        company: "",
        message: "",
    })

    const [formState, setFormState] = useState<FormState>({
        status: "idle",
        message: "",
    })

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setFormState({ status: "loading", message: "" })

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            })

            const data = await response.json()

            if (response.ok) {
                setFormState({
                    status: "success",
                    message: "Thank you! We'll respond within 24 hours.",
                })
                // Reset form
                setFormData({
                    name: "",
                    email: "",
                    company: "",
                    message: "",
                })
            } else {
                setFormState({
                    status: "error",
                    message: data.error || "Something went wrong. Please try again.",
                })
            }
        } catch (error) {
            setFormState({
                status: "error",
                message: "Failed to send message. Please try again later.",
            })
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name and Email Row */}
            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                        Your Name *
                    </label>
                    <Input
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="w-full"
                    />
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                        Your Email *
                    </label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@company.com"
                        className="w-full"
                    />
                </div>
            </div>

            {/* Company Name */}
            <div>
                <label htmlFor="company" className="block text-sm font-medium mb-2">
                    Company Name
                </label>
                <Input
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Acme Inc."
                    className="w-full"
                />
            </div>

            {/* Message */}
            <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Tell us about your needs... *
                </label>
                <Textarea
                    id="message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="I'm interested in..."
                    rows={5}
                    className="w-full resize-none"
                />
            </div>

            {/* Status Messages */}
            {formState.status === "success" && (
                <div className="flex items-center gap-2 p-4 rounded-lg bg-green-50 border border-green-200 text-green-800">
                    <CheckCircle2 className="w-5 h-5" />
                    <p className="text-sm font-medium">{formState.message}</p>
                </div>
            )}

            {formState.status === "error" && (
                <div className="flex items-center gap-2 p-4 rounded-lg bg-red-50 border border-red-200 text-red-800">
                    <p className="text-sm font-medium">{formState.message}</p>
                </div>
            )}

            {/* Submit Button */}
            <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={formState.status === "loading"}
            >
                {formState.status === "loading" ? (
                    <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Sending...
                    </>
                ) : (
                    <>
                        Send Message
                        <Send className="w-5 h-5 ml-2" />
                    </>
                )}
            </Button>
        </form>
    )
}
