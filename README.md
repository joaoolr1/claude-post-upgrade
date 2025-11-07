# Claude Backend Architect Agent - Activity Protocol with Observability

A Claude AI agent upgraded to use the Agent365 SDK with Activity Protocol support and comprehensive observability features.

## 🔭 Observability Features

This upgraded agent includes comprehensive observability capabilities:

- **🔍 Agent Monitoring**: Specialized tracing for AI agent invocations with detailed telemetry
- **🛠️ Tool Execution Tracking**: Monitor Claude's tool executions (WebSearch, Bash, Read, Write, Edit, Grep, Glob)
- **📊 OpenTelemetry Integration**: Built-in OpenTelemetry tracing for standardized observability
- **☁️ Azure Monitor Support**: Seamless integration with Azure Monitor for cloud-based monitoring
- **🧳 Baggage Propagation**: Context propagation across distributed agent systems
- **🎯 Multiple Span Types**: Support for invoke agent, execute tool, and inference call spans
- **👤 Enhanced Caller Tracking**: Detailed agent information with caller details and agent metadata
- **🧠 Granular Inference Telemetry**: Token counting, message recording, and finish reason tracking

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up your API key and observability configuration:
   - Copy `.env.example` to `.env`
   - Add your Anthropic API key to the `.env` file
   - Configure observability settings (already enabled by default)

## Environment Variables

### Required
- `ANTHROPIC_API_KEY` - Your Anthropic API key
- `PORT` - Server port (default: 3978)

### Observability Configuration
- `ENABLE_OBSERVABILITY=true` - Enable/disable observability
- `ENABLE_A365_OBSERVABILITY=true` - Enable Agent365 observability features
- `ENABLE_A365_OBSERVABILITY_EXPORTER=true` - Enable custom exporter
- `CLUSTER_CATEGORY=prod` - Deployment environment (preprod/prod)

## Usage

Start the agent server:
```bash
npm run dev
```

The agent will start on port 3978 with observability active and ready to accept Activity Protocol messages.

## Testing

Test the agent using M365 Agents Playground:

```bash
npm run test-tool
```

This will open the playground interface where you can send messages to the agent and see responses. All interactions will be tracked with comprehensive telemetry.

## Observability Details

### Agent Invocation Tracking
Every user message triggers an **Invoke Agent Span** that tracks:
- Agent details (ID, name, description)
- Caller information (user ID, name)
- Conversation and session context
- Input and output messages
- Execution type (Human-to-Agent)
- Service endpoint information

### Tool Execution Monitoring  
When Claude uses tools (WebSearch, Bash, etc.), **Execute Tool Spans** track:
- Tool name and arguments
- Tool call ID and description
- Tool execution results
- Error handling and recovery

### Inference Call Telemetry
Claude model interactions are monitored with **Inference Spans** that record:
- Model name and provider (claude-sonnet-4-20250514, Anthropic)
- Input/output token counts (estimated)
- Input and output messages
- Finish reasons and response IDs
- Performance metrics

### Distributed Tracing
**Baggage propagation** ensures context flows through all operations:
- Tenant and agent identification
- Correlation IDs for request tracking
- Caller and conversation context
- Operation source tracking

## Architecture

This agent uses:
- **Agent365 SDK** for Activity Protocol support
- **Agent365 Observability SDK** for comprehensive telemetry
- **Agent365 Runtime** for authentication and token management
- **Claude Agent SDK** for AI capabilities
- **Express** as the web server
- **Activity Protocol** for message handling
- **OpenTelemetry** for distributed tracing

The agent maintains the same expertise as the original (Senior Backend TypeScript Architect) but now includes full observability, making it production-ready with comprehensive monitoring and tracing capabilities.

## Available Scripts

- `npm start` - Start the agent in production mode
- `npm run dev` - Start with auto-reload for development
- `npm run test-tool` - Launch M365 Agents Playground for testing

## Graceful Shutdown

The agent includes graceful shutdown handling that properly closes observability telemetry connections and flushes any pending traces before exit.
