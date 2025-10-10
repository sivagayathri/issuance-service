import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import router from './issuanceRoutes.js';
import * as issuanceService from '../services/issuanceService.js';

const app = express();
app.use(express.json());
app.use(router);

beforeEach(() => {
  vi.clearAllMocks();
});

describe('POST /issue', () => {
  it('should return 500 if name/email/credentialid is missing or service fails', async () => {
    vi.spyOn(issuanceService, 'issueCredential').mockRejectedValue(new Error('Service error'));

    const res = await request(app).post('/issue').send({ name: 'John' }); 
    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: 'Service error' });
  });

  it('should return result if issuance succeeds', async () => {
    vi.spyOn(issuanceService, 'issueCredential').mockResolvedValue({
      message: 'Credential issued',
      streamId: 'abc123'
    });

    const res = await request(app).post('/issue').send({
      name: 'John Doe',
      email: 'john@example.com',
      credentialid: 'abc123'
    });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      message: 'Credential issued',
      streamId: 'abc123'
    });
  });

  it('should handle worker result correctly', async () => {
    vi.spyOn(issuanceService, 'issueCredential').mockResolvedValue({
      message: 'Worker updated',
      worker: 'John Doe'
    });

    const res = await request(app).post('/issue').send({
      name: 'John Doe',
      email: 'john@example.com',
      credentialid: 'worker-id'
    });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      message: 'Worker updated',
      worker: 'John Doe'
    });
  });
});
