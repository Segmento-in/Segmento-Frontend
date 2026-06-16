// API Client for Segmento Sense Backend
const NEXT_PUBLIC_API_URL = "http://localhost:7860";

export const API_BASE_URL = NEXT_PUBLIC_API_URL || 'https://shafisk17-sense-backend.hf.space';


export interface PIIMatch {
    label: string;
    text: string;
    start: number;
    end: number;
    source: string;
}

export interface PIICount {
    'PII Type': string;
    Count: number;
}

export interface SchemaInfo {
    Column: string;
    Type: string;
}

export interface InspectorResult {
    Model: string;
    'Detected PII': number;
    'Missed PII': number;
    Accuracy: number;
}

export interface AnalysisResponse {
    pii_counts: PIICount[];
    total_pii_found: number;
    schema?: SchemaInfo[];
    inspector?: InspectorResult[];
    data?: any[];
    total_pages?: number;
    current_page?: number;
    image?: string;
    original_image?: string;
    /** Row count actually fetched and scanned (capped at 100) — set by DB scan endpoints */
    rows_scanned?: number;
}

export interface DatabaseCredentials {
    host: string;
    port: string;
    database: string;
    user: string;
    password: string;
}

export interface Pattern {
    name: string;
    regex: string;
}

export interface ModelInfo {
    key: string;
    label: string;
    description: string;
}

// ==================== EVALUATOR TYPES ====================

export interface FileCatalogEntry {
    file_id: string;
    file_name: string;
    is_folder: boolean;
    mime_type: string;
    file_size_bytes: number;
    parent_folder_id?: string;
    full_path?: string;
    first_seen_at: string;
    classification?: 'unscanned' | 'NON-SENSITIVE' | 'SENSITIVE';
    scan_type?: 'external' | 'incremental' | 'FULL_LOAD';
    last_scanned_at?: string;
    /** DB-specific structural metadata (null/absent for Drive files) */
    metadata?: {
        column_count?: number;
        row_count_scanned?: number;
        pii_types?: Record<string, number>;
    } | null;
    /** connector_type is echoed back by /db/catalog for badge display */
    connector_type?: string;
}

export interface CatalogResponse {
    files: FileCatalogEntry[];
    last_session: any;
    sessions: any[];
}

export interface EvaluatorModel {
    key: string;
    label: string;
    hf_id: string;
    type: 'NER' | 'GLiNER' | 'Rule-based' | 'Statistical' | 'Rule+ML';
    params: string;
    f1_benchmark: number;
    lazy: boolean;
    description: string;
}

export interface GTSpan {
    type: string;
    canonical: string;
    start: number;
    end: number;
}

export interface EvaluatorParseResponse {
    text: string;
    gt_spans: GTSpan[];
    has_gt: boolean;
    format_detected: string;
    doc_count: number;
    char_count: number;
}

export interface EvaluatorPrediction {
    text: string;
    label: string;
    canonical: string;
    start: number;
    end: number;
    score: number;
    source: string;
    result?: 'TP' | 'FP' | 'FN';
}

export interface MetricRow {
    entity_type: string;
    tp: number;
    fp: number;
    fn: number;
    precision: number;
    recall: number;
    f1: number;
}

export interface ModelScanResult {
    predictions: EvaluatorPrediction[];
    comparison: {
        TP: EvaluatorPrediction[];
        FP: EvaluatorPrediction[];
        FN: EvaluatorPrediction[];
    };
    metrics: MetricRow[];
    coverage: { in_scope: string[]; out_of_scope: string[] };
    failures: {
        missed: Array<{ entity_type: string; value: string; context: string; reason: string }>;
        false_positives: Array<{ entity_type: string; value: string; confidence: number }>;
    };
    // Extra summary fields returned by _build_showdown_result (alongside the standard fields above)
    pii_count: number;
    accuracy: number;
    type_counts: Record<string, number>;
    unique_count: number;
    missed_count: number;
    consensus_count: number;
}

export interface EvaluatorScanResponse {
    per_model: Record<string, ModelScanResult>;
    has_gt: boolean;
    elapsed: number;
    union_total: number;
    ranked: Array<{ model_key: string; pii_count: number; accuracy: number; rank: number }>;
}

export interface BatchDocResult {
    doc_index: number;
    error?: string;
    [modelKey: string]: { f1: number; precision: number; recall: number; tp: number; fp: number; fn: number } | number | string | undefined;
}

export interface BatchEvalResponse {
    aggregate: Record<string, { f1: number; precision: number; recall: number; tp: number; fp: number; fn: number }>;
    per_doc: BatchDocResult[];
    n_docs_evaluated: number;
}

