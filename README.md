# Claude Backend Architect Agent - Agent365 SDK# Claude Backend Architect Agent - Agent365 SDK



This is the upgraded version of the Claude AI agent using Microsoft's Agent365 SDK with Activity Protocol support and full observability.This is the upgraded version of the Claude AI agent using Microsoft's Agent365 SDK with Activity Protocol support.



## Setup## Setup



1. Install dependencies:1. Install dependencies:

```bash```bash

npm installnpm install

``````



2. Set up your environment variables:2. Set up your environment variables:

   - Copy `.env.example` to `.env`   - Copy `.env.example` to `.env`

   - Add your Anthropic API key to `ANTHROPIC_API_KEY`   - Add your Anthropic API key to `ANTHROPIC_API_KEY`

   - Add your Azure Monitor connection string to `AZURE_MONITOR_CONNECTION_STRING`   - Add your Azure Monitor connection string to `AZURE_MONITOR_CONNECTION_STRING`

   - Add a GUID for `AGENT_BLUEPRINT_ID`   - Add a GUID for `AGENT_BLUEPRINT_ID`



## Usage## Usage



### Start the agent server:### Start the agent server:

```bash```bash

npm run devnpm run dev

``````



The agent will start on http://localhost:3978The agent will start on http://localhost:3978



### Test with M365 Agents Playground:### Test with M365 Agents Playground:



In a separate terminal, run:In a separate terminal, run:

```bash```bash

npm run test-toolnpm run test-tool

``````



This will open the M365 Agents Playground where you can interact with your agent.This will open the M365 Agents Playground where you can interact with your agent.



## Architecture## Architecture



- **Activity Protocol**: Uses Microsoft's Activity Protocol for messaging- **Activity Protocol**: Uses Microsoft's Activity Protocol for messaging

- **Express Server**: Hosted via `@microsoft/agents-hosting-express`- **Express Server**: Hosted via `@microsoft/agents-hosting-express`

- **Observability**: Integrated with Azure Monitor via Agent365 Observability SDK- **Observability**: Integrated with Azure Monitor via Kairo SDK

- **Original Logic**: Preserves the Claude SDK query logic from the original agent- **Original Logic**: Preserves the Claude SDK query logic from the original agent



## Key Files## Key Files



- `src/index.js` - Express server entry point- `src/index.js` - Express server entry point

- `src/agent.js` - Agent logic with Activity Protocol handlers and observability- `src/agent.js` - Agent logic with Activity Protocol handlers

- `src/telemetry.js` - Observability configuration- `src/telemetry.js` - Observability configuration

- `.env` - Environment configuration- `manifest.json` - Teams app manifest

- `agenticUserTemplateManifest.json` - Agent template definition

## Features

✅ **Complete Agent365 SDK Integration**  
✅ **Activity Protocol Support**  
✅ **Full Observability with InvokeAgentScope and InferenceScope**  
✅ **Preserved Original Claude SDK Logic**  
✅ **Senior Backend TypeScript Architect Persona**  
✅ **Azure Monitor Integration**  
✅ **M365 Agents Playground Testing**  