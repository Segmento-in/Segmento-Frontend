import { useState, useEffect, useRef, useCallback } from 'react';

export type EstimateInput = 
  | { type: 'bytes'; value: number }
  | { type: 'count'; value: number };

export interface UseScanEstimateReturn {
  formattedTimeRemaining: string;
  timeRemainingSeconds: number;
  rangeLabel: string;
  isFirstExtension: boolean;
  stop: () => void;
  reset: () => void;
}

function getBucketInfo(input: EstimateInput) {
    let bucket: 'small' | 'mid' | 'large' = 'small';
    if (input.type === 'bytes') {
        const MB = 1024 * 1024;
        if (input.value > 50 * MB) bucket = 'large';
        else if (input.value >= 5 * MB) bucket = 'mid';
        else bucket = 'small';
    } else {
        if (input.value > 20) bucket = 'large';
        else if (input.value >= 5) bucket = 'mid';
        else bucket = 'small';
    }

    switch (bucket) {
        case 'small': return { timeRemainingSeconds: 60, rangeLabel: '30 sec–1 min' };
        case 'mid': return { timeRemainingSeconds: 240, rangeLabel: '2–4 min' };
        case 'large': return { timeRemainingSeconds: 600, rangeLabel: '5–10 min' };
    }
}

function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
}

export function useScanEstimate(input: EstimateInput, isInProgress: boolean): UseScanEstimateReturn {
    const [timeRemainingSeconds, setTimeRemainingSeconds] = useState(() => getBucketInfo(input).timeRemainingSeconds);
    const [rangeLabel, setRangeLabel] = useState(() => getBucketInfo(input).rangeLabel);
    const [isFirstExtension, setIsFirstExtension] = useState(false);
    
    const prevIsInProgress = useRef(isInProgress);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const stop = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    const reset = useCallback(() => {
        stop();
        const info = getBucketInfo(input);
        setTimeRemainingSeconds(info.timeRemainingSeconds);
        setRangeLabel(info.rangeLabel);
        setIsFirstExtension(false);
    }, [input, stop]);
    
    useEffect(() => {
        if (isInProgress && !prevIsInProgress.current) {
            const info = getBucketInfo(input);
            setTimeRemainingSeconds(info.timeRemainingSeconds);
            setRangeLabel(info.rangeLabel);
            setIsFirstExtension(false);
        }
        prevIsInProgress.current = isInProgress;
    }, [isInProgress, input]);

    useEffect(() => {
        if (isInProgress) {
            intervalRef.current = setInterval(() => {
                setTimeRemainingSeconds(prev => {
                    if (prev <= 0) {
                        setIsFirstExtension(true);
                        return 59;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            stop();
        }
        
        return () => stop();
    }, [isInProgress, stop]);

    return {
        formattedTimeRemaining: formatTime(timeRemainingSeconds),
        timeRemainingSeconds,
        rangeLabel,
        isFirstExtension,
        stop,
        reset
    };
}
