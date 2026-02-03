import Image from "next/image"
import Link from "next/link"

export const metadata = {
    title: "About Us - Segmento",
    description:
        "Segmento helps businesses unlock the real value of their customer data. Founded in 2025, we turn complex data into actionable insights.",
}

const director = {
    name: "Geetha Reddy K",
    role: "Executive Director at Segmento",
    bio: "Geetha Reddy K is the Executive Director of Segmento, a data technology startup established in 2025, focused on building innovative and privacy-centric data products. She is also the Founder of Aathidyam Restaurants, a recognised hospitality brand based in Visakhapatnam, showcasing her entrepreneurial drive across industries. Geeta holds a Bachelor of Arts (BA) in Public Administration from Andhra University, providing a strong foundation in governance, administration, and strategic leadership. In addition, she completed a Certification in Desktop Administration in 2000, reflecting her early exposure to technology and systems management. With a strong passion for business and entrepreneurship, she actively contributes to shaping Segmento's vision, values, and long-term growth. Alongside her professional accomplishments, she is also a homemaker, successfully balancing leadership responsibilities with family life through discipline and dedication.",
    image: "/images/director1.png",
    linkedin: "https://www.linkedin.com/in/geeta-reddy-karri-0126163a3/",
}

const team = [
    {
        name: "Anuksha Shirgave",
        role: "Web & UI Developer",
        bio: "Anuksha Shirgave is a UI & Web Developer at Segmento, focused on building clean, responsive, and user-friendly web interfaces. She specializes in transforming ideas and designs into high-performance websites using modern frontend technologies. With a strong eye for detail and usability, she ensures every interface is visually appealing, intuitive, and aligned with Segmento's data-driven vision. Anuksha excels at creating scalable UI components, improving user experience, and delivering designs that balance aesthetics with functionality, contributing to Segmento's mission of making data intelligence accessible through exceptional web experiences.",
        image: "/images/mem2.jpeg",
        linkedin: "https://www.linkedin.com/in/anuksha-shirgave-703058232",
    },
    {
        name: "Adam Shafi",
        role: "Data and Ai Technologies Developer",
        bio: "Adam Shafi is a Data & AI Technologies Engineer at Segmento, focused on building intelligent, data-driven solutions that solve real-world business problems. He specializes in developing AI-powered systems and machine learning models using modern frameworks and technologies. With a strong focus on precision and innovation, he ensures every solution is scalable, efficient, and aligned with Segmento's privacy-first vision. Shafi excels at working on complex data challenges, creating intelligent automation, and delivering products that transform how enterprises handle sensitive information, driving Segmento's commitment to privacy-centric AI innovation.",
        image: "/images/shafi-profile.jpg",
        linkedin: "http://www.linkedin.com/in/shafisk",
    },
    {
        name: "Thambabattula Mohan",
        role: "Data Developer",
        bio: "Thambabattula Mohan is a Data Developer at Segmento, focused on designing and building robust data pipelines, databases, and analytical systems that support data-driven decision-making. He specializes in processing, structuring, and optimizing large datasets using modern data technologies and frameworks. With a strong understanding of data architecture and performance optimization, Mohan ensures data is accurate, scalable, and reliable across platforms. He excels at transforming raw data into structured, actionable formats, contributing to Segmento’s mission of delivering intelligent, privacy-centric data solutions.",
        image: "/images/mohan.png",
        linkedin: "http://www.linkedin.com/in/mohan-thambabattula",
    },
    {
        name: "Maddila Vijayalakshmi",
        role: "Full Stack Developer",
        bio: "Maddila Vijayalakshmi is a Full Stack Developer at Segmento, specializing in building robust, scalable, and high-performance web applications. She works across both frontend and backend technologies to transform complex requirements into seamless, end-to-end solutions. With strong expertise in modern frameworks, APIs, and database systems, she ensures applications are secure, efficient, and maintainable. Vijayalakshmi has a problem-solving mindset and a deep understanding of system architecture, enabling her to deliver reliable products that align with Segmento’s data-driven vision. Her ability to balance functionality, performance, and user experience plays a key role in creating powerful platforms that make data intelligence accessible and impactful.",
        image: "/images/vijayalakshmi.png",
        linkedin: "http://www.linkedin.com/in/maddila-vijayalakshmi-3320ba29a",
    },
    {
        name: "Vedhagiri Thejesh Naidu",
        role: "Intern",
        bio: "Vedhagiri Thejesh Naidu is a Intern at Segmento, focused on learning and supporting data analysis, processing, and visualization tasks. He assists in working with datasets, performing data cleaning, exploratory analysis, and supporting the development of data-driven insights. With a strong curiosity for data and analytics, Thejesh is developing skills in data tools, databases, and analytical workflows. His attention to detail, eagerness to learn, and analytical mindset enable him to contribute effectively while growing in alignment with Segmento’s mission of making data intelligence accessible and actionable.",
        image: "/images/thejesh.png",
        linkedin: "http://www.linkedin.com/in/thejesh-naidu-4439a0304",
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

const LinkedinIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="w-6 h-6">
        <path
            d="M100.28 448H7.4V148.9h92.88zm-46.44-341.7C24.3 106.3 0 81.85 0 52.63 0 23.38 24.3 0 54.18 0c29.87 0 54.18 23.38 54.18 52.63 0 29.22-24.31 53.67-54.18 53.67zM447.9 448h-92.68V302.4c0-34.7-12.42-58.4-43.48-58.4-23.7 0-37.79 15.94-44 31.34-2.27 5.53-2.84 13.2-2.84 20.9V448h-92.76s1.23-271.7 0-299.1h92.76v42.3h.61v-.88c12.32-19 34.34-46.2 83.45-46.2 60.88 0 106.54 39.77 106.54 125.3V448z"
            fill="#0A66C2"
        />
    </svg>
)

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
                    <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
                        Meet Our Executive Director
                    </h2>
                    <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-border/50 shadow-xl p-8 md:p-12">
                        <div className="flex flex-col md:flex-row gap-8 items-start">
                            <div className="flex-shrink-0 flex flex-col items-center gap-4">
                                <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-primary/20">
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
                                <p className="text-primary font-semibold mb-4">{director.role}</p>
                                <p className="text-muted-foreground mb-6 leading-relaxed text-justify">
                                    {director.bio}
                                </p>
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
                                className="bg-white rounded-2xl border border-border/50 shadow-lg p-6 hover:shadow-xl transition-shadow"
                            >
                                <div className="flex flex-col items-center gap-4 mb-6">
                                    <div className="relative w-32 h-32 rounded-full overflow-hidden">
                                        <Image src={member.image} alt={member.name} fill className="object-cover" />
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="flex justify-center items-center mb-2">
                                        <h3 className="text-xl font-bold">{member.name}</h3>
                                        <Link
                                            href={member.linkedin}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="ml-2"
                                        >
                                            <LinkedinIcon />
                                        </Link>
                                    </div>
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
                        <Link href="#products">
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