export interface VideoJobStatus {
    status: 'queued' | 'extracting' | 'scanning' | 'done' | 'error' | 'cancelled';
    progress: number;             // 0-100
    stage_detail: string;         // human-readable current stage
    result: {
        per_model: Record<string, ModelScanResult>;
        has_gt: boolean;
        elapsed: number;
        union_total: number;
        ranked: Array<{ model_key: string; pii_count: number; accuracy: number; rank: number }>;
        parsed_text: string;      // source-attributed extracted text
    } | null;
    error: string | null;
    created_at: number;
    model_keys: string[];
}

export interface PinnedResult {
    label: string;
    modelKey: string;
    f1: number;
    precision: number;
    recall: number;
    tp: number;
    fp: number;
    fn: number;
    timestamp: number;
}

class APIClient {
    private baseURL: string;

    constructor(baseURL: string = API_BASE_URL) {
        this.baseURL = baseURL;
    }

    private async handleResponse(response: Response) {
        if (!response.ok) {
            const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
            throw new Error(error.detail || `HTTP ${response.status}`);
        }
        return response.json();
    }

    // ==================== FILE UPLOADS ====================

    async uploadCSV(file: File, mask: boolean = false, selectedModels: string[] = []): Promise<AnalysisResponse> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('mask', mask.toString());
        formData.append('selected_models', selectedModels.join(','));

        const response = await fetch(`${this.baseURL}/api/upload/csv`, {
            method: 'POST',
            body: formData,
        });

