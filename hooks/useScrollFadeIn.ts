import { useEffect, useRef, useState } from "react";

export function useScrollFadeIn(direction: "up" | "down" | "left" | "right" = "up", duration = 0.8, delay = 0) {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.1 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    const translate = {
        up: "translate-y-8",
        down: "-translate-y-8",
        left: "translate-x-8",
        right: "-translate-x-8",
    };

    return {
        ref,
        style: {
            transition: `opacity ${duration}s ease-out ${delay}s, transform ${duration}s ease-out ${delay}s`,
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translate(0,0)" : translate[direction],
        },
    };
}
