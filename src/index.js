import { startServer } from '@microsoft/agents-hosting-express';
import { app } from './agent.js';

console.log('🚀 Starting Claude Backend Architect Agent');
console.log('   http://localhost:3978');
console.log('');

/**
 * Start the M365 agent server
 */
try {
  startServer(app);
  console.log('✅ Agent server is running and ready to accept connections');
} catch (err) {
  console.error('Failed to start server:', err);
  process.exit(1);
}
