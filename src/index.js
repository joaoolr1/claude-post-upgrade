import { startServer } from '@microsoft/agents-hosting-express';
import { app } from './agent.js';

console.log('🚀 Starting Claude Backend Architect Agent');
console.log('   http://localhost:3978');
console.log('');

/**
 * Start the M365 agent server
 * 
 * Note: Authentication is disabled for testing. In production, you should enable
 * authentication by providing proper credentials:
 * 
 * const authConfig = {
 *   MicrosoftAppId: process.env.MICROSOFT_APP_ID,
 *   MicrosoftAppPassword: process.env.MICROSOFT_APP_PASSWORD,
 *   MicrosoftAppType: 'MultiTenant'
 * };
 * startServer(app, authConfig);
 */
try {
  // Pass empty auth config to disable authentication for testing
  startServer(app, {});
  console.log('✅ Agent server is running and ready to accept connections');
  console.log('⚠️  Authentication is disabled - for testing only');
} catch (err) {
  console.error('Failed to start server:', err);
  process.exit(1);
}
