/**
 * ArticleImage — unit tests
 *
 * Seam: the component's rendered output given specific props.
 * All assertions are against the public interface (props → DOM) — no internal state checked.
 *
 * Fallback path under test: /pulse/placeholder-news.svg
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ArticleImage } from './ArticleImage';

const FALLBACK = '/pulse/placeholder-news.svg';
const REAL_URL = 'https://example.com/image.jpg';
const OTHER_URL = 'https://example.com/other.jpg';

describe('ArticleImage', () => {
    // ── Fallback: missing src ──────────────────────────────────────────────

    it('renders the Article Fallback Banner when src is undefined', () => {
        render(<ArticleImage src={undefined} alt="test" />);
        const img = screen.getByRole('img');
        expect(img).toHaveAttribute('src', FALLBACK);
    });

    it('renders the Article Fallback Banner when src is null', () => {
        render(<ArticleImage src={null} alt="test" />);
        const img = screen.getByRole('img');
        expect(img).toHaveAttribute('src', FALLBACK);
    });

    it('renders the Article Fallback Banner when src is an empty string', () => {
        render(<ArticleImage src="" alt="test" />);
        const img = screen.getByRole('img');
        expect(img).toHaveAttribute('src', FALLBACK);
    });

    // ── Real image: valid src ─────────────────────────────────────────────

    it('renders the real image src when src is a valid URL', () => {
        render(<ArticleImage src={REAL_URL} alt="test" />);
        const img = screen.getByRole('img');
        expect(img).toHaveAttribute('src', REAL_URL);
    });

    // ── Fallback on load failure ──────────────────────────────────────────

    it('swaps to the Article Fallback Banner when the image fires onError', () => {
        render(<ArticleImage src={REAL_URL} alt="test" />);
        const img = screen.getByRole('img');
        // Confirm real src first
        expect(img).toHaveAttribute('src', REAL_URL);
        // Simulate browser load failure
        fireEvent.error(img);
        // Must now show fallback
        expect(img).toHaveAttribute('src', FALLBACK);
    });

    // ── Src change resets failure state ───────────────────────────────────

    it('resets to real src when src prop changes after a failure', () => {
        const { rerender } = render(<ArticleImage src={REAL_URL} alt="test" />);
        const img = screen.getByRole('img');
        // Cause failure
        fireEvent.error(img);
        expect(img).toHaveAttribute('src', FALLBACK);
        // Change src → must reset failure, show new URL
        rerender(<ArticleImage src={OTHER_URL} alt="test" />);
        expect(img).toHaveAttribute('src', OTHER_URL);
    });

    // ── Pass-through props ────────────────────────────────────────────────

    it('forwards className to the rendered img element', () => {
        render(<ArticleImage src={REAL_URL} alt="test" className="w-full h-full object-cover" />);
        const img = screen.getByRole('img');
        expect(img).toHaveClass('w-full', 'h-full', 'object-cover');
    });

    it('forwards loading="lazy" to the rendered img element', () => {
        render(<ArticleImage src={REAL_URL} alt="test" loading="lazy" />);
        const img = screen.getByRole('img');
        expect(img).toHaveAttribute('loading', 'lazy');
    });
});
