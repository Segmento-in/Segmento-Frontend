import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ScanningIndicator from '../ScanningIndicator';

vi.mock('framer-motion', async (importOriginal) => {
    const actual = await importOriginal() as any;
    return {
        ...actual,
        useReducedMotion: () => false,
        AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
        motion: {
            div: ({ initial, animate, exit, transition, ...rest }: any) => <div {...rest} />,
            circle: ({ initial, animate, exit, transition, style, ...rest }: any) => (
                <circle 
                    {...rest} 
                    style={{ ...style, ...animate }}
                />
            )
        }
    };
});

describe('ScanningIndicator', () => {
    it('renders the formatted time remaining and label correctly', () => {
        const { getByTestId } = render(
            <ScanningIndicator 
                progressFraction={0.5} 
                formattedTimeRemaining="1:30" 
                isFirstExtension={false}
                label="Scanning test files…"
            />
        );

        expect(getByTestId('countdown-text').textContent).toBe('1:30');
        expect(getByTestId('scanning-label').textContent).toBe('Scanning test files…');
        
        const ring = getByTestId('scanning-ring');
        expect(ring.getAttribute('class')).toContain('text-emerald-400');
    });

    it('ring visual progress reflects progressFraction via strokeDashoffset', () => {
        // radius = 20, circumference = 2 * Math.PI * 20 = 125.6637
        const { getByTestId, rerender } = render(
            <ScanningIndicator 
                progressFraction={0} 
                formattedTimeRemaining="2:00" 
                isFirstExtension={false}
            />
        );

        const ring = getByTestId('scanning-ring');
        
        // When progressFraction = 0, strokeDashoffset = circumference
        const offsetAtZero = parseFloat(ring.style.strokeDashoffset);
        const circumference = parseFloat(ring.style.strokeDasharray);
        expect(offsetAtZero).toBeCloseTo(circumference, 1);

        // When progressFraction = 0.5, strokeDashoffset = circumference / 2
        rerender(
            <ScanningIndicator 
                progressFraction={0.5} 
                formattedTimeRemaining="1:00" 
                isFirstExtension={false}
            />
        );
        const offsetAtHalf = parseFloat(getByTestId('scanning-ring').style.strokeDashoffset);
        expect(offsetAtHalf).toBeCloseTo(circumference / 2, 1);

        // When progressFraction = 1, strokeDashoffset = 0
        rerender(
            <ScanningIndicator 
                progressFraction={1} 
                formattedTimeRemaining="0:00" 
                isFirstExtension={false}
            />
        );
        const offsetAtFull = parseFloat(getByTestId('scanning-ring').style.strokeDashoffset);
        expect(offsetAtFull).toBeCloseTo(0, 1);
    });

    it('extensionNote only shows when isFirstExtension is true and tints ring amber', () => {
        const { queryByTestId, getByTestId, rerender } = render(
            <ScanningIndicator 
                progressFraction={0.5} 
                formattedTimeRemaining="1:00" 
                isFirstExtension={false}
                extensionNote="Test extension note"
            />
        );

        // Should not be visible initially
        expect(queryByTestId('scanning-extension-note')).toBeNull();
        expect(getByTestId('scanning-ring').getAttribute('class')).toContain('text-emerald-400');

        // Turn on extension
        rerender(
            <ScanningIndicator 
                progressFraction={0.5} 
                formattedTimeRemaining="1:00" 
                isFirstExtension={true}
                extensionNote="Test extension note"
            />
        );

        const sublabel = getByTestId('scanning-extension-note');
        expect(sublabel.textContent).toBe('Test extension note');
        
        // Ring should shift to amber
        expect(getByTestId('scanning-ring').getAttribute('class')).toContain('text-amber-400');
    });

    it('switches to indeterminate animation mode when isFirstExtension is true', () => {
        const { getByTestId, rerender } = render(
            <ScanningIndicator 
                progressFraction={1.0} 
                formattedTimeRemaining="0:00" 
                isFirstExtension={false}
            />
        );

        const ring = getByTestId('scanning-ring');
        expect(ring.getAttribute('data-state')).toBe('determinate');

        rerender(
            <ScanningIndicator 
                progressFraction={1.0} 
                formattedTimeRemaining="0:59" 
                isFirstExtension={true}
            />
        );
        
        expect(getByTestId('scanning-ring').getAttribute('data-state')).toBe('indeterminate');
        
        rerender(
            <ScanningIndicator 
                progressFraction={0.0} 
                formattedTimeRemaining="1:00" 
                isFirstExtension={false}
            />
        );
        
        expect(getByTestId('scanning-ring').getAttribute('data-state')).toBe('determinate');
    });
});
