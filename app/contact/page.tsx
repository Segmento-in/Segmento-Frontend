"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        company: "",
        message: "",
    })
    const [submitted, setSubmitted] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // In a real app, this would send to your backend
        console.log("Form submitted:", formData)
        setSubmitted(true)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    if (submitted) {
        return (
            <div className="py-20 min-h-[60vh] flex items-center justify-center">
                <div className="container mx-auto px-4">
                    <Card className="max-w-md mx-auto text-center">
                        <CardHeader>
                            <CardTitle className="text-3xl">Thank you!</CardTitle>
                            <CardDescription>
                                We've received your message and will get back to you within 24 hours.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button onClick={() => setSubmitted(false)}>Send another message</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    return (
        <div className="py-20">
            <div className="container mx-auto px-4">
                <div className="max-w-2xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="font-serif text-5xl md:text-6xl font-bold mb-4">
                            Get in touch
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            Request a demo, start a free trial, or ask us anything.
                        </p>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Contact Sales</CardTitle>
                            <CardDescription>
                                Fill out the form below and our team will reach out to you shortly.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                                        Name *
                                    </label>
                                    <Input
                                        id="name"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="John Doe"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                                        Email *
                                    </label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="john@company.com"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="company" className="block text-sm font-medium mb-2">
                                        Company
                                    </label>
                                    <Input
                                        id="company"
                                        name="company"
                                        value={formData.company}
                                        onChange={handleChange}
                                        placeholder="Acme Inc."
                                    />
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium mb-2">
                                        Message *
                                    </label>
                                    <Textarea
                                        id="message"
                                        name="message"
                                        required
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder="Tell us about your needs..."
                                        rows={5}
                                    />
                                </div>

                                <Button type="submit" className="w-full" size="lg">
                                    Send message
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
