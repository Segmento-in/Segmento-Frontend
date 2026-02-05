'use client'; // Added for animations

import Link from "next/link"
import { Rocket, Brain, Users, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion" // Import Framer Motion

// Animation variants for staggered lists
const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
};

const containerVariants = {
    animate: {
        transition: {
            staggerChildren: 0.1
        }
    }
};

export default function CareersPage() {
    return (
        <div className="min-h-screen py-20">
            {/* Hero */}
            <section className="mb-16">
                <div className="container mx-auto px-4">
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="max-w-3xl mx-auto text-center"
                    >
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-600 to-blue-600 bg-clip-text text-transparent">
                            Join Our Mission
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground">
                            Build the future of data privacy and intelligence with Segmento
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Why Join */}
            <section className="py-16 bg-gradient-to-br from-primary/5 to-purple-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Why Segmento?</h2>
                    <motion.div 
                        variants={containerVariants}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                        className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto"
                    >
                        {values.map((value) => {
                            const Icon = value.icon
                            return (
                                <motion.div 
                                    variants={fadeInUp}
                                    key={value.title} 
                                    className="text-center group"
                                >
                                    <div className="inline-flex p-4 rounded-xl bg-white shadow-lg mb-4 transition-transform duration-300 group-hover:scale-110">
                                        <Icon className="w-8 h-8 text-primary" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                                    <p className="text-muted-foreground text-sm">{value.description}</p>
                                </motion.div>
                            )
                        })}
                    </motion.div>
                </div>
            </section>

            {/* Open Positions */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Open Positions</h2>
                    <motion.div 
                        variants={containerVariants}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                        className="space-y-6 max-w-4xl mx-auto"
                    >
                        {jobs.map((job) => (
                            <motion.div 
                                variants={fadeInUp}
                                whileHover={{ y: -4 }}
                                key={job.title} 
                                className="bg-white rounded-xl border border-border/50 p-6 shadow-sm hover:shadow-xl transition-all duration-300"
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold mb-2">{job.title}</h3>
                                        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                                            <span>📍 {job.location}</span>
                                            <span>🕒 {job.type}</span>
                                            <span>💼 {job.department}</span>
                                        </div>
                                    </div>
                                    <Link href="/contact">
                                        <Button className="hover:scale-105 transition-transform">Apply Now</Button>
                                    </Link>
                                </div>
                                <p className="text-muted-foreground">{job.description}</p>
                            </motion.div>
                        ))}
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        viewport={{ once: true }}
                        className="text-center mt-12"
                    >
                        <p className="text-muted-foreground mb-4">
                            Don't see a perfect fit? We're always looking for talented people.
                        </p>
                        <p className="text-lg font-semibold mb-4">
                            Send your resume to{" "}
                            <a
                                href="mailto:hr@segmento.in"
                                className="text-primary hover:underline"
                            >
                                hr@segmento.in
                            </a>
                        </p>
                        <Link href="/contact">
                            <Button size="lg" variant="outline" className="hover:bg-primary hover:text-white transition-colors">
                                Contact Us
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </section>
        </div>
    )
}

const values = [
    {
        icon: Rocket,
        title: "Early-Stage Impact",
        description: "Join a fast-growing startup where your work directly shapes our products and company culture",
    },
    {
        icon: Brain,
        title: "Cutting-Edge Tech",
        description: "Work with AI, machine learning, and modern data architectures solving real enterprise challenges",
    },
    {
        icon: Users,
        title: "Amazing Team",
        description: "Collaborate with talented engineers, designers, and data scientists who are passionate about privacy",
    },
    {
        icon: Heart,
        title: "Work-Life Balance",
        description: "Flexible remote work, generous PTO, and a culture that values your well-being",
    },
]

const jobs = [
    {
        title: "Senior Backend Engineer",
        location: "Remote / India",
        type: "Full-time",
        department: "Engineering",
        description: "Build scalable data classification pipelines and AI-powered detection systems. Experience with Python, distributed systems, and machine learning required.",
    },
    {
        title: "Frontend Engineer (React/Next.js)",
        location: "Remote / India",
        type: "Full-time",
        department: "Engineering",
        description: "Create beautiful, performant user interfaces for our data classification platform. Strong React, TypeScript, and design system experience needed.",
    },
    {
        title: "Data Scientist - AI/ML",
        location: "Remote / India",
        type: "Full-time",
        department: "Data Science",
        description: "Develop and train ML models for PII detection and data classification. Experience with NLP, deep learning, and privacy-preserving ML preferred.",
    },
    {
        title: "Product Manager",
        location: "Remote / India",
        type: "Full-time",
        department: "Product",
        description: "Drive product strategy and roadmap for our data classification products. Enterprise SaaS experience and technical background required.",
    },
]