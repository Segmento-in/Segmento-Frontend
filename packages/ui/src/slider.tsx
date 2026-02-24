'use client';

import * as React from "react";

export interface SliderProps {
    value: number[];
    onValueChange: (value: number[]) => void;
    min: number;
    max: number;
    step: number;
    className?: string;
}

export function Slider({ value, onValueChange, min, max, step, className = "" }: SliderProps) {
    const [localValue, setLocalValue] = React.useState(value[0] || min);

    React.useEffect(() => {
        setLocalValue(value[0] || min);
    }, [value, min]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = parseFloat(e.target.value);
        setLocalValue(newValue);
        onValueChange([newValue]);
    };

    const percentage = ((localValue - min) / (max - min)) * 100;

    return (
        <div className={`relative w-full ${className}`}>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={localValue}
                onChange={handleChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                style={{
                    background: `linear-gradient(to right, rgb(59, 130, 246) 0%, rgb(59, 130, 246) ${percentage}%, rgb(229, 231, 235) ${percentage}%, rgb(229, 231, 235) 100%)`
                }}
            />
        </div>
    );
}