        return this.handleResponse(response);
    }

    async uploadJSON(file: File, mask: boolean = false, selectedModels: string[] = []): Promise<AnalysisResponse> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('mask', mask.toString());
        formData.append('selected_models', selectedModels.join(','));

        const response = await fetch(`${this.baseURL}/api/upload/json`, {
            method: 'POST',
            body: formData,
        });

        return this.handleResponse(response);
    }

    async uploadParquet(file: File, mask: boolean = false, selectedModels: string[] = []): Promise<AnalysisResponse> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('mask', mask.toString());
        formData.append('selected_models', selectedModels.join(','));

        const response = await fetch(`${this.baseURL}/api/upload/parquet`, {
            method: 'POST',
            body: formData,
        });

        return this.handleResponse(response);
    }

    async uploadAvro(file: File, mask: boolean = false, selectedModels: string[] = []): Promise<AnalysisResponse> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('mask', mask.toString());
        formData.append('selected_models', selectedModels.join(','));

        const response = await fetch(`${this.baseURL}/api/upload/avro`, {
            method: 'POST',
            body: formData,
        });

        return this.handleResponse(response);
    }

    async uploadPDF(file: File, pageNumber: number = 0, selectedModels: string[] = []): Promise<AnalysisResponse> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('page_number', pageNumber.toString());
        formData.append('selected_models', selectedModels.join(','));

        const response = await fetch(`${this.baseURL}/api/upload/pdf`, {
            method: 'POST',
            body: formData,
        });

        return this.handleResponse(response);
    }

    async uploadImage(file: File, mask: boolean = false): Promise<AnalysisResponse> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('mask', mask.toString());

        const response = await fetch(`${this.baseURL}/api/upload/image`, {
            method: 'POST',
            body: formData,
        });

        return this.handleResponse(response);
    }

    // ==================== MODEL CATALOGUE ====================

    async getModels(): Promise<{ always_on: ModelInfo[]; lazy_loaded: ModelInfo[] }> {
        const response = await fetch(`${this.baseURL}/api/models`);
        return this.handleResponse(response);
    }

    // ==================== ANALYSIS ====================

    async analyzeText(text: string) {
        const response = await fetch(`${this.baseURL}/api/analyze/text`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text }),
        });

        return this.handleResponse(response);
    }

    async inspectText(text: string) {
        const response = await fetch(`${this.baseURL}/api/inspect`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text }),
        });

        return this.handleResponse(response);
    }

    async maskText(text: string) {
        const response = await fetch(`${this.baseURL}/api/mask`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text }),
        });

        return this.handleResponse(response);
    }

    // ==================== PATTERNS ====================

    async getPatterns(): Promise<{ patterns: Pattern[] }> {
        const response = await fetch(`${this.baseURL}/api/patterns`);
        return this.handleResponse(response);
    }

    async addPattern(name: string, regex: string) {
        const response = await fetch(`${this.baseURL}/api/patterns`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, regex }),
        });

        return this.handleResponse(response);
    }

    async deletePattern(name: string) {
        const response = await fetch(`${this.baseURL}/api/patterns/${encodeURIComponent(name)}`, {
            method: 'DELETE',
        });

        return this.handleResponse(response);
    }

    // ==================== DATABASES ====================

    async connectPostgreSQL(params: {
        host: string;
        port: string;
        database: string;
        user: string;
        password: string;
        table: string;
    }): Promise<AnalysisResponse> {
        const response = await fetch(`${this.baseURL}/api/connect/postgresql`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(params),
        });

        return this.handleResponse(response);
    }

    async connectMySQL(params: {
        host: string;
        port: string;
        database: string;
        user: string;
        password: string;
        table: string;
    }): Promise<AnalysisResponse> {
        const response = await fetch(`${this.baseURL}/api/connect/mysql`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(params),
        });

        return this.handleResponse(response);
    }

    async connectMongoDB(params: {
        host: string;
        port: string;
        database: string;
        user: string;
        password: string;
        table: string;
    }): Promise<AnalysisResponse> {
        const response = await fetch(`${this.baseURL}/api/connect/mongodb`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(params),
        });

        return this.handleResponse(response);
    }

    async listPostgresTables(credentials: DatabaseCredentials): Promise<{ tables: string[] }> {
        const response = await fetch(`${this.baseURL}/api/connect/postgresql/list-tables`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
        });
        return this.handleResponse(response);
    }

    async listMysqlTables(credentials: DatabaseCredentials): Promise<{ tables: string[] }> {
        const response = await fetch(`${this.baseURL}/api/connect/mysql/list-tables`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
        });
        return this.handleResponse(response);
    }

    async scanPostgresqlTable(credentials: DatabaseCredentials & { table: string }): Promise<AnalysisResponse> {
        const response = await fetch(`${this.baseURL}/api/connect/postgresql`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
        });
        return this.handleResponse(response);
    }

    async scanMysqlTable(credentials: DatabaseCredentials & { table: string }): Promise<AnalysisResponse> {
        const response = await fetch(`${this.baseURL}/api/connect/mysql`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
        });
        return this.handleResponse(response);
    }

    // ==================== CLOUD STORAGE - S3 ====================

    async listS3Buckets(access_key: string, secret_key: string, region: string) {
        const response = await fetch(`${this.baseURL}/api/cloud/s3/list-buckets`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ access_key, secret_key, region }),
        });

        return this.handleResponse(response);
    }

    async listS3Files(access_key: string, secret_key: string, region: string, bucket: string) {
        const response = await fetch(`${this.baseURL}/api/cloud/s3/list-files`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ access_key, secret_key, region, bucket }),
        });

        return this.handleResponse(response);
    }

    async scanS3File(access_key: string, secret_key: string, region: string, bucket: string, file_key: string): Promise<AnalysisResponse> {
        const response = await fetch(`${this.baseURL}/api/cloud/s3/scan`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ access_key, secret_key, region, bucket, file_key }),
        });

        return this.handleResponse(response);
    }

    // ==================== CLOUD STORAGE - AZURE ====================

    async listAzureContainers(connection_string: string) {
        const response = await fetch(`${this.baseURL}/api/cloud/azure/list-containers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ connection_string }),
        });

        return this.handleResponse(response);
    }

    async listAzureBlobs(connection_string: string, container: string) {
        const response = await fetch(`${this.baseURL}/api/cloud/azure/list-blobs`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ connection_string, container }),
        });

        return this.handleResponse(response);
    }

    async scanAzureBlob(connection_string: string, container: string, blob: string): Promise<AnalysisResponse> {
        const response = await fetch(`${this.baseURL}/api/cloud/azure/scan`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ connection_string, container, blob }),
        });

        return this.handleResponse(response);
    }

    // ==================== CLOUD STORAGE - GCS ====================

    async listGCSBuckets(credentials: any) {
        const response = await fetch(`${this.baseURL}/api/cloud/gcs/list-buckets`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ credentials }),
        });

        return this.handleResponse(response);
    }

    async listGCSFiles(credentials: any, bucket: string) {
        const response = await fetch(`${this.baseURL}/api/cloud/gcs/list-files`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ credentials, bucket }),
        });

        return this.handleResponse(response);
    }

    async scanGCSFile(credentials: any, bucket: string, file_name: string): Promise<AnalysisResponse> {
        const response = await fetch(`${this.baseURL}/api/cloud/gcs/scan`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ credentials, bucket, file_name }),
        });

        return this.handleResponse(response);
    }

    // ==================== CLOUD STORAGE - GOOGLE DRIVE ====================

    async listDriveFiles(credentials: any) {
        const response = await fetch(`${this.baseURL}/api/cloud/drive/list-files`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ credentials }),
        });

        return this.handleResponse(response);
    }

    async scanDriveFile(credentials: any, file_id: string, mime_type: string): Promise<AnalysisResponse> {
        const response = await fetch(`${this.baseURL}/api/cloud/drive/scan`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ credentials, file_id, mime_type }),
        });

        return this.handleResponse(response);
    }

    // ==================== ENTERPRISE CONNECTORS ====================

    async scanGmail(file: File, num_emails: number = 10): Promise<AnalysisResponse> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('num_emails', num_emails.toString());

        const response = await fetch(`${this.baseURL}/api/enterprise/gmail`, {
            method: 'POST',
            body: formData,
        });

        return this.handleResponse(response);
    }

    async scanSlack(token: string, channel_id: string): Promise<AnalysisResponse> {
        const response = await fetch(`${this.baseURL}/api/enterprise/slack`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, channel_id }),
        });

        return this.handleResponse(response);
    }

    async scanConfluence(url: string, username: string, token: string, page_id: string): Promise<AnalysisResponse> {
        const response = await fetch(`${this.baseURL}/api/enterprise/confluence`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url, username, token, page_id }),
        });

        return this.handleResponse(response);
    }

    // ==================== HEALTH CHECK ====================

    async healthCheck() {
        const response = await fetch(`${this.baseURL}/health`);
        return this.handleResponse(response);
    }

    // ==================== EVALUATOR ====================

    async evaluatorGetModels(): Promise<{ models: EvaluatorModel[] }> {
        const response = await fetch(`${this.baseURL}/api/evaluator/models`);
        return this.handleResponse(response);
    }

    async evaluatorParse(
        file: File,
        fileType: string = 'auto',
        docIndex: number = 0,
        schema?: Record<string, string>,
        category: string = 'unstructured',
    ): Promise<EvaluatorParseResponse> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('format', fileType);      // legacy compat
        formData.append('file_type', fileType);   // new param
        formData.append('category', category);
        formData.append('doc_index', docIndex.toString());
        if (schema) formData.append('schema', JSON.stringify(schema));
        const response = await fetch(`${this.baseURL}/api/evaluator/parse`, {
            method: 'POST',
            body: formData,
        });
        return this.handleResponse(response);
    }

    async evaluatorScan(
        text: string,
        gt_spans: GTSpan[] = [],
        model_keys: string[] = ['deberta'],
        conf_threshold: number = 0.5,
        entropy_threshold: number = 4.5,
    ): Promise<EvaluatorScanResponse> {
        const response = await fetch(`${this.baseURL}/api/evaluator/scan`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, gt_spans, model_keys, conf_threshold, entropy_threshold }),
        });
        return this.handleResponse(response);
    }

    async evaluatorBatch(
        file: File,
        format: string = 'nemotron',
        nDocs: number = 50,
        modelKeys: string[] = ['deberta'],
        confThreshold: number = 0.5,
        entropyThreshold: number = 4.5,
    ): Promise<BatchEvalResponse> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('format', format);
        formData.append('n_docs', nDocs.toString());
        formData.append('model_keys', modelKeys.join(','));
        formData.append('conf_threshold', confThreshold.toString());
        formData.append('entropy_threshold', entropyThreshold.toString());
        const response = await fetch(`${this.baseURL}/api/evaluator/batch`, {
            method: 'POST',
            body: formData,
        });
        return this.handleResponse(response);
    }

    // ── Video PII (async job queue) ──────────────────────────────────────────

    async videoUpload(
        file: File,
        modelKeys: string[],
    ): Promise<{ job_id: string; status: string; file_size_mb: number; model_keys: string[] }> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('model_keys', modelKeys.join(','));
        const response = await fetch(`${this.baseURL}/api/video/upload`, {
            method: 'POST',
            body: formData,
        });
        return this.handleResponse(response);
    }

    async videoStatus(jobId: string): Promise<VideoJobStatus> {
        const response = await fetch(`${this.baseURL}/api/video/status/${jobId}`);
        return this.handleResponse(response);
    }

    async videoCancel(jobId: string): Promise<void> {
        await fetch(`${this.baseURL}/api/video/cancel/${jobId}`, { method: 'DELETE' });
    }

    // ==================== DRIVE SCAN (Model Lab) ====================

    async getFileCatalog(connectorType: string, uid: string = "default_uid"): Promise<CatalogResponse> {
        const response = await fetch(`${this.baseURL}/api/connector/file-catalog?connector_type=${connectorType}&uid=${uid}`);
        return this.handleResponse(response);
    }

    async getDbCatalog(uid: string = "default_uid", connectorType?: string): Promise<CatalogResponse> {
        const params = new URLSearchParams({ uid });
        if (connectorType) params.set('connector_type', connectorType);
        const response = await fetch(`${this.baseURL}/db/catalog?${params.toString()}`);
        return this.handleResponse(response);
    }

    async driveFolderBrowse(
        authType: string,
        credentials: Record<string, unknown>,
        folderId: string,
    ): Promise<{ items: import('./apiClient').DriveItem[]; folder_id: string }> {
        const response = await fetch(`${this.baseURL}/api/evaluator/drive/browse`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ auth_type: authType, credentials, folder_id: folderId }),
        });
        return this.handleResponse(response);
    }

    async driveFolderScan(
        authType: string,
        credentials: Record<string, unknown>,
        fileRefs: { id: string; name: string; mimeType: string }[],
        modelKeys: string[],
    ): Promise<import('./apiClient').DriveFolderScanResponse> {
        const response = await fetch(`${this.baseURL}/api/evaluator/drive/scan`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                auth_type: authType,
                credentials,
                file_refs: fileRefs,
                model_keys: modelKeys,
            }),
        });
        return this.handleResponse(response);
    }

    async driveContentChunks(authType: string, credentials: Record<string, unknown>, fileRef: { id: string, name: string, mimeType: string }, chunkSize: number = 3000): Promise<{ chunks: Array<{text: string, start_idx: number, end_idx: number}> }> {
        const response = await fetch(`${this.baseURL}/api/evaluator/drive/content-chunks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                auth_type: authType,
                credentials,
                file_ref: fileRef,
                chunk_size: chunkSize
            })
        });
        return this.handleResponse(response);
    }

    async driveTagFiles(
        authType: string,
        credentials: Record<string, unknown>,
        filesToTag: { file_id: string; pii_detected: boolean; pii_count: number }[],
        humanReadable: boolean = false,
    ): Promise<{ tagged: import('./apiClient').DriveTagResult[]; scan_ts: string }> {
        const response = await fetch(`${this.baseURL}/api/evaluator/drive/tag`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ auth_type: authType, credentials, files_to_tag: filesToTag, human_readable: humanReadable }),
        });
        return this.handleResponse(response);
    }

}

