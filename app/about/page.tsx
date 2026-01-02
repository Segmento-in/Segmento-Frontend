import Image from "next/image"
import Link from "next/link"
import { Linkedin } from "lucide-react"

export const metadata = {
    title: "About Us - Segmento",
    description: "Segmento helps businesses unlock the real value of their customer data. Founded in 2025, we turn complex data into actionable insights.",
}

const director = {
    name: "Geeta Reddy Karri",
    role: "Executive Director at Segmento",
    bio: "Geeta Reddy Karri is the Executive Director of Segmento, a data technology startup established in 2025, focused on building innovative and privacy-centric data products. She is also the Founder of Aathidyam Restaurants, a recognised hospitality brand based in Visakhapatnam, showcasing her entrepreneurial drive across industries. Geeta holds a Bachelor of Arts (BA) in Public Administration from Andhra University, providing a strong foundation in governance, administration, and strategic leadership. In addition, she completed a Certification in Desktop Administration in 2000, reflecting her early exposure to technology and systems management. With a strong passion for business and entrepreneurship, she actively contributes to shaping Segmento's vision, values, and long-term growth. Alongside her professional accomplishments, she is also a homemaker, successfully balancing leadership responsibilities with family life through discipline and dedication.",
    image: "/images/director1.png",
    linkedin: "https://www.linkedin.com/in/geeta-reddy-karri-0126163a3/",
}

const team = [
    {
        name: "Anuksha Satish Shirgave",
        role: "Web & UI Developer",
        bio: "I am a UI & Web Developer at Segmento, focused on building clean, responsive, and user-friendly web interfaces. I specialize in transforming ideas and designs into high-performance websites using modern frontend technologies. With a strong eye for detail and usability, I ensure every interface is visually appealing, intuitive, and aligned with Segmento's data-driven vision. I enjoy creating scalable UI components, improving user experience, and delivering designs that balance aesthetics with functionality.",
        image: "/images/mem2.jpeg",
        linkedin: "https://www.linkedin.com/in/anuksha-shirgave-703058232",
    },
    {
        name: "SHAIK ADAM SHAFI",
        role: "DATA AND AI TECHNOLOGIES ENGINEER AT SEGMENTO",
        bio: "I am a Data & AI Technologies Engineer at Segmento, focused on building intelligent, data-driven solutions that solve real-world business problems. I specialize in developing AI-powered systems and machine learning models using modern frameworks and technologies. With a strong focus on precision and innovation, I ensure every solution is scalable, efficient, and aligned with Segmento's privacy-first vision. I enjoy working on complex data challenges, creating intelligent automation, and delivering products that transform how enterprises handle sensitive information.",
        image: "/images/shafi-profile.jpg",
        linkedin: "http://www.linkedin.com/in/shafisk",
    },
]

const missions = [
    {
        title: "Our Mission",
        icon: "🎯",
        points: [
            "Build scalable data technology that turns raw data into actionable insights",
            "Help businesses understand customers and make smarter decisions",
            "Enable growth through reliable, high-quality data",
        ],
    },
    {
        title: "Our Vision",
        icon: "🔮",
        points: [
            "Make data intelligence simple, accessible, and trustworthy for every business",
            "Enable smarter decisions through actionable customer insights",
            "Support long-term growth with scalable data technology",
        ],
    },
]

export default function AboutPage() {
    return (
        <div className="min-h-screen py-20">
            {/* Hero */}
            <section className="mb-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-600 to-blue-600 bg-clip-text text-transparent">
                            Who Are We
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground">
                            Segmento helps businesses unlock the real value of their customer data. Founded in 2025, we turn complex data into actionable insights that fuel growth, engagement, and smarter strategies.
                        </p>
                    </div>
                </div>
            </section>

            {/* Team Title */}
            <section className="mb-12">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-center">Our Team</h2>
                </div>
            </section>

            {/* Director */}
            <section className="py-16 bg-gradient-to-br from-primary/5 to-purple-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Meet Our Executive Director</h2>
                    <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-border/50 shadow-xl p-8 md:p-12">
                        <div className="flex flex-col md:flex-row gap-8 items-center">
                            <div className="flex-shrink-0">
                                <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-primary/20">
                                    <Image
                                        src={director.image}
                                        alt={director.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <h3 className="text-2xl md:text-3xl font-bold mb-2">{director.name}</h3>
                                <p className="text-primary font-semibold mb-4">{director.role}</p>
                                <p className="text-muted-foreground mb-6 leading-relaxed text-justify">{director.bio}</p>
                                <Link
                                    href={director.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                                >
                                    <Linkedin className="w-5 h-5" />
                                    Connect on LinkedIn
                                </Link>
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
                                className="bg-white rounded-2xl border border-border/50 shadow-lg p-6 hover:shadow-xl transition-shadow group"
                            >
                                <div className="relative w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden">
                                    <Image
                                        src={member.image}
                                        alt={member.name}
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <Link
                                            href={member.linkedin}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="bg-white rounded-full p-3 shadow-lg"
                                        >
                                            <Linkedin className="w-6 h-6 text-primary" />
                                        </Link>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <h3 className="text-xl font-bold mb-2">{member.name}</h3>
                                    <p className="text-primary text-sm font-semibold mb-3">{member.role}</p>
                                    <p className="text-muted-foreground text-sm text-justify">{member.bio}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-16 bg-gradient-to-br from-primary/5 to-purple-50">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                        {missions.map((mission) => (
                            <div
                                key={mission.title}
                                className="bg-white rounded-2xl border border-border/50 shadow-lg p-8"
                            >
                                <div className="text-5xl mb-4">{mission.icon}</div>
                                <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                                    {mission.title}
                                </h3>
                                <ul className="space-y-3">
                                    {mission.points.map((point, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <span className="text-primary mt-1 font-bold">−</span>
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
                        <Link href="/products/data-classification">
                            <button className="px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                                Explore Products
                            </button>
                        </Link>
                        <Link href="/careers">
                            <button className="px-8 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary/5 transition-colors">
                                View Careers
                            </button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}
