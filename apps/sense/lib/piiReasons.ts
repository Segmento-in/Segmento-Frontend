import { PIIMatch } from './apiClient';

export function getModelLevelAnalysis(match: PIIMatch): string {
    const { label, matched_rule, contributing_models } = match;

    // 1. Metadata Scanner (ends with _KEYWORD)
    if (matched_rule && matched_rule.endsWith('_KEYWORD')) {
        return `Flagged as ${label} because the column name contains keywords strongly tied to sensitive data.`;
    }

    // 2. Regex vs AI Consensus
    if (contributing_models && contributing_models.length > 0) {
        // If Regex is the ONLY model in the array, it's a pure pattern match
        if (contributing_models.length === 1 && contributing_models[0] === 'Regex') {
            return `Flagged as ${label} because the data exactly matches a known standard pattern for this type of information.`;
        }

        // Otherwise it's AI consensus (filter out Regex from the printed list if both flagged)
        const aiModels = contributing_models.filter(m => m !== 'Regex');
        if (aiModels.length > 0) {
            const count = aiModels.length;
            const models = aiModels.join(', ');
            return `Flagged as ${label} because ${count} of our AI models (${models}) agreed based on the surrounding text.`;
        }
    }

    // Fallback
    return `Flagged as ${label} by our detection system.`;
}
