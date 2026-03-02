'use client';

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const director = {
    name: "Geetha Reddy K",
    role: "Executive Director at Segmento",
    bio: "Geetha Reddy K is the Executive Director of Segmento, a data technology startup established in 2025, focused on building innovative and privacy-centric data products. She is also the Founder of Aathidyam Restaurants, a recognised hospitality brand based in Visakhapatnam, showcasing her entrepreneurial drive across industries. Geeta holds a Bachelor of Arts (BA) in Public Administration from Andhra University, providing a strong foundation in governance, administration, and strategic leadership. In addition, she completed a Certification in Desktop Administration in 2000, reflecting her early exposure to technology and systems management. With a strong passion for business and entrepreneurship, she actively contributes to shaping Segmento's vision, values, and long-term growth. Alongside her professional accomplishments, she is also a homemaker, successfully balancing leadership responsibilities with family life through discipline and dedication.",
    image: "/images/director1.png",
    linkedin: "https://www.linkedin.com/in/geeta-reddy-karri-0126163a3/",
};

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
        bio: "Maddila Vijayalakshmi is a Full Stack Developer at Segmento, focused on building scalable, secure, and high-performance web applications. She specializes in transforming complex requirements into seamless, end-to-end solutions using modern frontend and backend technologies. With a strong eye for system design and performance, she ensures every application is reliable, efficient, and aligned with Segmento’s data-driven vision. Vijayalakshmi excels at developing scalable components, optimizing application performance, and delivering solutions that balance functionality with user experience, contributing to Segmento’s mission of making data intelligence accessible through powerful and impactful digital platforms.",
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
];

const MissionIcon = () => (
    <div className="relative w-12 h-12 flex items-center justify-center">
        {/* Glowing background effect */}
        <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full"></div>
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/>
            <path d="M2 12L12 17L22 12" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="7" r="1" fill="#fff" />
        </svg>
    </div>
);

const VisionIcon = () => (
    <div className="relative w-12 h-12 flex items-center justify-center">
        {/* Glowing background effect */}
        <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full"></div>
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative">
            <path d="M21 12C21 12 18 18 12 18C6 18 3 12 3 12C3 12 6 6 12 6C18 6 21 12 21 12Z" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="12" r="3" stroke="#6366f1" strokeWidth="2"/>
            <path d="M12 10V12L13.5 13.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
    </div>
);

// --- UPDATED MISSIONS CONSTANT ---

const missions = [
    {
        title: "Our Mission",
        icon: <MissionIcon />,
        points: [
            "Build scalable data technology that turns raw data into actionable insights",
            "Help businesses understand customers and make smarter decisions",
            "Enable growth through reliable, high-quality data",
        ],
    },
    {
        title: "Our Vision",
        icon: <VisionIcon />,
        points: [
            "Make data intelligence simple, accessible, and trustworthy for every business",
            "Enable smarter decisions through actionable customer insights",
            "Support long-term growth with scalable data technology",
            "Create a privacy-first ecosystem for enterprise data security"
        ],
    },
];

const LinkedinIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="w-5 h-5 hover:scale-110 transition-transform">
        <path
            d="M100.28 448H7.4V148.9h92.88zm-46.44-341.7C24.3 106.3 0 81.85 0 52.63 0 23.38 24.3 0 54.18 0c29.87 0 54.18 23.38 54.18 52.63 0 29.22-24.31 53.67-54.18 53.67zM447.9 448h-92.68V302.4c0-34.7-12.42-58.4-43.48-58.4-23.7 0-37.79 15.94-44 31.34-2.27 5.53-2.84 13.2-2.84 20.9V448h-92.76s1.23-271.7 0-299.1h92.76v42.3h.61v-.88c12.32-19 34.34-46.2 83.45-46.2 60.88 0 106.54 39.77 106.54 125.3V448z"
            fill="#0A66C2"
        />
    </svg>
);

const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
};

const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.1
        }
    }
};

