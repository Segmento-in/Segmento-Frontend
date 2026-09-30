import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { APIClient } from './apiClient';

describe('APIClient Upload Methods', () => {
    let client: APIClient;

    beforeEach(() => {
        client = new APIClient();
        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => ({})
        });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    const file = new File(['dummy content'], 'test.csv', { type: 'text/csv' });
    const mockToken = 'tok-123';

    const testCases = [
        { name: 'uploadCSV', call: (c: APIClient, token?: string) => (c as any).uploadCSV(file, false, [], 'full', token) },
        { name: 'uploadTXT', call: (c: APIClient, token?: string) => (c as any).uploadTXT(file, false, [], 'full', token) },
        { name: 'uploadJSON', call: (c: APIClient, token?: string) => (c as any).uploadJSON(file, false, [], 'full', token) },
        { name: 'uploadParquet', call: (c: APIClient, token?: string) => (c as any).uploadParquet(file, false, [], 'full', token) },
        { name: 'uploadAvro', call: (c: APIClient, token?: string) => (c as any).uploadAvro(file, false, [], 'full', token) },
        { name: 'uploadPDF', call: (c: APIClient, token?: string) => (c as any).uploadPDF(file, 0, [], 'full', token) },
        { name: 'uploadImage', call: (c: APIClient, token?: string) => (c as any).uploadImage(file, false, 'full', token) }
    ];

    testCases.forEach(({ name, call }) => {
        describe(name, () => {
            it('(a) should send Authorization header when token is provided', async () => {
                await call(client, mockToken);
                const fetchArgs = vi.mocked(global.fetch).mock.calls[0];
                const options = fetchArgs[1];
                expect(options?.headers).toBeDefined();
                expect((options?.headers as any)?.Authorization).toBe(`Bearer ${mockToken}`);
            });

            it('(b) should NOT send Authorization header when token is omitted', async () => {
                await call(client);
                const fetchArgs = vi.mocked(global.fetch).mock.calls[0];
                const options = fetchArgs[1];
                if (options?.headers) {
                    expect((options?.headers as any)?.Authorization).toBeUndefined();
                } else {
                    expect(options?.headers).toBeUndefined();
                }
            });

            it('(c) should NOT set Content-Type header (browser must set multipart boundary)', async () => {
                await call(client);
                const fetchArgs = vi.mocked(global.fetch).mock.calls[0];
                const options = fetchArgs[1];
                if (options?.headers) {
                    expect((options?.headers as any)['Content-Type']).toBeUndefined();
                }
            });
        });
    });
});
