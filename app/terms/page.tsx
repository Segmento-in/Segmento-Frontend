"use client";

import Link from "next/link";
import { FileText, ArrowLeft } from "lucide-react";

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
                <div className="container mx-auto px-4">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
                    <p className="text-xl text-white/90">Last updated: January 19, 2026</p>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-12 max-w-4xl">
                <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
                    <div className="prose prose-lg max-w-none">
                        <div className="flex items-center gap-3 mb-6">
                            <FileText className="w-8 h-8 text-indigo-600" />
                            <h2 className="text-2xl font-bold m-0">Agreement to Terms</h2>
                        </div>

                        <p className="text-gray-600 leading-relaxed">
                            By accessing or using Segmento's services, you agree to be bound by these Terms of Service. Please read them carefully.
                        </p>

                        <h3 className="text-xl font-semibold mt-8 mb-4">1. Use of Services</h3>
                        <p className="text-gray-600 leading-relaxed">
                            You may use our services only in compliance with these Terms and all applicable laws. You are responsible for maintaining the confidentiality of your account credentials.
                        </p>

                        <h3 className="text-xl font-semibold mt-8 mb-4">2. Intellectual Property</h3>
                        <p className="text-gray-600 leading-relaxed">
                            All content, features, and functionality of Segmento's services are owned by Segmento and are protected by international copyright, trademark, and other intellectual property laws.
                        </p>

                        <h3 className="text-xl font-semibold mt-8 mb-4">3. User Responsibilities</h3>
                        <ul className="space-y-2 text-gray-600">
                            <li>Provide accurate and complete information</li>
                            <li>Maintain the security of your account</li>
                            <li>Comply with all applicable laws and regulations</li>
                            <li>Not misuse or abuse our services</li>
                        </ul>

                        <h3 className="text-xl font-semibold mt-8 mb-4">4. Privacy</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Your use of our services is also governed by our Privacy Policy. Please review our <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link> to understand our practices.
                        </p>

                        <h3 className="text-xl font-semibold mt-8 mb-4">5. Limitation of Liability</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Segmento shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the services.
                        </p>

                        <h3 className="text-xl font-semibold mt-8 mb-4">6. Changes to Terms</h3>
                        <p className="text-gray-600 leading-relaxed">
                            We reserve the right to modify these Terms at any time. We will notify users of any material changes via email or through our services.
                        </p>

                        <h3 className="text-xl font-semibold mt-8 mb-4">7. Contact Information</h3>
                        <p className="text-gray-600 leading-relaxed">
                            For questions about these Terms, please contact us:
                        </p>
                        <div className="bg-indigo-50 rounded-lg p-4 mt-4">
                            <p className="m-0 text-gray-700">
                                <strong>Email:</strong> legal@segmento.in<br />
                                <strong>Phone:</strong> +91 8668880805
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
