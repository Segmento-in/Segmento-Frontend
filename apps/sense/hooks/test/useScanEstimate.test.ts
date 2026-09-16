import { renderHook, act } from '@testing-library/react';
import { useScanEstimate } from '../useScanEstimate';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('useScanEstimate', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });
    
    afterEach(() => {
        vi.useRealTimers();
    });

    const MB = 1024 * 1024;

    it('exactly 5MB and exactly 50MB land in the correct byte bucket (mid)', () => {
        const { result: res1 } = renderHook(() => useScanEstimate({ type: 'bytes', value: 5 * MB }, false));
        expect(res1.current.rangeLabel).toBe('2–4 min');
        expect(res1.current.timeRemainingSeconds).toBe(240);

        const { result: res2 } = renderHook(() => useScanEstimate({ type: 'bytes', value: 50 * MB }, false));
        expect(res2.current.rangeLabel).toBe('2–4 min');
        expect(res2.current.timeRemainingSeconds).toBe(240);
    });

    it('exactly 5 items and exactly 20 items land in the correct count bucket (mid)', () => {
        const { result: res1 } = renderHook(() => useScanEstimate({ type: 'count', value: 5 }, false));
        expect(res1.current.rangeLabel).toBe('2–4 min');
        expect(res1.current.timeRemainingSeconds).toBe(240);

        const { result: res2 } = renderHook(() => useScanEstimate({ type: 'count', value: 20 }, false));
        expect(res2.current.rangeLabel).toBe('2–4 min');
        expect(res2.current.timeRemainingSeconds).toBe(240);
    });

    it('countdown starts at the correct value for each of the 6 bucket/method combinations', () => {
        // bytes small
        const { result: bSmall } = renderHook(() => useScanEstimate({ type: 'bytes', value: 4 * MB }, false));
        expect(bSmall.current.formattedTimeRemaining).toBe('1:00');
        expect(bSmall.current.rangeLabel).toBe('30 sec–1 min');

        // bytes mid
        const { result: bMid } = renderHook(() => useScanEstimate({ type: 'bytes', value: 10 * MB }, false));
        expect(bMid.current.formattedTimeRemaining).toBe('4:00');

        // bytes large
        const { result: bLarge } = renderHook(() => useScanEstimate({ type: 'bytes', value: 60 * MB }, false));
        expect(bLarge.current.formattedTimeRemaining).toBe('10:00');
        expect(bLarge.current.rangeLabel).toBe('5–10 min');

        // count small
        const { result: cSmall } = renderHook(() => useScanEstimate({ type: 'count', value: 4 }, false));
        expect(cSmall.current.formattedTimeRemaining).toBe('1:00');

        // count mid
        const { result: cMid } = renderHook(() => useScanEstimate({ type: 'count', value: 10 }, false));
        expect(cMid.current.formattedTimeRemaining).toBe('4:00');

        // count large
        const { result: cLarge } = renderHook(() => useScanEstimate({ type: 'count', value: 25 }, false));
        expect(cLarge.current.formattedTimeRemaining).toBe('10:00');
    });

    it('countdown decrements once per elapsed second while in-progress', () => {
        const { result } = renderHook(() => useScanEstimate({ type: 'count', value: 4 }, true));
        
        expect(result.current.timeRemainingSeconds).toBe(60);
        
        act(() => {
            vi.advanceTimersByTime(1000);
        });
        
        expect(result.current.timeRemainingSeconds).toBe(59);
        expect(result.current.formattedTimeRemaining).toBe('0:59');

        act(() => {
            vi.advanceTimersByTime(2000); // 2 more seconds
        });
        
        expect(result.current.timeRemainingSeconds).toBe(57);
        expect(result.current.formattedTimeRemaining).toBe('0:57');
    });

    it('zero-crossing adds 60s and flags first extension exactly once, persisting through subsequent extensions', () => {
        const { result } = renderHook(() => useScanEstimate({ type: 'count', value: 4 }, true)); // starts at 60s
        
        act(() => {
            vi.advanceTimersByTime(60000); // advance 60 seconds
        });
        
        expect(result.current.timeRemainingSeconds).toBe(0);
        expect(result.current.formattedTimeRemaining).toBe('0:00');
        expect(result.current.isFirstExtension).toBe(false); // Hasn't crossed 0 yet
        
        act(() => {
            vi.advanceTimersByTime(1000); // Crosses 0
        });
        
        expect(result.current.timeRemainingSeconds).toBe(59); // 0 + 60 - 1
        expect(result.current.formattedTimeRemaining).toBe('0:59');
        expect(result.current.isFirstExtension).toBe(true);

        // Advance another 59 seconds to reach 0 again
        act(() => {
            vi.advanceTimersByTime(59000);
        });
        
        expect(result.current.timeRemainingSeconds).toBe(0);
        expect(result.current.isFirstExtension).toBe(true); // Still true

        // Cross 0 a second time
        act(() => {
            vi.advanceTimersByTime(1000);
        });
        
        expect(result.current.timeRemainingSeconds).toBe(59);
        expect(result.current.isFirstExtension).toBe(true); // Remains true for the rest of the scan instance
    });

    it('stop() halts ticking and is safe to call twice / after unmount', () => {
        const { result, unmount } = renderHook(() => useScanEstimate({ type: 'count', value: 4 }, true));
        
        act(() => {
            vi.advanceTimersByTime(1000);
        });
        expect(result.current.timeRemainingSeconds).toBe(59);
        
        act(() => {
            result.current.stop();
        });
        
        act(() => {
            vi.advanceTimersByTime(5000);
        });
        // Should not have decremented further
        expect(result.current.timeRemainingSeconds).toBe(59);
        
        act(() => {
            // safe to call twice
            result.current.stop();
        });

        unmount();
        
        // safe to call after unmount (no error thrown)
        act(() => {
            result.current.stop();
        });
    });

    it('auto-reset on new scan, driven by isInProgress transition', () => {
        let input: any = { type: 'count', value: 4 }; // small (1:00)
        let inProgress = false;
        
        const { result, rerender } = renderHook(() => useScanEstimate(input, inProgress));
        
        expect(result.current.timeRemainingSeconds).toBe(60);
        
        // Start scan
        inProgress = true;
        rerender();
        
        act(() => {
            vi.advanceTimersByTime(10000);
        });
        expect(result.current.timeRemainingSeconds).toBe(50);
        
        // Stop scan
        inProgress = false;
        rerender();
        
        // Timer should halt
        act(() => {
            vi.advanceTimersByTime(5000);
        });
        expect(result.current.timeRemainingSeconds).toBe(50);
        
        // Now start a NEW scan with different input (large: > 20)
        input = { type: 'count', value: 25 }; 
        inProgress = true;
        rerender();
        
        // Should auto-reset to the new bucket
        expect(result.current.timeRemainingSeconds).toBe(600); // 10:00
        expect(result.current.rangeLabel).toBe('5–10 min');
        expect(result.current.isFirstExtension).toBe(false);
    });

    it('reset() resets state back to starting values and halts ticking', () => {
        const { result } = renderHook(() => useScanEstimate({ type: 'count', value: 4 }, true)); // starts at 60s
        
        act(() => {
            vi.advanceTimersByTime(65000); // advance 65 seconds to cross zero
        });
        
        expect(result.current.timeRemainingSeconds).toBe(55); // 0 + 60 - 5 = 55
        expect(result.current.isFirstExtension).toBe(true);
        
        act(() => {
            result.current.reset();
        });
        
        expect(result.current.timeRemainingSeconds).toBe(60);
        expect(result.current.isFirstExtension).toBe(false);
        
        // Ensure interval is stopped
        act(() => {
            vi.advanceTimersByTime(5000);
        });
        expect(result.current.timeRemainingSeconds).toBe(60);
    });
});
