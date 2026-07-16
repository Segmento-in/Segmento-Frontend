import { describe, it, expect } from 'vitest';
import { getModelLevelAnalysis } from './piiReasons';
import { PIIMatch } from './apiClient';

describe('getModelLevelAnalysis', () => {
  it('prioritizes llm_explanation if present', () => {
    const mockMatch = {
      label: 'EMAIL',
      matched_rule: 'EMAIL_KEYWORD',
      contributing_models: ['Regex'],
      llm_explanation: 'Flagged as EMAIL because Groq is very smart.'
    } as any; // Using any because we updated PIIMatch types

    const result = getModelLevelAnalysis(mockMatch);
    expect(result).toBe('Flagged as EMAIL because Groq is very smart.');
  });

  it('falls back to _KEYWORD static template if llm_explanation is absent', () => {
    const mockMatch = {
      label: 'NAME',
      matched_rule: 'NAME_KEYWORD',
      contributing_models: ['Regex']
    } as any;

    const result = getModelLevelAnalysis(mockMatch);
    expect(result).toBe('Flagged as NAME because the column name contains keywords strongly tied to sensitive data.');
  });
  
  it('falls back to Regex static template if llm_explanation is empty string', () => {
    const mockMatch = {
      label: 'SSN',
      matched_rule: 'N/A',
      contributing_models: ['Regex'],
      llm_explanation: '  ' // Empty/whitespace
    } as any;

    const result = getModelLevelAnalysis(mockMatch);
    expect(result).toBe('Flagged as SSN because the data exactly matches a known standard pattern for this type of information.');
  });
});
