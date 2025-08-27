import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import axios from 'axios';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const BACKEND_URL = 'http://localhost:4000';
const FRONTEND_URL = 'http://localhost:5173';
const BACKEND_DIR = 'projects/start/packages/fake-backend';
const FRONTEND_DIR = 'projects/start/packages/transaction-test-demo';

describe('End-to-End System Test', () => {
  let backendProcess: any;
  let frontendProcess: any;

  beforeAll(async () => {
    // Start Backend
    console.log('Starting backend...');
    backendProcess = execAsync(`cd ${BACKEND_DIR} && pnpm start &`);
    await new Promise(resolve => setTimeout(resolve, 5000)); // Give backend time to start

    // Start Frontend
    console.log('Starting frontend...');
    frontendProcess = execAsync(`cd ${FRONTEND_DIR} && pnpm dev &`);
    await new Promise(resolve => setTimeout(resolve, 5000)); // Give frontend time to start

    console.log('System started.');
  }, 30000); // 30 seconds timeout for setup

  afterAll(async () => {
    // Stop Backend
    console.log('Stopping backend...');
    if (backendProcess && backendProcess.pid) {
      process.kill(-backendProcess.pid); // Kill process group
    }
    // Stop Frontend
    console.log('Stopping frontend...');
    if (frontendProcess && frontendProcess.pid) {
      process.kill(-frontendProcess.pid); // Kill process group
    }
    console.log('System stopped.');
  });

  it('should start the test orchestration and get status', async () => {
    // 1. Start Test
    console.log('Sending POST /test/start...');
    const startResponse = await axios.post(`${BACKEND_URL}/test/start`);
    expect(startResponse.status).toBe(200);
    expect(startResponse.data.message).toBe('Test orchestration started.');

    // 2. Get Status
    console.log('Sending GET /test/status...');
    await new Promise(resolve => setTimeout(resolve, 3000)); // Give some time for transactions to send
    const statusResponse = await axios.get(`${BACKEND_URL}/test/status`);
    expect(statusResponse.status).toBe(200);
    expect(statusResponse.data.isRunning).toBe(true);
    expect(statusResponse.data.transactionsSent).toBeGreaterThan(0); // Should have sent some transactions

    // 3. Stop Test
    console.log('Sending POST /test/stop...');
    const stopResponse = await axios.post(`${BACKEND_URL}/test/stop`);
    expect(stopResponse.status).toBe(200);
    expect(stopResponse.data.message).toBe('Test orchestration stopped.');

    // 4. Get Results (JSON)
    console.log('Sending GET /test/results (JSON)...');
    const jsonResultsResponse = await axios.get(`${BACKEND_URL}/test/results`);
    expect(jsonResultsResponse.status).toBe(200);
    expect(Array.isArray(jsonResultsResponse.data)).toBe(true);
    expect(jsonResultsResponse.data.length).toBeGreaterThan(0);

    // 5. Get Results (CSV)
    console.log('Sending GET /test/results?format=csv (CSV)...');
    const csvResultsResponse = await axios.get(`${BACKEND_URL}/test/results?format=csv`);
    expect(csvResultsResponse.status).toBe(200);
    expect(typeof csvResultsResponse.data).toBe('string');
    expect(csvResultsResponse.data).toContain('Transaction_ID,Network,Type'); // Check CSV header
  }, 60000); // 60 seconds timeout for the test itself
});
