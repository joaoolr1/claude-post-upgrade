import { startServer } from '@microsoft/agents-hosting-express';
import { app } from './agent.js';

// Use Azure's PORT environment variable or default to 3978 for local development
const port = process.env.PORT || 3978;

console.log('🚀 Starting Claude Backend Architect Agent');
console.log(`   Port: ${port}`);
console.log('');

/**
 * Start the M365 agent server
 */
try {
  await startServer(app, port);
  console.log('✅ Agent server is running and ready to accept connections');
  console.log(`   Listening on port ${port}`);
} catch (err) {
  console.error('Failed to start server:', err);
  process.exit(1);
}
