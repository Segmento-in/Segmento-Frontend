import { Metadata } from "next";
import AboutClient from "./about-client";

export const metadata: Metadata = {
    title: "About Us - Segmento",
    description:
        "Segmento helps businesses unlock the real value of their customer data. Founded in 2025, we turn complex data into actionable insights.",
};

export default function AboutPage() {
<<<<<<< HEAD
    return <AboutClient />;
}
=======
    return (
        <div className="min-h-screen py-20">
            {/* Hero */}
            <section className="mb-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-linear-to-r from-purple-600 via-indigo-600 to-pink-500 bg-clip-text text-transparent">
                            Who Are We
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground">
                            Segmento helps businesses unlock the real value of their customer data. Founded in 2025, we turn complex data into actionable insights that fuel growth, engagement, and smarter strategies.
                        </p>
                    </div>
                </div>
            </section>

            {/* Director Section */}
            <section className="py-16 bg-linear-to-br from-purple-50 to-indigo-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Meet Our Executive Director</h2>
                    <div className="relative max-w-4xl mx-auto rounded-2xl p-1">
                        {/* Colorful gradient border */}
                        <div className="absolute inset-0 bg-linear-to-r from-purple-400 via-pink-500 to-indigo-500 rounded-2xl blur opacity-60"></div>
                        <div className="relative bg-white rounded-2xl shadow-lg p-8 md:p-12">
                            <div className="flex flex-col md:flex-row gap-8 items-start">
                                <div className="shrink-0 flex flex-col items-center gap-4">
                                    <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-transparent">
                                        <Image src={director.image} alt={director.name} fill className="object-cover" />
                                    </div>
                                </div>
                                <div className="flex-1 text-center md:text-left">
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="text-2xl md:text-3xl font-bold">{director.name}</h3>
                                        <Link href={director.linkedin} target="_blank" rel="noopener noreferrer">
                                            <LinkedinIcon />
                                        </Link>
                                    </div>
                                    <p className="text-purple-700 font-semibold mb-4">{director.role}</p>
                                    <p className="text-muted-foreground mb-6 leading-relaxed text-justify">
                                        {director.bio}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Members */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {team.map((member) => (
                            <div
                                key={member.name}
                                className="bg-white rounded-2xl border border-purple-900 shadow-lg p-6 transition-all duration-300"
                            >
                                <div className="flex flex-col items-center gap-4 mb-6">
                                    <div className="relative w-32 h-32 rounded-full overflow-hidden border border-purple-800">
                                        <Image src={member.image} alt={member.name} fill className="object-cover" />
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="flex justify-center items-center mb-2">
                                        <h3 className="text-xl font-bold">{member.name}</h3>
                                        <Link href={member.linkedin} target="_blank" rel="noopener noreferrer" className="ml-2">
                                            <LinkedinIcon />
                                        </Link>
                                    </div>
                                    <p className="text-purple-900 text-sm font-semibold mb-3">{member.role}</p>
                                    <p className="text-muted-foreground text-sm text-justify">{member.bio}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-16 bg-linear-to-br from-purple-50 to-indigo-50">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                        {missions.map((mission) => (
                            <div
                                key={mission.title}
                                className="bg-white rounded-2xl border-2 border-purple-400 shadow-lg p-8 transform hover:-translate-y-2 transition-all duration-500 animate-fade-in"
                            >
                                <div className="text-5xl mb-4">{mission.icon}</div>
                                <h3 className="text-2xl font-bold mb-6 bg-linear-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                                    {mission.title}
                                </h3>
                                <ul className="space-y-3">
                                    {mission.points.map((point, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <span className="text-purple-600 mt-1 font-bold">−</span>
                                            <span className="text-muted-foreground">{point}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Join Us on This Journey</h2>
                    <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                        We're building the future of data intelligence. Explore our products or join our team.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="products/data-classification">
                            <button className="px-8 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors">
                                Explore Products
                            </button>
                        </Link>
                        <Link href="/careers">
                            <button className="px-8 py-3 border-2 border-purple-600 text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition-colors">
                                View Careers
                            </button>
                        </Link>
                    </div>
                </div>
            </section>

            <style jsx>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in {
                    animation: fade-in 0.6s ease-out;
                }
            `}</style>
        </div>
    );
}
>>>>>>> 343556e1c2787e9852b5a63fe74fa230615d3ae6
