"use client";

import Link from "next/link";
import { Lock, Shield, Server, Key, Eye, Clock, ArrowLeft } from "lucide-react";

export default function SecurityPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-16">
                <div className="container mx-auto px-4">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Security</h1>
                    <p className="text-xl text-white/90">Your data security is our top priority</p>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-12 max-w-6xl">
                {/* Security Commitment */}
                <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <Shield className="w-10 h-10 text-emerald-600" />
                        <h2 className="text-3xl font-bold m-0">Our Security Commitment</h2>
                    </div>
                    <p className="text-gray-600 text-lg leading-relaxed">
                        At Segmento, we implement enterprise-grade security measures to protect your sensitive data. Our comprehensive security framework ensures your information remains confidential, integral, and available.
                    </p>
                </div>

                {/* Security Features */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <Lock className="w-8 h-8 text-emerald-600" />
                            <h3 className="text-xl font-semibold">Encryption</h3>
                        </div>
                        <p className="text-gray-600">
                            All data in transit is encrypted using TLS 1.3. Data at rest is encrypted using AES-256 encryption standards.
                        </p>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <Key className="w-8 h-8 text-emerald-600" />
                            <h3 className="text-xl font-semibold">Access Control</h3>
                        </div>
                        <p className="text-gray-600">
                            Multi-factor authentication (MFA) and role-based access control (RBAC) ensure only authorized personnel can access sensitive data.
                        </p>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <Eye className="w-8 h-8 text-emerald-600" />
                            <h3 className="text-xl font-semibold">Monitoring</h3>
                        </div>
                        <p className="text-gray-600">
                            24/7 security monitoring with real-time threat detection and automated incident response systems.
                        </p>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <Clock className="w-8 h-8 text-emerald-600" />
                            <h3 className="text-xl font-semibold">Regular Audits</h3>
                        </div>
                        <p className="text-gray-600">
                            Regular security audits, penetration testing, and vulnerability assessments by third-party security experts.
                        </p>
                    </div>
                </div>

                {/* Compliance */}
                <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 mb-8">
                    <h3 className="text-2xl font-semibold mb-6">Compliance & Certifications</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="bg-emerald-50 rounded-lg p-4 text-center">
                            <p className="font-semibold text-emerald-900">GDPR Compliant</p>
                        </div>
                        <div className="bg-emerald-50 rounded-lg p-4 text-center">
                            <p className="font-semibold text-emerald-900">ISO 27001</p>
                        </div>
                        <div className="bg-emerald-50 rounded-lg p-4 text-center">
                            <p className="font-semibold text-emerald-900">SOC 2 Type II</p>
                        </div>
                    </div>
                </div>

                {/* Report */}
                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl shadow-lg p-8 md:p-12">
                    <h3 className="text-2xl font-semibold mb-4">Report a Security Issue</h3>
                    <p className="mb-6 text-white/90">
                        If you discover a security vulnerability, please report it to our security team immediately. We take all reports seriously and will respond promptly.
                    </p>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                        <p className="m-0">
                            <strong>Security Email:</strong> security@segmento.in<br />
                            <strong>PGP Key:</strong> Available upon request
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
