import { Metadata } from "next";
import AboutClient from "./about-client";

export const metadata: Metadata = {
    title: "About Us - Segmento",
    description:
        "Segmento helps businesses unlock the real value of their customer data. Founded in 2025, we turn complex data into actionable insights.",
};

export default function AboutPage() {
    return <AboutClient />;
}
