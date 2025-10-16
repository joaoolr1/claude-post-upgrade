# Claude Backend Architect Agent - Agent365 SDK

This is the upgraded version of the Claude AI agent using Microsoft's Agent365 SDK with Activity Protocol support.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up your environment variables:
   - Copy `.env.example` to `.env`
   - Add your Anthropic API key to `ANTHROPIC_API_KEY`
   - Add your Azure Monitor connection string to `AZURE_MONITOR_CONNECTION_STRING`
   - Add a GUID for `AGENT_BLUEPRINT_ID`

## Usage

### Start the agent server:
```bash
npm run dev
```

The agent will start on http://localhost:3978

### Test with M365 Agents Playground:

In a separate terminal, run:
```bash
npm run test-tool
```

This will open the M365 Agents Playground where you can interact with your agent.

## Architecture

- **Activity Protocol**: Uses Microsoft's Activity Protocol for messaging
- **Express Server**: Hosted via `@microsoft/agents-hosting-express`
- **Observability**: Integrated with Azure Monitor via Kairo SDK
- **Original Logic**: Preserves the Claude SDK query logic from the original agent

## Key Files

- `src/index.js` - Express server entry point
- `src/agent.js` - Agent logic with Activity Protocol handlers
- `src/telemetry.js` - Observability configuration
- `manifest.json` - Teams app manifest
- `agenticUserTemplateManifest.json` - Agent template definition