export default function AboutClient() {
    return (
  <div className="min-h-screen overflow-x-hidden bg-[#0b0f3b]">

    {/* Hero Section */}
    <motion.section
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
      variants={fadeInUp}
      className="mb-20 py-28"
    >
      <div className="container mx-auto px- text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight leading-tight bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-400 bg-clip-text text-transparent">
            Who Are We
          </h1>
          <p className="text-lg md:text-xl text-slate-300 font-medium leading-relaxed max-w-3xl mx-auto">
            Segmento helps businesses unlock the real value of their customer data. 
            Founded in 2025, we turn complex data into actionable insights that fuel 
            growth, engagement, and smarter strategies.
          </p>
      </div>
    </motion.section>

    {/* Director Section */}
    <section className="py-16 bg-gradient-to-br from-purple-50 to-indigo-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Meet Our Team</h2>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative max-w-4xl mx-auto rounded-2xl p-1"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-500 rounded-2xl blur opacity-60"></div>
          <div className="relative bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-transparent flex-shrink-0">
                  <Image src={director.image} alt={director.name} fill className="object-cover" />
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
        </motion.div>
      </div>
    </section>

    {/* Team Members Section - COLOR UPDATED TO MATCH REFERENCE IMAGE */}
    <section className="py-16 bg-slate-900">
      <div className="container mx-auto px-4">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto"
        >
          {team.map((member) => (
            <motion.div
              key={member.name}
              variants={fadeInUp}
              whileHover={{ y: -5 }}
              className="bg-[#121b33] border border-slate-700/40 rounded-2xl shadow-xl p-8 transition-all"
            >
              <div className="flex flex-col items-center mb-6">
                <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-slate-600">
                  <Image src={member.image} alt={member.name} fill className="object-cover" />
                </div>
              </div>
              <div className="text-center">
                <div className="flex justify-center items-center gap-2 mb-2">
                  <h3 className="text-xl font-bold text-white tracking-wide">{member.name}</h3>
                  <Link href={member.linkedin} target="_blank" rel="noopener noreferrer">
                    <LinkedinIcon />
                  </Link>
                </div>
                <p className="text-white text-sm font-semibold mb-4 opacity-90">{member.role}</p>
                <p className="text-slate-400 text-sm leading-relaxed text-justify opacity-80">
                    {member.bio}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>

    {/* Mission & Vision Section */}
<section className="py-16 bg-white">
  <div className="container mx-auto px-4">
    <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
      {missions.map((mission) => (
        <div key={mission.title} className="bg-slate-900 rounded-2xl border border-slate-700 shadow-lg p-8 hover:border-indigo-500 transition-colors duration-300">
          <div className="text-5xl mb-4">{mission.icon}</div>
          <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-indigo-500 bg-clip-text text-transparent">
            {mission.title}
          </h3>
          <ul className="space-y-3">
            {mission.points.map((point, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="text-cyan-400 mt-1 font-bold">−</span>
                <span className="text-slate-300">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </div>
</section>

    {/* CTA Section */}
   
<section className="bg-white py-24">
    <div className="container mx-auto px-4 text-center">
        <div className="max-w-5xl mx-auto p-12 md:p-16 [3rem] bg-[#0f172a] border border-slate-800 shadow-2xl relative overflow-hidden">
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-cyan-500/10 blur-[100px] rounded-full" />
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full" />

            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-blue-500 relative z-10">
                Join Us on This Journey
            </h2>
            
            <p className="text-slate-400 mb-10 font-medium text-lg max-w-2xl mx-auto relative z-10 leading-relaxed">
                We&apos;re building the future of data intelligence. Explore our products or join our team.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center relative z-10">
                <Link 
                    href="/products" 
                    className="px-10 py-4 bg-linear-to-r from-cyan-500 via-blue-500 to-indigo-500 text-white rounded-xl font-bold shadow-xl shadow-blue-900/20 transition-transform hover:scale-105 active:scale-95 text-center"
                >
                    Explore Products
                </Link>
                <Link 
                    href="/careers" 
                    className="px-10 py-4 border-2 border-cyan-400/50 text-cyan-400 rounded-xl font-bold hover:bg-cyan-400/10 transition-all shadow-lg hover:border-cyan-400 text-center"
                >
                    View Careers
                </Link>
            </div>
        </div>
    </div>
</section>

  </div>
  );
}