import { startServer } from '@microsoft/agents-hosting-express';
import { app } from './agent.js';

// Ensure PORT environment variable is available for Azure
const port = process.env.PORT || 3978;
process.env.PORT = port;

console.log('🚀 Starting Claude Backend Architect Agent');
console.log(`   Port: ${port}`);
console.log('');

/**
 * Start the M365 agent server
 */
try {
  startServer(app);
  console.log('✅ Agent server is running and ready to accept connections');
  console.log(`   Expected to be listening on port ${port}`);
} catch (err) {
  console.error('Failed to start server:', err);
  process.exit(1);
}
