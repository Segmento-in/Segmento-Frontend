import { describe, it, expect } from 'vitest';
import { getModelLevelAnalysis } from './piiReasons';
import { PIIMatch } from './apiClient';

describe('getModelLevelAnalysis', () => {
    it('returns template 3 for MetadataScanner-style rules (ending in _KEYWORD)', () => {
        const match: PIIMatch = {
            label: 'EMAIL_KEYWORD',
            text: 'email_address',
            start: 0,
            end: 13,
            source: 'Regex',
            matched_rule: 'EMAIL_KEYWORD'
        };
        const reason = getModelLevelAnalysis(match);
        expect(reason).toBe('Flagged as EMAIL_KEYWORD because the column name contains keywords strongly tied to sensitive data.');
    });

    it('returns template 2 for pure Regex matches (contributing_models = ["Regex"])', () => {
        const match: PIIMatch = {
            label: 'EMAIL',
            text: 'test@example.com',
            start: 0,
            end: 16,
            source: 'Regex',
            contributing_models: ['Regex']
        };
        const reason = getModelLevelAnalysis(match);
        expect(reason).toBe('Flagged as EMAIL because the data exactly matches a known standard pattern for this type of information.');
    });

    it('returns template 1 for AI-consensus match with 2 contributing models', () => {
        const match: PIIMatch = {
            label: 'FIRST_NAME',
            text: 'Sarah',
            start: 0,
            end: 5,
            source: 'Ensemble (DeBERTa)',
            contributing_models: ['DeBERTa', 'Presidio']
        };
        const reason = getModelLevelAnalysis(match);
        expect(reason).toBe('Flagged as FIRST_NAME because 2 of our AI models (DeBERTa, Presidio) agreed based on the surrounding text.');
    });

    it('filters out "Regex" from the AI consensus list if both flagged it', () => {
        const match: PIIMatch = {
            label: 'EMAIL',
            text: 'Sarah@example.com',
            start: 0,
            end: 17,
            source: 'Ensemble (DeBERTa)',
            contributing_models: ['Regex', 'DeBERTa']
        };
        const reason = getModelLevelAnalysis(match);
        expect(reason).toBe('Flagged as EMAIL because 1 of our AI models (DeBERTa) agreed based on the surrounding text.');
    });

    it('returns template 1 for AI-consensus match with 5 contributing models dynamically', () => {
        const match: PIIMatch = {
            label: 'PERSON',
            text: 'John Doe',
            start: 0,
            end: 8,
            source: 'Ensemble (DeBERTa)',
            contributing_models: ['DeBERTa', 'GLiNER', 'GLiNER-Large', 'NerGuard', 'Presidio']
        };
        const reason = getModelLevelAnalysis(match);
        expect(reason).toBe('Flagged as PERSON because 5 of our AI models (DeBERTa, GLiNER, GLiNER-Large, NerGuard, Presidio) agreed based on the surrounding text.');
    });

    it('returns a sane fallback for unknown rules without matched_rule or contributing_models', () => {
        const match: PIIMatch = {
            label: 'UNKNOWN_TYPE',
            text: 'something',
            start: 0,
            end: 9,
            source: 'UnknownSource'
        };
        const reason = getModelLevelAnalysis(match);
        expect(reason).toBe('Flagged as UNKNOWN_TYPE by our detection system.');
    });
});