export const apiClient = new APIClient();

// ==================== DRIVE SCAN TYPES (Model Lab) ====================

export interface DriveItem {
    id: string;
    name: string;
    mimeType: string;
    isFolder: boolean;
    ext: string;
    /** High-level media category: 'document' | 'image' | 'video' | 'audio' | 'folder' | 'other' */
    mediaType: 'document' | 'image' | 'video' | 'audio' | 'folder' | 'other';
    parseable: boolean;
    tooBig: boolean;
    sizeBytes: number;
    path: string;
    parentId: string;
    appProperties?: any;
    webViewLink?: string;
}

export interface DriveFileScanResult {
    file_id: string;
    file_name: string;
    mime_type: string;
    pii_detected: boolean;
    pii_count: number;
    char_count: number;
    scan_data: EvaluatorScanResponse | null;
    error: string | null;
}

export interface DriveFolderScanResponse {
    results: DriveFileScanResult[];
    total_files: number;
    total_pii_files: number;
    elapsed: number;
}

export interface DriveTagResult {
    file_id: string;
    success: boolean;
    error: string | null;
}

// ==================== SHARED CONNECTOR ROW CONTRACT ====================
// Used by ConnectorPreviewUI to render rows from any connector in a unified
// table layout. Drive and DB connectors each have a thin adapter that maps
// their native scan result shapes into this contract.

export interface ConnectorResultDetail {
    breakdown: Array<{ label: string; count: number }>;
}

export interface ConnectorResultRow {
    /** Stable unique key for React reconciliation */
    id: string;
    /** Display name: file/folder name for Drive, `schema.table` for DB */
    name: string;
    /** Visual type label: 'PDF', 'MD', 'Folder', 'Table', etc. */
    itemType: string;
    classification: 'SENSITIVE' | 'NON-SENSITIVE' | 'UNSCANNED' | 'Unsupported' | 'FOLDER';
    /** Pre-formatted size string, e.g. '1.2 MB' or '45 rows scanned'. null → renders as '—' */
    sizeLabel: string | null;
    /** ISO timestamp strings or null → renders as '—' */
    firstSeen: string | null;
    lastScanned: string | null;
    scanType: string | null;
    isFolder?: boolean;
    /** True while this row's scan is in-flight — renders a spinner in the classification cell */
    isScanning?: boolean;
    /** Optional expandable breakdown (e.g. PII type chips). Absent for Drive rows. */
    detail?: ConnectorResultDetail;
}
