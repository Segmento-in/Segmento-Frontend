export interface FreshnessTag {
    text: string;
    className: string;
}

export function getFreshnessTag(dateString: string): FreshnessTag {
    const date = new Date(dateString);
    const now = new Date();

    // Reset times to compare dates only
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const n = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const diffTime = n.getTime() - d.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Difference in days

    if (diffDays <= 0) {
        return { text: "Today's News", className: "bg-green-100 text-green-800 border-green-200" };
    } else if (diffDays === 1) {
        return { text: "Yesterday's News", className: "bg-orange-100 text-orange-800 border-orange-200" };
    } else {
        return { text: "Previous News", className: "bg-amber-100 text-amber-800 border-amber-200" };
    }
}
