// API Client for Segmento Sense Backend
// Base URL for HuggingFace Spaces deployment
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://workwithshafisk-segmento-sense-backend.hf.space';

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
}

export interface Pattern {
    name: string;
    regex: string;
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

    async uploadCSV(file: File, mask: boolean = false): Promise<AnalysisResponse> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('mask', mask.toString());

        const response = await fetch(`${this.baseURL}/api/upload/csv`, {
            method: 'POST',
            body: formData,
        });

        return this.handleResponse(response);
    }

    async uploadJSON(file: File, mask: boolean = false): Promise<AnalysisResponse> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('mask', mask.toString());

        const response = await fetch(`${this.baseURL}/api/upload/json`, {
            method: 'POST',
            body: formData,
        });

        return this.handleResponse(response);
    }

    async uploadParquet(file: File, mask: boolean = false): Promise<AnalysisResponse> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('mask', mask.toString());

        const response = await fetch(`${this.baseURL}/api/upload/parquet`, {
            method: 'POST',
            body: formData,
        });

        return this.handleResponse(response);
    }

    async uploadAvro(file: File, mask: boolean = false): Promise<AnalysisResponse> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('mask', mask.toString());

        const response = await fetch(`${this.baseURL}/api/upload/avro`, {
            method: 'POST',
            body: formData,
        });

        return this.handleResponse(response);
    }

    async uploadPDF(file: File, pageNumber: number = 0): Promise<AnalysisResponse> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('page_number', pageNumber.toString());

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
}

export const apiClient = new APIClient();
