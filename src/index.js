import { startServer } from '@microsoft/agents-hosting-express';
import { ObservabilityManager } from '@microsoft/agents-a365-observability';
import { app } from './agent.js';

console.log('🚀 Starting Claude Backend Architect Agent');
console.log('   Activity Protocol Mode with Observability');
console.log('');

/**
 * Start the M365 agent server
 */
try {
  startServer(app);
  console.log('✅ Agent server is running and ready to accept connections');
  console.log('🔭 Observability SDK is active and tracking agent interactions');
  console.log('   Use M365 Agents Playground to test: npm run test-tool');
  console.log('');
} catch (err) {
  console.error('Failed to start server:', err);
  process.exit(1);
}

/**
 * Graceful shutdown handling for observability
 */
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down agent...');
  try {
    await ObservabilityManager.shutdown();
    console.log('🔭 Observability SDK shut down gracefully');
    process.exit(0);
  } catch (err) {
    console.error('Error during shutdown:', err);
    process.exit(1);
  }
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down agent...');
  try {
    await ObservabilityManager.shutdown();
    console.log('🔭 Observability SDK shut down gracefully');
    process.exit(0);
  } catch (err) {
    console.error('Error during shutdown:', err);
    process.exit(1);
  }
});
