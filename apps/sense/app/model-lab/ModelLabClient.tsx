'use client';

import React, { useState, useCallback } from 'react';
import ModelLabHero from '@/components/model-lab/ModelLabHero';
import ModelLabTabs from '@/components/model-lab/ModelLabTabs';
import {
    EvaluatorModel,
    EvaluatorParseResponse,
    EvaluatorScanResponse,
    BatchEvalResponse,
    PinnedResult,
    MetricRow,
} from '@/lib/apiClient';

export interface ModelLabState {
    // File + parse state
    uploadedFile: File | null;
    parseResult: EvaluatorParseResponse | null;
    formatHint: string;
    docIndex: number;
    schema: Record<string, string> | undefined;

    // Scan state
    selectedModels: string[];
    scanResult: EvaluatorScanResponse | null;
    activeModelKey: string;           // which model's results are shown in single-model tabs
    confThreshold: number;
    entropyThreshold: number;

    // Batch state
    scanMode: 'single' | 'batch';
    nDocs: number;
    batchResult: BatchEvalResponse | null;

    // Compare / pin state
    pinnedResults: PinnedResult[];
    pinLabel: string;

    // UI state
    activeTab: number;
    isLoading: boolean;
    loadingStage: string;
    error: string | null;

    // Model catalogue (fetched from backend)
    modelCatalogue: EvaluatorModel[];
}

const DEFAULT_STATE: ModelLabState = {
    uploadedFile: null,
    parseResult: null,
    formatHint: 'auto',
    docIndex: 0,
    schema: undefined,

    selectedModels: ['deberta'],
    scanResult: null,
    activeModelKey: 'deberta',
    confThreshold: 0.5,
    entropyThreshold: 4.5,

    scanMode: 'single',
    nDocs: 50,
    batchResult: null,

    pinnedResults: [],
    pinLabel: '',

    activeTab: 0,
    isLoading: false,
    loadingStage: '',
    error: null,

    modelCatalogue: [],
};

export default function ModelLabClient() {
    const [state, setState] = useState<ModelLabState>(DEFAULT_STATE);

    const update = useCallback((patch: Partial<ModelLabState>) => {
        setState(prev => ({ ...prev, ...patch }));
    }, []);

    /** Pin the OVERALL metric row from the current scan result for a given model */
    const pinResult = useCallback((modelKey: string, label: string) => {
        if (!state.scanResult) return;
        const modelData = state.scanResult.per_model[modelKey];
        if (!modelData) return;
        const overall = modelData.metrics.find((r: MetricRow) => r.entity_type === 'OVERALL');
        if (!overall) return;
        const pin: PinnedResult = {
            label: label || `${modelKey} — run`,
            modelKey,
            f1: overall.f1,
            precision: overall.precision,
            recall: overall.recall,
            tp: overall.tp,
            fp: overall.fp,
            fn: overall.fn,
            timestamp: Date.now(),
        };
        update({ pinnedResults: [...state.pinnedResults, pin] });
    }, [state.scanResult, state.pinnedResults, update]);

    const removePin = useCallback((idx: number) => {
        update({ pinnedResults: state.pinnedResults.filter((_, i) => i !== idx) });
    }, [state.pinnedResults, update]);

    const clearPins = useCallback(() => update({ pinnedResults: [] }), [update]);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <ModelLabHero />
            <ModelLabTabs
                state={state}
                update={update}
                pinResult={pinResult}
                removePin={removePin}
                clearPins={clearPins}
            />
        </div>
    );
}
