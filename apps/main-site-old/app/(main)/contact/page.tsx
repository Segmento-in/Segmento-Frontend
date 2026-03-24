"use client"

import { triggerWelcomeEmail } from "@/app/(main)/lib/emailService"
import { useState } from "react"
import { Button } from "@/ui/button"
import { Input } from "@/ui/input"
import { Textarea } from "@/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/ui/card"
import { Mail, Phone, MapPin } from "lucide-react"
import { motion } from "framer-motion"

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
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            })

            const data = await response.json()

            if (response.ok) {
                triggerWelcomeEmail(formData.name, formData.email)
                setSubmitted(true)
                setFormData({
                    name: "",
                    email: "",
                    company: "",
                    message: "",
                })
            } else {
                alert(data.error || "Failed to send message. Please try again.")
            }
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

    // --- STYLING CONSTANTS ---
    const heroBg = "bg-[#0b0f3b]"; // Dark navy for hero
    const pageBg = "bg-white"; // White for rest of page
    
    // Dark Card Styles
    const cardBg = "bg-[#0A1622]"; 
    const cardBorder = "border-[#1E3A5F]";
    // Small card class (reduced padding/size)
    const cardClass = `shadow-lg border ${cardBorder} ${cardBg} h-fit`;
    
    // Reduced Font Sizes (by 1 level)
    const heroTitleClass = "text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 tracking-tight leading-tight bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-400 bg-clip-text text-transparent";
    const heroSubtitleClass = "text-base md:text-lg text-slate-300 font-medium leading-relaxed max-w-3xl mx-auto";
    const cardTitleClass = "text-lg font-bold text-white mb-1"; // Reduced from xl
    const cardDescriptionClass = "text-xs text-slate-400"; // Reduced from sm
    const labelClass = `block text-xs font-semibold text-slate-200 mb-1`; // Reduced from sm
    
    // Inputs inside Dark Cards (Smaller h)
    const inputBg = "bg-[#040C14]";
    const inputClass = `h-9 px-3 ${inputBg} border ${cardBorder} rounded-lg text-white placeholder:text-slate-600 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all text-xs`;
    const textareaClass = `px-3 py-2 ${inputBg} border ${cardBorder} rounded-lg text-white placeholder:text-slate-600 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all text-xs`;

    if (submitted) {
        return (
            <div className={`py-16 min-h-[60vh] flex items-center justify-center ${pageBg}`}>
                <div className="container mx-auto px-4">
                    <Card className={`${cardClass} max-w-sm mx-auto text-center p-4`}>
                        <CardHeader>
                            <CardTitle className="text-xl text-cyan-400">Thank you!</CardTitle>
                            <CardDescription className="text-xs text-slate-400">
                                We've received your message and will get back to you within 24 hours.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button onClick={() => setSubmitted(false)} className="w-full h-9 text-xs bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600">
                                Send another message
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    return (
        <div className={pageBg}>
            {/* --- DARK HERO SECTION (Gradient Text) --- */}
           {/* Hero Section */}
<motion.section
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className={`py-28 lg:py-38 ${heroBg} relative overflow-hidden`}
>
    {/* Atmospheric blur effects included inside the hero background */}
    <div className="absolute top-0 right-0 -mt-20 -mr-18 w-90 h-90 bg-purple-600/15 blur-[120px] rounded-full" />
    <div className="absolute bottom-0 left-0 -mb-20 -ml-18 w-72 h-70 bg-blue-600/10 blur-[100px] rounded-full" />

    {/* Increased container size using max-w-7xl or max-w-full */}
    <div className="container mx-auto px-8 text-center max-w-8xl relative z-10">
        <div className="container mx-auto px-8 text-center max-w-9xl relative z-10"></div>
        <h1 className={heroTitleClass}>
            Get in touch
        </h1>
        <p className={heroSubtitleClass}>
            Request a demo, start a free trial, or ask us anything. Our team is here to help.
        </p>
    </div>
</motion.section>

            {/* --- WHITE CONTENT SECTION --- */}
            <div className={`py-16 ${pageBg}`}>
                <div className="container mx-auto px-4">
                    {/* TWO COLUMN LAYOUT */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto items-start">

                        {/* LEFT: Contact Information Cards (Small) */}
                        <div>
                            <Card className={`${cardClass} p-4`}>
                                <CardHeader className="p-2 pb-4">
                                    <CardTitle className={`flex items-center gap-2 ${cardTitleClass}`}>
                                        <Mail className="w-5 h-5 text-cyan-400" />
                                        Contact Information
                                    </CardTitle>
                                    <CardDescription className={cardDescriptionClass}>
                                        Reach out directly
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-2 space-y-3">
                                    {contactDetails.map((detail, index) => (
                                        <div
                                            key={index}
                                            className={`flex items-start gap-3 p-4 rounded-xl ${inputBg} hover:bg-slate-900 cursor-pointer transition-all duration-300 border ${cardBorder} hover:border-cyan-500 group`}
                                            onClick={() => handleContactClick(detail.href)}
                                        >
                                            <div className="p-2 bg-indigo-950 rounded-lg flex-shrink-0 mt-0.5">
                                                <detail.icon className="w-4 h-4 text-cyan-400" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[10px] font-semibold uppercase tracking-wide text-cyan-300 mb-0.5">
                                                    {detail.label}
                                                </p>
                                                <p className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                                                    {detail.value}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>

                        {/* RIGHT: Contact Form (Small) */}
                        <div>
                            <Card className={`${cardClass} p-4`}>
                                <CardHeader className="p-2 pb-4">
                                    <CardTitle className={cardTitleClass}>
                                        Contact 
                                    </CardTitle>
                                    <CardDescription className={cardDescriptionClass}>
                                        Fill out the form below.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-2">
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        {/* Name and Email Row */}
                                        <div className="grid md:grid-cols-2 gap-3">
                                            <div>
                                                <label htmlFor="name" className={labelClass}>
                                                    Name *
                                                </label>
                                                <Input
                                                    id="name"
                                                    name="name"
                                                    required
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    placeholder="John Doe"
                                                    className={inputClass}
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="email" className={labelClass}>
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
                                                    className={inputClass}
                                                />
                                            </div>
                                        </div>

                                        {/* Company */}
                                        <div>
                                            <label htmlFor="company" className={labelClass}>
                                                Company
                                            </label>
                                            <Input
                                                id="company"
                                                name="company"
                                                value={formData.company}
                                                onChange={handleChange}
                                                placeholder="Acme Inc."
                                                className={inputClass}
                                            />
                                        </div>

                                        {/* Message */}
                                        <div>
                                            <label htmlFor="message" className={labelClass}>
                                                Message *
                                            </label>
                                            <Textarea
                                                id="message"
                                                name="message"
                                                required
                                                value={formData.message}
                                                onChange={handleChange}
                                                placeholder="Tell us about your needs..."
                                                rows={3}
                                                className={textareaClass}
                                            />
                                        </div>

                                        {/* Submit Button */}
                                        <Button
                                            type="submit"
                                            className="w-full h-10 text-sm font-bold bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white rounded-lg shadow-md transition-all duration-300"
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
        </div>
    )
}