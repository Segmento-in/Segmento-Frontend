"use client"

import { push, ref } from "firebase/database"
import { db } from "@/app/(main)/lib/firebase"
import { triggerWelcomeEmail } from "@/app/(main)/lib/emailService"
import { useState } from "react"
import { Button } from "@/ui/button"
import { Input } from "@/ui/input"
import { Textarea } from "@/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/ui/card"
import { Mail, Phone, MapPin } from "lucide-react"

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        company: "",
        message: "",
    })
    const [submitted, setSubmitted] = useState(false)

    const contactDetails = [
        {
            icon: Mail,
            label: "Email",
            value: "info@segmento.in",
            href: "mailto:info@segmento.in"
        },
        {
            icon: Phone,
            label: "Phone",
            value: "+91 990 872 7027",
            href: "tel:+919908727027"
        },
        {
            icon: MapPin,
            label: "Address",
            value: "Aathidyam Restaurent, Rama talkies, Opposite Road, Waltair Uplands, Vishakapatnam",
            href: "#"
        }
    ]

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            // Check if Firebase is initialized (client-side only)
            if (!db) {
                alert("Database not initialized. Please try again.")
                return
            }

            // Step 1: Save to Firebase (existing logic)
            await push(ref(db, "contacts"), {
                name: formData.name,
                email: formData.email,
                company: formData.company,
                message: formData.message,
                createdAt: Date.now(),
            })

            // Step 2: Trigger welcome email via backend (NEW - Push Architecture)
            // Fire-and-forget: doesn't block user experience
            triggerWelcomeEmail(formData.name, formData.email)

            setSubmitted(true)
            setFormData({
                name: "",
                email: "",
                company: "",
                message: "",
            })
        } catch (error) {
            console.error(error)
            alert("Failed to send message")
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleContactClick = (href: string) => {
        if (href && href !== "#") {
            window.open(href, '_blank')
        }
    }

    if (submitted) {
        return (
            <div className="py-20 min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50">
                <div className="container mx-auto px-4">
                    <Card className="max-w-md mx-auto text-center shadow-xl">
                        <CardHeader>
                            <CardTitle className="text-3xl text-indigo-600">Thank you!</CardTitle>
                            <CardDescription className="text-lg">
                                We've received your message and will get back to you within 24 hours.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button onClick={() => setSubmitted(false)} className="w-full">
                                Send another message
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    return (
        <div className="py-20 bg-gradient-to-br from-slate-50 to-indigo-50">
            <div className="container mx-auto px-4">
                {/* Hero Title */}
                <div className="text-center mb-20 max-w-4xl mx-auto">
                    <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6 text-gray-900 drop-shadow-lg">
                        Get in touch
                    </h1>
                    <p className="text-xl text-gray-600 font-medium max-w-2xl mx-auto leading-relaxed">
                        Request a demo, start a free trial, or ask us anything. Our team is here to help.
                    </p>
                </div>

                {/* TWO COLUMN LAYOUT: Left Contact Info | Right Contact Form */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto items-start">

                    {/* LEFT: Contact Information Cards */}
                    <div>
                        <Card className="shadow-xl hover:shadow-2xl transition-all duration-300 border-0 bg-white h-fit">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3 text-2xl font-bold text-gray-900 mb-2">
                                    <Mail className="w-10 h-10 text-indigo-600" />
                                    Contact Information
                                </CardTitle>
                                <CardDescription className="text-lg text-gray-600">
                                    Reach out to us directly through any channel
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-4 space-y-4">
                                {contactDetails.map((detail, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start gap-4 p-6 rounded-2xl bg-gradient-to-r from-indigo-50 to-blue-50 hover:bg-indigo-100 cursor-pointer transition-all duration-300 border hover:border-indigo-200 hover:shadow-md hover:-translate-y-1 group"
                                        onClick={() => handleContactClick(detail.href)}
                                    >
                                        <div className="p-3 bg-indigo-100 rounded-xl flex-shrink-0 mt-1 group-hover:scale-110 transition-transform duration-300">
                                            <detail.icon className="w-6 h-6 text-indigo-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold uppercase tracking-wide text-indigo-700 mb-2">
                                                {detail.label}
                                            </p>
                                            <p className="text-lg font-semibold text-gray-900 hover:text-indigo-600 transition-colors line-clamp-2">
                                                {detail.value}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    {/* RIGHT: Contact Form */}
                    <div>
                        <Card className="shadow-xl hover:shadow-2xl transition-all duration-300 border-0 bg-white h-fit">
                            <CardHeader>
                                <CardTitle className="text-2xl font-bold text-gray-900">
                                    Contact Sales
                                </CardTitle>
                                <CardDescription className="text-lg text-gray-600">
                                    Fill out the form below and our team will reach out to you shortly.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Name and Email Row */}
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                                                Name *
                                            </label>
                                            <Input
                                                id="name"
                                                name="name"
                                                required
                                                value={formData.name}
                                                onChange={handleChange}
                                                placeholder="John Doe"
                                                className="h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 hover:border-indigo-300 transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
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
                                                className="h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-100 hover:border-purple-300 transition-all"
                                            />
                                        </div>
                                    </div>

                                    {/* Company */}
                                    <div>
                                        <label htmlFor="company" className="block text-sm font-semibold text-gray-700 mb-2">
                                            Company
                                        </label>
                                        <Input
                                            id="company"
                                            name="company"
                                            value={formData.company}
                                            onChange={handleChange}
                                            placeholder="Acme Inc."
                                            className="h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 hover:border-indigo-300 transition-all"
                                        />
                                    </div>

                                    {/* Message */}
                                    <div>
                                        <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
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
                                            className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-100 hover:border-purple-300 transition-all min-h-[140px]"
                                        />
                                    </div>

                                    {/* Submit Button */}
                                    <Button
                                        type="submit"
                                        className="w-full h-14 text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                                    >
                                        Send message →
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
