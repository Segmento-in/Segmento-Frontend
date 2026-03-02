import { Clock } from "lucide-react";

interface TimeDisplayProps {
    timestamp: string;
    className?: string;
}

export default function TimeDisplay({ timestamp, className = "" }: TimeDisplayProps) {
    let formattedTime = "Invalid Date";
    try {
        if (!timestamp) throw new Error("No timestamp");
        formattedTime = new Intl.DateTimeFormat('en-IN', {
            timeZone: 'Asia/Kolkata',
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        }).format(new Date(timestamp));
    } catch (e) {
        console.error("Invalid time value:", timestamp);
    }

    return (
        <div className={`flex items-center gap-2 text-sm text-gray-400 ${className}`}>
            <Clock className="w-4 h-4" />
            <span>{formattedTime} IST</span>
        </div>
    );
}
