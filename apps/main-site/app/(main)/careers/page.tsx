'use client';

import Link from "next/link"
import { Rocket, Brain, Users, Heart, MapPin, Clock, Briefcase, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

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
        <div className="min-h-screen bg-white selection:bg-purple-500/30">
            {/* Hero Section */}
            <section className="relative bg-[#0b0f3b] py-24 lg:py-32 overflow-hidden">
                <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-purple-600/15 blur-[120px] rounded-full" />
                <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-72 h-72 bg-blue-600/10 blur-[100px] rounded-full" />
                
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="max-w-4xl mx-auto"
                    >
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight leading-tight bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-400 bg-clip-text text-transparent">
                            Join Our Mission
                        </h1>
                        <p className="text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium opacity-90">
                            Build the future of data privacy and intelligence with Segmento. 
                            We're looking for passionate minds to redefine how the world handles data.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Why Join - Dark Cards */}
            <section className="py-24 bg-white relative z-20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">Why Segmento?</h2>
                        <div className="h-1.5 w-20 bg-purple-600 mx-auto rounded-full" />
                    </div>

                    <motion.div 
                        variants={containerVariants}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                        className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto"
                    >
                        {values.map((value) => {
                            const Icon = value.icon
                            return (
                                <motion.div 
                                    variants={fadeInUp}
                                    key={value.title} 
                                    whileHover={{ y: -10 }}
                                    className="p-8 rounded-[2.5rem] bg-[#0f172a] border border-slate-800 shadow-xl group transition-all duration-300"
                                >
                                    <div className="inline-flex p-4 rounded-2xl bg-slate-800 mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:bg-purple-600/20">
                                        <Icon className="w-8 h-8 text-purple-400 group-hover:text-purple-300" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-3 text-white">{value.title}</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed font-medium">{value.description}</p>
                                </motion.div>
                            )
                        })}
                    </motion.div>
                </div>
            </section>

            {/* Open Positions - Dark Theme Cards */}
            <section className="py-24 bg-slate-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">Open Positions</h2>
                        <p className="text-slate-500 font-medium italic">Find your next challenge in our dark-themed roles</p>
                    </div>

                    <motion.div 
                        variants={containerVariants}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                        className="space-y-8 max-w-5xl mx-auto"
                    >
                        {jobs.map((job) => (
                            <motion.div 
                                variants={fadeInUp}
                                key={job.title} 
                                whileHover={{ scale: 1.01 }}
                                className="group bg-[#0f172a] rounded-[2.5rem] border border-slate-800 p-8 md:p-10 shadow-2xl transition-all duration-300 relative overflow-hidden"
                            >
                                {/* Subtle internal glow for card */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/5 blur-3xl rounded-full" />

                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 relative z-10">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
                                            <h3 className="text-2xl font-bold text-white group-hover:text-purple-400 transition-colors">
                                                {job.title}
                                            </h3>
                                        </div>
                                        
                                        <div className="flex flex-wrap gap-3 mb-6">
                                            <span className="flex items-center gap-1.5 text-slate-300 bg-slate-800/50 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-slate-700">
                                                <MapPin className="w-3.5 h-3.5 text-purple-400" /> {job.location}
                                            </span>
                                            <span className="flex items-center gap-1.5 text-slate-300 bg-slate-800/50 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-slate-700">
                                                <Clock className="w-3.5 h-3.5 text-purple-400" /> {job.type}
                                            </span>
                                            <span className="flex items-center gap-1.5 text-slate-300 bg-slate-800/50 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-slate-700">
                                                <Briefcase className="w-3.5 h-3.5 text-purple-400" /> {job.department}
                                            </span>
                                        </div>
                                        
                                        <p className="text-slate-400 leading-relaxed font-medium text-sm md:text-base max-w-2xl">
                                            {job.description}
                                        </p>
                                    </div>

                                    <div className="shrink-0 pt-2">
                                        <Link 
                                            href="/contact"
                                            className="inline-flex items-center gap-2 px-8 py-4 bg-linear-to-r from-purple-600 to-indigo-600 text-white rounded-2xl font-bold hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 group/btn"
                                        >
                                            Apply Now
                                            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Resume Drop Section */}
            <section className="bg-white py-24">
                <div className="container mx-auto px-4 text-center">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="max-w-6xl mx-auto p-12 md:p-16 -[3rem] bg-[#0f172a] border border-slate-800 shadow-2xl relative overflow-hidden"
                    >
                        <div className="absolute -top-24 -left-24 w-64 h-64 bg-purple-600/10 blur-[100px] rounded-full" />
                        
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 relative z-10">
                            Don't see a perfect fit?
                        </h2>
                        <p className="text-slate-400 mb-8 font-medium text-lg relative z-10 leading-relaxed">
                            We're always looking for talented people. Send your resume to us directly and we'll keep you in mind for future roles.
                        </p>
                        
                        <div className="relative z-10 space-y-8">
                            <a
                                href="mailto:hr@segmento.in"
                                className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-blue-400 hover:to-purple-300 transition-all"
                            >
                                hr@segmento.in
                            </a>
                            
                            <div className="pt-4">
                                <Link 
                                    href="/contact"
                                    className="px-12 py-5 border-2 border-purple-500/50 text-purple-400 rounded-full font-bold hover:bg-purple-600 hover:text-white hover:border-purple-600 transition-all shadow-lg text-lg inline-block"
                                >
                                    Contact Us
                                </Link>
                            </div>
                        </div>
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
        description: "Join a fast-growing startup where your work directly shapes our products and company culture.",
    },
    {
        icon: Brain,
        title: "Cutting-Edge Tech",
        description: "Work with AI, machine learning, and modern data architectures solving real enterprise challenges.",
    },
    {
        icon: Users,
        title: "Amazing Team",
        description: "Collaborate with talented engineers, designers, and data scientists who are passionate about privacy.",
    },
    {
        icon: Heart,
        title: "Work-Life Balance",
        description: "Flexible remote work, generous PTO, and a culture that values your well-being.",
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