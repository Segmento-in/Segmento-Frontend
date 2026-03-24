"use client";

import Link from "next/link";
import { Shield, Lock, FileText, ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
                <div className="container mx-auto px-4">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
                    <p className="text-xl text-white/90">Last updated: January 19, 2026</p>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-12 max-w-4xl">
                <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
                    <div className="prose prose-lg max-w-none">
                        <div className="flex items-center gap-3 mb-6">
                            <Shield className="w-8 h-8 text-blue-600" />
                            <h2 className="text-2xl font-bold m-0">Your Privacy Matters</h2>
                        </div>

                        <p className="text-gray-600 leading-relaxed">
                            At Segmento, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, and safeguard your data.
                        </p>

                        <h3 className="text-xl font-semibold mt-8 mb-4">Information We Collect</h3>
                        <ul className="space-y-2 text-gray-600">
                            <li>Contact information (name, email address, phone number)</li>
                            <li>Usage data and analytics</li>
                            <li>Device and browser information</li>
                            <li>Cookies and similar tracking technologies</li>
                        </ul>

                        <h3 className="text-xl font-semibold mt-8 mb-4">How We Use Your Information</h3>
                        <ul className="space-y-2 text-gray-600">
                            <li>To provide and improve our services</li>
                            <li>To communicate with you about our products</li>
                            <li>To send marketing communications (with your consent)</li>
                            <li>To comply with legal obligations</li>
                        </ul>

                        <h3 className="text-xl font-semibold mt-8 mb-4">Data Security</h3>
                        <p className="text-gray-600 leading-relaxed">
                            We implement industry-standard security measures to protect your personal information from unauthorized access, disclosure, alteration, and destruction.
                        </p>

                        <h3 className="text-xl font-semibold mt-8 mb-4">Your Rights</h3>
                        <ul className="space-y-2 text-gray-600">
                            <li>Access your personal data</li>
                            <li>Request correction of inaccurate data</li>
                            <li>Request deletion of your data</li>
                            <li>Opt-out of marketing communications</li>
                        </ul>

                        <h3 className="text-xl font-semibold mt-8 mb-4">Cookies</h3>
                        <p className="text-gray-600 leading-relaxed">
                            We use cookies to enhance your browsing experience and analyze site traffic. You can control cookie settings through your browser preferences.
                        </p>

                        <h3 className="text-xl font-semibold mt-8 mb-4">Contact Us</h3>
                        <p className="text-gray-600 leading-relaxed">
                            If you have any questions about this Privacy Policy, please contact us at:
                        </p>
                        <div className="bg-blue-50 rounded-lg p-4 mt-4">
                            <p className="m-0 text-gray-700">
                                <strong>Email:</strong> privacy@segmento.in<br />
                                <strong>Phone:</strong> +91 8668880805
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
