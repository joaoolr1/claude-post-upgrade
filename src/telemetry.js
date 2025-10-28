import { Builder } from '@microsoft/agents-a365-observability';

export const kairo = Builder.configure((builder) =>
  builder
    .withServiceName('claude-backend-architect')
    .withServiceVersion('1.0.0')
    .withConsoleExporter(true) // Enable console logging for debugging
    .withConnectionString(process.env.AZURE_MONITOR_CONNECTION_STRING || '')
);