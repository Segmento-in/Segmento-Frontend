import { describe, it, expect, vi, beforeEach } from 'vitest';
import { account, client } from '../../lib/appwrite';

vi.mock('appwrite', () => {
  const Client = vi.fn();
  Client.prototype.setEndpoint = vi.fn().mockReturnThis();
  Client.prototype.setProject = vi.fn().mockReturnThis();

  return {
    Client,
    Account: vi.fn(),
  };
});

describe('Appwrite Client Initialization', () => {
  it('should export an initialized client and account service', () => {
    expect(client).toBeDefined();
    expect(account).toBeDefined();
  });
});
